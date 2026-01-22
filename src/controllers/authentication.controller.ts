import type { Request, Response } from "express";
import { clearRefreshTokenCookie } from "../utils/jwt.js";
import { checkIfUserExists, createOtpCode, logoutUser } from "../services/authentication.service.js";
import { ENV } from "../config/global.js";
import OTP from "../models/otp.model.js";

export const logout = async(req:Request, res:Response) => {
 try{
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ message: "Not authenticated"});
    }

    await logoutUser(user._id); 

    clearRefreshTokenCookie(res);
    res.status(200).json({ message: 'Logout successful' });
 } catch (error:any) {
    console.error('Logout error:', error);
    res.status(500).json({ error: error.message });
  }
}

export const login = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.body;

    if(!identifier || typeof identifier !== 'string') { 
      return res.status(400).json({ message: 'Email is required' });
    }

    const { user } = await checkIfUserExists(identifier);

    if(!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    await OTP.deleteMany({ userId: user._id });
    
    const { otpCode, expiredAt } = await createOtpCode(user);

    const response: any = { expiredAt };
    if(ENV !== 'production') {  
      response.otpCode = otpCode;
    }
    
    return res.status(200).json(response);
  } catch(error:any) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message });
  }
}