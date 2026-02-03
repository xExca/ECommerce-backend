import path from "path";
import sharp from "sharp";
import User from "../models/user.model.js";
import fs from "fs/promises";
import { existsSync } from "fs";

interface CropArea {
  crop: { x: number; y: number };
  zoom: number;
  croppedAreaPixels: { x: number; y: number; width: number; height: number };
}

interface UpdateAvatarOptions {
  userId: string;
  cropArea: CropArea;
  fileBuffer?: Buffer | undefined;
}

export const updateAvatarService = async ({ userId, cropArea, fileBuffer}: UpdateAvatarOptions):
Promise<{ picture: { originalUrl: string; croppedUrl: string; updatedAt: Date } }> => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const uploadDir = path.join(process.cwd(), `public/uploads/profiles/${userId}`);
  await fs.mkdir(uploadDir, { recursive: true });

  const originalPath = path.join(uploadDir, "original.jpg");
  const croppedPath = path.join(uploadDir, "avatar.jpg");

  let image: Buffer;

  if (fileBuffer) {
    image = fileBuffer;
    await fs.writeFile(originalPath, image);
  } else {
    try {
      image = await fs.readFile(originalPath);
    } catch {
      throw new Error("No existing profile image found");
    }
  }

  const { x, y, width, height } = cropArea.croppedAreaPixels;

  await sharp(image)
    .extract({
      left: Math.round(x),
      top: Math.round(y),
      width: Math.round(width),
      height: Math.round(height),
    })
    .resize(256, 256)
    .jpeg({ quality: 90 })
    .toFile(croppedPath);

  const pictureData = {
    originalUrl: `/uploads/profiles/${userId}/original.jpg`,
    croppedUrl: `/uploads/profiles/${userId}/avatar.jpg`,
    updatedAt: new Date(),
  };

  user.picture = pictureData;
  user.avatarCrop = cropArea;
  await user.save();

  return { picture: pictureData };
};
