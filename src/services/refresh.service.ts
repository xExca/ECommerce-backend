import jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../models/user.model.js";
import { createAccessToken } from "../utils/jwt.js";  
import { REFRESH_TOKEN } from "../config/global.js";
import type { UserTypeDocument } from "../types/user.type.js";

export const refreshSession = async (refreshToken: string):
Promise<{ accessToken: string}> => {
  let payload: JwtPayload;

  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN!) as JwtPayload;
  } catch {
    throw new Error("Invalid refresh token 1");
  }

  const user = await User.findById(payload.userId).select("+refreshToken");;
  if (!user) {
    throw new Error("Invalid refresh token 2");
  }

  if (user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token 3");
  }

  const accessToken = createAccessToken(user);
  return { accessToken };
}