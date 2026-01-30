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

const numberField = (name: string) =>
  z.preprocess(
    (val) => {
      if (val === null || val === undefined || val === "") {
        return undefined;
      }
      if (typeof val === "string" && val.trim() === "") {
        return undefined;
      }
      return val;
    },
    z.number({ message: `${name} must be a number`})
      .refine((v) => v !== undefined, {
        message: `${name} is required`,
      })
  );
  
export const updateAvatarValidation = z.object({
  body: z.object({
    cropArea: z
      .object({
        crop: z.object({
          x: numberField("Crop X"),
          y: numberField("Crop Y"),
        }).optional(),

        zoom: numberField("Zoom").optional(),

        croppedAreaPixels: z.object({
          x: numberField("Pixel X"),
          y: numberField("Pixel Y"),
          width: numberField("Width"),
          height: numberField("Height"),
        }).optional(),
      })
      .strict()
      .superRefine((val, ctx) => {
        if (!val.crop) {
          ctx.addIssue({
            code: "custom",
            path: ["crop"],
            message: "crop is Required",
          });
        }
        if (val.zoom === undefined) {
          ctx.addIssue({
            code: "custom",
            path: ["zoom"],
            message: "zoom is Required",
          });
        }
        if (!val.croppedAreaPixels) {
          ctx.addIssue({
            code: "custom",
            path: ["croppedAreaPixels"],
            message: "croppedAreaPixels is Required",
          });
        }
      }),
  }),
});

