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