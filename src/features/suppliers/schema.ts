import { z } from "zod";

export const supplierFormSchema = z.object({
  name: z.string().min(2, "Supplier name is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  phone: z.string().min(6, "A valid phone number is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  address: z.string().optional(),
});
export type SupplierFormValues = z.infer<typeof supplierFormSchema>;
