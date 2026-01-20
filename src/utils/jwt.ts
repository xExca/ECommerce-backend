import jwt from "jsonwebtoken";
import type { UserType } from "../models/user.model.js";
import type { Response } from "express";
import type { Document } from "mongoose";
import { ACCESS_TOKEN } from "../config/global.js";
import { sign } from "node:crypto";

interface JWTUserPayload {
  userId: string;
  role: UserType["role"];
  email: string;
}

const getUserId = (user: Document<unknown, {}, UserType> & UserType | UserType): string => {
  return (user as any)._id.toString();
};

export const createAccessToken = (user:Document<unknown, {}, UserType> & UserType | UserType):string => {

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

export const createRefreshToken = (user: Document<unknown, {}, UserType> & UserType | UserType ): string => {
  if (!process.env.REFRESH_TOKEN) throw new Error("REFRESH_TOKEN is not defined");

  const payload: JWTUserPayload = {
    userId: getUserId(user),
    role: user.role,
    email: user.email,
  };

  return jwt.sign(payload, process.env.REFRESH_TOKEN, { expiresIn: "15d" });
};

export const sendRefreshTokenCookie = (res: Response, refreshToken: string) => {
  res.cookie("refreshToken", refreshToken, 
    { httpOnly: true, 
      secure: true, 
      sameSite: "strict",
      path: "/api/auth/refresh",
      maxAge: 1000 * 60 * 60 * 24 * 15 
    });
}


export const clearRefreshTokenCookie = (res: Response) => {
  res.clearCookie("refreshToken", { path: "/api/auth/refresh" });
};

