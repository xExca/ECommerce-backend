import type { Request, Response } from "express";
import { getLinkedAccount } from "../services/user.service.js";

export const linkedAccount = async (req:Request, res:Response) => {
  try { 
    const { userId } = req.params;

    if(!userId) {
      return res.status(400).json({ message: 'User id is required' });
    }
    
    const { providers } = await getLinkedAccount(String(userId));

    return res.status(200).json(providers);

  } catch (error:any) {
    console.log('Get linked account error:', error);
    return res.status(400).json({ message: error.message });
  }
}