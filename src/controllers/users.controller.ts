import type { NextFunction, Request, Response } from "express";
import { checkUserById } from "../services/authentication.service.js";
import { getAllUsers, userDelete, userUpdate } from "../services/user.service.js";

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const payload = req.body;
    if (!userId) {
      throw new Error("User id is required");
    }

    if (!payload.firstname || !payload.lastname) {
      throw new Error("First name and last name are required");
    }

    const { user } = await checkUserById(String(userId));

    if (!user) {
      throw new Error("User not found");
    }
    
    const { message } = await userUpdate(String(userId), payload);

    return res.status(200).json({ message });

  } catch (error: any) {
    console.log("Update user error:", error);
    throw new Error(error.message);
  }
}

export const getUsers = async (req:Request, res: Response, next: NextFunction) => {
  try {
    const { page, limit } = req.query;
    const users = await getAllUsers(1, 10);

    if(!users){
      return res.status(204).json({ message: "No users found" });
    }
    
    return res.status(200).json(users);
  } catch (err) {
    next(err);
  }
}

export const getUser = async (req:Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!userId) {  
      throw new Error("User id is required");
    }

    const { user } = await checkUserById(String(userId));

    if (!user) {
      throw new Error("User not found");
    }

    return res.status(200).json(user);
  } catch (err:any) {
    console.log("Get user error:", err);
    return res.status(500).json({ message: err.message });
  }
}

export const deleteUser = async (req:Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      throw new Error("User id is required");
    }

    const { user } = await checkUserById(String(userId));

    if (!user) {
      throw new Error("User not found");
    }

    const { message } = await userDelete(String(userId));

    return res.status(200).json({ message });

  } catch (err:any) {
    console.log("Delete user error:", err);
    throw new Error(err.message);
  }
}

