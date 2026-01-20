import type { Request, Response } from "express";
import { sendRefreshTokenCookie } from "../utils/jwt.js";
import { linkWithFacebook, loginWithFacebook } from "../services/facebook.service.js";


export const facebookLogin = async (req: Request, res: Response) => {
  try {
    const { accessToken } = req.body;

    if (!accessToken) {
      return res.status(400).json({ message: "Missing Facebook access token" });
    }

    const { user, accessToken: accessJWT, refreshToken } = await loginWithFacebook(accessToken); 

    sendRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({ user, accessToken: accessJWT });

  } catch (error: any) {
    console.error("Facebook login error:", error);
    return res.status(400).json({ message: error.message });
  }
}

export const facebookLink = async (req: Request, res: Response) => {
  try {
     const user = req.user;
     if(!user) {
      throw new Error("Not authenticated");
    }

     
    const { profile, token } = req.body;

    if(!profile || !token) {
      throw new Error("Missing Facebook profile or token");
    }

    const updatedUser = await linkWithFacebook(user, profile, token);
    return res.status(200).json({ message: "Facebook account linked successfully", user: updatedUser });
  } catch (error: any) {
    
  }
}