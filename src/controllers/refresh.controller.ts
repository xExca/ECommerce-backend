import type { Response, Request } from "express";
import { clearRefreshTokenCookie, createAccessToken, sendRefreshTokenCookie } from "../utils/jwt.js";
import { refreshSession } from "../services/refresh.service.js";

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      throw new Error("Refresh token not provided");
    }

    const {accessToken } = await refreshSession(refreshToken);

    return res.status(200).json({ accessToken });
  } catch (error: any) {
    clearRefreshTokenCookie(res);
    console.error("Refresh error:", error);
    return res.status(400).json({ message: error.message });
  }
};