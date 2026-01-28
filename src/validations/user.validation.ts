import { z } from "zod";

export const userUpdateValidation = z.object({
  body: z.object({
    firstname: z.string().min(1, "Firstname is required"),
    lastname: z.string().min(1, "Lastname is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().transform((val) => val.replace(/[\s-]/g, ""))
      .refine(
        (val) => /^\+?[0-9]{10,13}$/.test(val),
        "Invalid phone number"
      ),
    role: z.enum(["user", "admin"]).optional(),
  }),
  params: z.object({
    userId: z.string().min(1, "User ID is required"),
  }),
});
