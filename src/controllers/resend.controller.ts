import type { Request, Response } from "express";
import { resendOtpService, resendOtpSignupService } from "../services/resend.service.js";
import { ENV } from "../config/global.js";

export const resendOtp = async (req: Request, res: Response) => {
  try {
    const identifier: string = req.params.identifier as string;
    
    if (!identifier) {
      throw new Error("Email is required.");
    }

    const { otpCode } = await resendOtpService(identifier);

    const response: any = { };
    if(ENV !== 'production') {
      response.otpCode = otpCode;
    }
    res.status(200).json(response);

  } catch(error:any) {
    console.log("Resend OTP error:", error);
    res.status(500).json({ error: error.message });
  }
};

export const resendOtpSignup = async (req: Request, res: Response) => {
  try {
    const { identifier } = req.params;

    if (!identifier) {
      throw new Error("Email is required.");
    }

    const { otpCode } = await resendOtpSignupService(String(identifier));

    const response: any = { };
    if(ENV !== 'production') {
      response.otpCode = otpCode;
    }
    res.status(200).json(response);
  } catch (error:any) {
    console.log("Resend OTP Sign up error:", error);
    res.status(500).json({ error: error.message });
  }
}