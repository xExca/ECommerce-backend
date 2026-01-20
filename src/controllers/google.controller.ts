import type { Request, Response } from "express";
import { linkGoogleAccount, loginWithGoogle } from "../services/google.service.js";
import { sendRefreshTokenCookie } from "../utils/jwt.js";


export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { profile, token } = req.body; 
      
    if(!profile || !token) {
      return res.status(400).json({ message: "Missing Google profile or token" });
    }

    const { user, accessToken, refreshToken } = await loginWithGoogle(profile, token);

    sendRefreshTokenCookie(res, refreshToken);
    
    return res.status(200).json({ user, accessToken });

  } catch(error: any) {
    console.error("Google login error:", error);
    return res.status(400).json({ message: error.message });
  }
}

export const googleLink = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) return res.status(401).json({ message: "Not authenticated" });

    const { profile, token } = req.body;
    if (!profile || !token) {
      return res.status(400).json({ message: "Missing Google profile or token" });
    }

    const updatedUser = await linkGoogleAccount(user, profile, token);

    return res.status(200).json({ message: "Google account linked successfully", user: updatedUser });
  } catch (error: any) {
    console.error("Google link error:", error);
    return res.status(400).json({ message: error.message });
  }
};