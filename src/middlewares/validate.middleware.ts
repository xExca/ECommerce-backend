import type { Request, Response, NextFunction } from "express";
import { ZodObject, type ZodRawShape, ZodError } from "zod";

export const validate = (schema: ZodObject<ZodRawShape>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body || {},
        params: req.params,
        query: req.query,
      });

      next();
    } catch (err: unknown) {
      if (err instanceof ZodError) {
        const formattedErrors: Record<string, string> = {};

       err.issues.forEach((issue) => {
        const field = issue.path[issue.path.length - 1] as string;

        if (!formattedErrors[field]) {
          formattedErrors[field] = issue.message;
        }
      });

        return res.status(400).json({
          validation: false,
          errors: formattedErrors,
        });
      }

      return res.status(500).json({
        validation: false,
        errors: { message: "Internal server error" },
      });
    }
  };
};
