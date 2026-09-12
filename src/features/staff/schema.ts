import { z } from "zod";

export const staffFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
  role: z.enum(["admin", "manager", "front_desk", "technician"]),
  linkedTechnicianId: z.string(),
});
export type StaffFormValues = z.infer<typeof staffFormSchema>;
