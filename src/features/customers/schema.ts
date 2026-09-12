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
