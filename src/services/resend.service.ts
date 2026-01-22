import OTP from "../models/otp.model.js";
import { checkIfUserExists, createOtpCode } from "./authentication.service.js";

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