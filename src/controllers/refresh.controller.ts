import type { Response, Request } from "express";
import { clearRefreshTokenCookie, createAccessToken, sendRefreshTokenCookie } from "../utils/jwt.js";
import { refreshSession } from "../services/refresh.service.js";

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;
    if (!refreshToken) throw new Error("No refresh token");

    const { accessToken } = await refreshSession(refreshToken);
    return res.status(200).json({ accessToken });
  } catch (error: any) {
    clearRefreshTokenCookie(res);
    return res.status(401).json({ message: error.message });
  }
};