import type { Request, Response } from "express";
import { loginWithGoogle } from "../services/google.service.js";
import { sendRefreshTokenCookie } from "../utils/jwt.js";


export const googleLogin = async (req: Request, res: Response) => {
  try {
    const { profile, token } = req.body; 
      
    if(!profile || !token) {
      return res.status(400).json({ message: "Missing Google profile or token" });
    }

    const { user, accessToken, refreshToken } = await loginWithGoogle(profile, token);

    sendRefreshTokenCookie(res, refreshToken);
    
    return res.status(200).json({ user, accessToken, refreshToken });

  } catch(error) {

  }
}