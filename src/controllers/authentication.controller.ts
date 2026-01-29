import type { Request, Response } from "express";
import { clearRefreshTokenCookie } from "../utils/jwt.js";
import { checkIfUserExists, createOtpCode, createOtpCodeSignup, logoutUser } from "../services/authentication.service.js";
import { ENV } from "../config/global.js";
import OTP from "../models/otp.model.js";
import User from "../models/user.model.js";

export const logout = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = "";
        await user.save();
      }
    }

    clearRefreshTokenCookie(res);
    return res.status(200).json({ message: "Logout successful" });

  } catch (error: any) {
    console.error("Logout error:", error);
    return res.status(500).json({ message: error.message });
  }
};


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

export const signup = async (req: Request, res: Response) => {
  try {
    const { firstname, lastname, identifier } = req.body;

    if(!firstname) {
      return res.status(400).json({ message: 'First name is required' });
    }
    if(!lastname) {
      return res.status(400).json({ message: 'Last name is required' });
    }
    if(!identifier) {
      return res.status(400).json({ message: 'Identifier is required' });
    }

    const { user } = await checkIfUserExists(identifier);

    if(user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const { otpCode, expiredAt } = await createOtpCodeSignup(identifier);

    const response: any = { 
      expiredAt,
      message: 'Otp code has been sent to your email',
    };
    if(ENV !== 'production') {  
      response.otpCode = otpCode;
    }
    
    return res.status(200).json(response);
  } catch(error: any) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
}