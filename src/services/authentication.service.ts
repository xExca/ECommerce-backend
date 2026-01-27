
import { createHash } from "crypto";
import User, { type UserType } from "../models/user.model.js";
import OTP from "../models/otp.model.js";
import { isValidObjectId, type HydratedDocument } from "mongoose";

export const logoutUser = async (userId: string) => {
  const currentUser = await User.findOne({ _id: userId });

  if (!currentUser) {
    throw new Error('User not found');
  }

  currentUser.refreshToken = "";
  await currentUser.save();
};

export const checkIfUserExists = async (identifier: string):
Promise<{user: HydratedDocument<UserType> | null}> => {
  const normalized = identifier.trim().toLowerCase();
  const isEmail = normalized.includes("@");

  const user = isEmail ? await User.findOne({ email: normalized }) : await User.findOne({ phone: identifier.trim() });

  return { user };
};

export const checkUserById = async (userId: string):
Promise<{user: HydratedDocument<UserType> | null}> => {
  try {
    
    if(!isValidObjectId(userId)) {
      throw new Error("User id is invalid");
    }
    const user = await User.findById(userId);

    return { user };
  } catch (error: any) {
    console.log("Check user by id error:", error);
    throw new Error(error.message);
  }
}

export const createOtpCode = async(user: UserType ):
Promise<{otpCode: string, expiredAt: Date}> => {
  const otpCode = (Math.floor(100000 + Math.random() * 900000)).toString();
  const codeHash = createHash('sha256').update(otpCode).digest('hex');
  const expiredAt = new Date(Date.now() + 5 * 60 * 1000);

  await OTP.create({
    userId: user._id,
    codeHash,
    expiredAt
  });

  return {otpCode, expiredAt};
};

export const createOtpCodeSignup = async(identifier: string):
Promise<{otpCode: string, expiredAt: Date}> => {
  const otpCode = (Math.floor(100000 + Math.random() * 900000)).toString();
  const codeHash = createHash('sha256').update(otpCode).digest('hex');
  const expiredAt = new Date(Date.now() + 15 * 60 * 1000);

  await OTP.create({
    email: identifier,
    codeHash,
    expiredAt
  });

  return {otpCode, expiredAt};
}