import type { Request, Response, NextFunction } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";
import User from "../models/user.model.js";
import type { UserType } from "../models/user.model.js";
import { ACCESS_TOKEN } from "../config/global.js";

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers["authorization"];
    if(!authHeader) {
      return res.status(401).json({ message: "No or invalid token provided" });
    }

    const token = authHeader.split(" ")[1];
    if(!token) {
      return res.status(401).json({ message: "No or invalid token provided" });
    }

    if(!ACCESS_TOKEN) {
      throw new Error("ACCESS_TOKEN is not defined");
    }

    const decoded = jwt.verify(token, ACCESS_TOKEN) as JwtPayload;

    if(!decoded) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    const user = await User.findById(decoded.userId);
    if(!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user.toObject() as UserType;

    next();

  } catch (err) {
    console.error("Auth middleware error:", err);
    return res.status(401).json({ message: "Authentication failed" });
  }
}