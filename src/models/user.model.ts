import mongoose from "mongoose";
import { Document, Types } from "mongoose";

export interface UserType {
  _id: Types.ObjectId,
  email: string,
  phone?: string,
  providers?: {
    google?: { id?: string; email?: string };
    facebook?: { id?: string; email?: string };
  },
  firstname: string,
  lastname: string,
  picture?: {
    croppedUrl?: string;
    originalUrl?: string;
  },
  avatarCrop?: {
    crop?: { x?: number; y?: number };
    zoom?: number;
    croppedAreaPixels?: { x?: number; y?: number; width?: number; height?: number };
  },
  role: "user" | "admin",
  refreshToken?: string;
  lastLoginAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUser extends UserType, Document {}

const avatarCropSchema = new mongoose.Schema(
  {
    crop: {
      x: { type: Number },
      y: { type: Number },
    },
    zoom: Number,
    croppedAreaPixels: {
      x: { type: Number },
      y: { type: Number },
      width: { type: Number },
      height: { type: Number },
    },
  },
  { _id: false }
);

const providerSchema = new mongoose.Schema(
  {
    id: { type: String, unique: true, sparse: true },
    email: String,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema({
  email: {
    type: String, 
    unique: true,
    lowercase: true,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
    default: "",
  },
  providers: {
    google: providerSchema,
    facebook: providerSchema,
  },
  firstname: {
    type: String,
    required: true,
    trim: true,
  },
  lastname: {
    type: String,
    required: true,
    trim: true,
  },
  picture: {
    croppedUrl: String,
    originalUrl: String,
  },
  avatarCrop: avatarCropSchema,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  refreshToken: { type: String, select: false },
  lastLoginAt: Date,
  createdAt: Date,
  updatedAt: Date,
});

export const User = mongoose.model<IUser>("User", userSchema);

export default User;