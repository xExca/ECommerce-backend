import type { Response, Request } from "express";
import { sendRefreshTokenCookie } from "../utils/jwt.js";
import { refreshSession } from "../services/refresh.service.js";

export const refresh = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { accessToken, refreshToken: newRefreshToken } = await refreshSession(refreshToken);

    sendRefreshTokenCookie(res, newRefreshToken);

    return res.status(200).json({ accessToken });
  } catch (error: any) {
    console.error("Refresh error:", error);
    return res.status(400).json({ message: error.message });
  }
};