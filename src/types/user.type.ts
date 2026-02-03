import type { Document } from "mongoose";
import type { UserType } from "../models/user.model.js";

export type UserTypeDocument = Document<unknown, {}, UserType> & UserType;


export interface UserUpdatePayload {
  firstname: string,
  lastname: string,
  email: string,
  phone: string,
  role?: "user" | "admin"
}

export interface updateAvatarPayload {
  cropArea: {
    crop: {
      x: number,
      y: number
    },
    zoom: number,
    croppedAreaPixels: {
      x: number,
      y: number,
      width: number,
      height: number
    }
  }
}