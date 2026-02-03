import type { NextFunction, Request, Response } from "express";
import { checkUserById } from "../services/authentication.service.js";
import { getAllUsers, getUserAvatarCrop, userDelete, userUpdate } from "../services/user.service.js";
import type { UserUpdatePayload, updateAvatarPayload } from "../types/user.type.js";
import { updateAvatarService } from "../services/avatar.service.js";

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const payload: UserUpdatePayload = req.body;
    const authUser = req.user;

    const { user } = await checkUserById(String(userId));

    if (!user) {
      throw new Error("User not found");
    }

    const { user: updatedUser } = await userUpdate({ userId: String(userId), authUser, payload, });

    return res.status(200).json({ user: updatedUser });
  } catch (error: any) {
    console.log("Update user error:", error);
    return res.status(500).json({ message: error.message });
  }
}

export const getUsers = async (req:Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const users = await getAllUsers(1, 10);

    if(!users){
      return res.status(204).json({ message: "No users found" });
    }
    
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export const getUser = async (req:Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!userId) {  
      throw new Error("User id is required");
    }

    const { user } = await checkUserById(String(userId));

    if (!user) {
      throw new Error("User not found");
    }

    return res.status(200).json(user);
  } catch (err:any) {
    console.log("Get user error:", err);
    return res.status(500).json({ message: err.message });
  }
}

export const deleteUser = async (req:Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new Error("User id is required");
    }

    const { user } = await checkUserById(String(userId));

    if (!user) {
      throw new Error("User not found");
    }

    const { message } = await userDelete(String(userId));

    return res.status(200).json({ message });

  } catch (err:any) {
    console.log("Delete user error:", err);
    throw new Error(err.message);
  }
}

export const updateAvatar = async (req: Request<{}, {}, updateAvatarPayload>, res: Response) => {
  try {
    const { _id } = req.user;
    const { cropArea } = req.body;

    if (!_id) throw new Error("Not Authorized");
    if (!cropArea) throw new Error("Crop area is required");

    const picture = await updateAvatarService({ userId: _id, cropArea, fileBuffer: req.file?.buffer });

    return res.status(200).json({
      message: "Avatar updated successfully",
      picture: picture.picture,
    });

  } catch (err: any) {
    console.error("Update avatar error:", err);
    return res.status(500).json({ message: err.message });
  }
}

export const getCropArea = async (req: Request, res: Response) => {
  try {
    const { _id } = req.user;

    if (!_id) {
      throw new Error("Not Authorized");
    }

    const avatarCrop = await getUserAvatarCrop(_id);

    if (!avatarCrop) {
      throw new Error("Avatar not found");
    }

    return res.status(200).json(avatarCrop);

  } catch(error:any) {
    console.log("Get crop area error:", error);
    return res.status(500).json({ message: error.message });
  }
}