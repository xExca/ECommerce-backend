import OTP from "../models/otp.model.js";
import { checkIfUserExists, createOtpCode, createOtpCodeSignup } from "./authentication.service.js";

export const resendOtpService = async(identifier:string):
Promise<{otpCode: string}> => {
  try {

    const { user } = await checkIfUserExists(identifier);

    if(!user) {
      throw new Error("User not found.");
    }
    
    await OTP.deleteMany({ userId: user._id });

    const { otpCode, expiredAt } = await createOtpCode(user);
    if(!otpCode) {
      throw new Error("Failed to create OTP code.");
    }

    return {otpCode};

  } catch(error:any) {
    console.log("Resend OTP error:", error);
    throw new Error(error.message);
  }
}

export const resendOtpSignupService = async (identifier: string): 
Promise<{ otpCode: string }> => {
  try {
    const normalized = identifier.trim().toLowerCase();

    await OTP.deleteMany({
      email: normalized,
      used: false,
      expiredAt: { $gt: new Date() }
    });

    const { otpCode } = await createOtpCodeSignup(normalized);

    if (!otpCode) {
      throw new Error("Failed to create OTP code.");
    }

    return { otpCode };
  } catch (error: any) {
    console.error("resendOtpSignupService error:", error);
    throw error;
  }
};
