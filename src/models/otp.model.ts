import mongoose from "mongoose";
import { Document, Types } from "mongoose";

export interface OTPType {
  userId?: Types.ObjectId;
  email?: string;
  codeHash: string;
  expiredAt: Date;
  used: boolean;
  createdAt: Date;
}

const OTPSchema = new mongoose.Schema<OTPType>({
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: false,
    index: true,
  },
  codeHash: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    index: true,
  },
  expiredAt: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, {
  collection: "otp_codes"
});

OTPSchema.index({ expiredAt: 1 }, { expireAfterSeconds: 0 });
OTPSchema.index({ used: 1 }, { expireAfterSeconds: 0 });

export const OTP = mongoose.model("OTP", OTPSchema);

export default OTP;