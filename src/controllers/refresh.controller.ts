import type { Response, Request } from "express";
import { clearRefreshTokenCookie, createAccessToken, sendRefreshTokenCookie } from "../utils/jwt.js";
import { refreshSession } from "../services/refresh.service.js";
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN } from "../config/global.js";
import User from "../models/user.model.js";

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new Error("Refresh token not provided");
    }

    const { user, accessToken, refreshToken: newRefreshToken } = await refreshSession(refreshToken);

    sendRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({ user, accessToken });
  } catch (error: any) {
    clearRefreshTokenCookie(res);
    console.error("Refresh error:", error);
    return res.status(400).json({ message: error.message });
  }
};

export const refresh_2 = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    let payload: JwtPayload;
    try {
      payload = jwt.verify(refreshToken, REFRESH_TOKEN ?? '') as JwtPayload;
    } catch (error) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const user = await User.findById(payload.userId);

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    const accessToken = createAccessToken(user);

    res.status(200).json({
      message: 'Token refreshed successfully',
      accessToken,
      user
    });
  }
  catch (error: any) {
    console.error('Google login error:', error);
    res.status(500).json({ error: error.message });
  }
}