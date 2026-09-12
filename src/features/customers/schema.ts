import { z } from "zod";

export const customerFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(6, "A valid phone number is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  address: z.string().optional(),
  type: z.enum(["walk_in", "regular"]),
  notes: z.string().optional(),
});
export type CustomerFormValues = z.infer<typeof customerFormSchema>;

export const deviceFormSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  type: z.enum(["phone", "tablet", "smartwatch", "laptop"]),
  imei: z.string().min(4, "IMEI / serial number is required"),
  color: z.string().optional(),
  conditionNotes: z.string().optional(),
});
export type DeviceFormValues = z.infer<typeof deviceFormSchema>;
