import jwt from "jsonwebtoken";
import type { UserType } from "../models/user.model.js";
import type { Response } from "express";
import type { Document } from "mongoose";
import { ACCESS_TOKEN, ENV, REFRESH_TOKEN } from "../config/global.js";
import { sign } from "node:crypto";
import type { UserTypeDocument } from "../types/user.type.js";

interface JWTUserPayload {
  userId: string;
  role: UserType["role"];
  email: string;
}

const getUserId = (user: UserTypeDocument | UserType): string => {
  return (user as any)._id.toString();
};

export const createAccessToken = (user:UserTypeDocument | UserType):string => {

  if(!ACCESS_TOKEN) {
    throw new Error("ACCESS_TOKEN is not defined");
  }

  const payload: JWTUserPayload = {
    userId: getUserId(user),
    role: user.role,
    email: user.email,
  };

  return jwt.sign(payload, ACCESS_TOKEN, {expiresIn: "15m"});
}

export const createRefreshToken = (user: UserTypeDocument | UserType ): string => {
  if (!REFRESH_TOKEN) throw new Error("REFRESH_TOKEN is not defined");

  const payload: JWTUserPayload = {
    userId: getUserId(user),
    role: user.role,
    email: user.email,
  };

  return jwt.sign(payload, REFRESH_TOKEN, { expiresIn: "15d" });
};

export const sendRefreshTokenCookie = (res: Response, refreshToken: string) => {
   res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: ENV === "production",
    sameSite: ENV === "production" ? "none" : "lax",
    path: "/api/auth",
    maxAge: 1000 * 60 * 60 * 24 * 15,
  });
}


export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("refreshToken", {
    path: "/api/auth",
    httpOnly: true,
    sameSite: ENV === "production" ? "none" : "lax",
    secure: ENV === "production",
  });
};

