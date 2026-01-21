import type { Document } from "mongoose";
import { User, type UserType } from "../models/user.model.js";
import { createHash } from "node:crypto";
import OTP from "../models/otp.model.js";
import { createAccessToken, createRefreshToken } from "../utils/jwt.js";
import { checkIfUserExists } from "./authentication.service.js";

export const checkOTP = async (identifier:string , code: string):
Promise<{user: Document<unknown, {}, UserType> & UserType, accessToken:string, refreshToken: string}> => {
  try {
    const { user } = await checkIfUserExists(identifier);

    if (!user) {
      throw new Error("User not found.");
    }

    const codeHash = createHash('sha256').update(String(code)).digest('hex'); 
    const now = new Date();
    
    const otpCheck = await OTP.findOne({
      userId: user._id,
      codeHash,
      used: false,
      expiredAt: { $gt: now },
    });

    if (!otpCheck) {
      throw new Error("Invalid code.");
    }

    if(otpCheck.expiredAt < now) {
      throw new Error("Code has expired.");
    }

    otpCheck.used = true;
    await otpCheck.save();

    
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    user.lastLoginAt = now;
    user.refreshToken = refreshToken;
    await user.save();

    return { user, accessToken, refreshToken };
  } catch(error) {
    console.log("Error checking OTP:", error);
    throw error;
  }
}