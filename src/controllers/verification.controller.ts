import type { Request, Response } from "express";
import { checkOTP } from "../services/verification.service.js";
import { sendRefreshTokenCookie } from "../utils/jwt.js";

export const verify = async (req: Request, res: Response) => {
  try { 
    const { identifier, code } = req.body;

    if (!identifier || !code) {
      throw new Error("Missing identifier or code");
    }

    const { user, accessToken, refreshToken } = await checkOTP(identifier, code);

    sendRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({message: "Verification successful", user, accessToken, });

  } catch (error: any) {
    console.log("Verification error:", error);
    return res.status(400).json({ message: error.message });
  }
}