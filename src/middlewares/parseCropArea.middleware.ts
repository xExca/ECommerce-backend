import type { Request, Response, NextFunction } from "express";

export const parseCropArea = (req: Request,res: Response,next: NextFunction) => {
  try {
    if (typeof req.body.cropArea === "string") {
      req.body.cropArea = JSON.parse(req.body.cropArea);
    }
    next();
  } catch {
    return res.status(400).json({
      validation: false,
      errors: { cropArea: "Invalid JSON format" },
    });
  }
};
