import { z } from "zod";

export const PART_CATEGORIES = [
  "screen",
  "battery",
  "charging_port",
  "camera",
  "speaker",
  "motherboard",
  "other",
] as const;

export const partFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  category: z.enum(PART_CATEGORIES),
  compatibleModels: z.string().min(1, "List at least one compatible model, comma-separated"),
  quantityInStock: z.number().min(0, "Enter a valid quantity"),
  reorderLevel: z.number().min(0, "Enter a valid reorder level"),
  unitCost: z.number().min(0, "Enter a valid cost"),
  sellingPrice: z.number().min(0, "Enter a valid price"),
  supplierId: z.string(),
});
export type PartFormValues = z.infer<typeof partFormSchema>;

export const restockSchema = z.object({
  quantity: z.number().min(1, "Enter a quantity to add"),
});
export type RestockValues = z.infer<typeof restockSchema>;
