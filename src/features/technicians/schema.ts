import { z } from "zod";

export const TECHNICIAN_SPECIALTIES = [
  "screen",
  "battery",
  "charging_port",
  "motherboard",
  "software",
  "water_damage",
  "camera",
  "general",
] as const;

export const technicianFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(6, "A valid phone number is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  specialties: z.array(z.enum(TECHNICIAN_SPECIALTIES)).min(1, "Select at least one specialty"),
});
export type TechnicianFormValues = z.infer<typeof technicianFormSchema>;
