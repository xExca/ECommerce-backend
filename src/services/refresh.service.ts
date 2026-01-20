import jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../models/user.model.js";
import { createAccessToken, createRefreshToken } from "../utils/jwt.js";  
import { REFRESH_TOKEN } from "../config/global.js";

export const refreshSession = async (refreshToken: string) => {

  if(!refreshToken) {
    throw new Error("Refresh token not provided");
  }

  let payload: JwtPayload;

  try {
    payload = jwt.verify(refreshToken, REFRESH_TOKEN!) as JwtPayload;
  } catch (error) {
    throw new Error("Invalid refresh token");
  }

  if(payload.type !== "refresh") {
    throw new Error("Invalid refresh token");
  }

  const user = await User.findById(payload.userId);
  
  if(!user || user.refreshToken !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const accessToken = createAccessToken(user);
  const newRefreshToken = createRefreshToken(user);

  user.refreshToken = newRefreshToken;
  await user.save();

  return { accessToken, refreshToken: newRefreshToken };
}