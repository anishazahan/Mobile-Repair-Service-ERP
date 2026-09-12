import { z } from "zod";

export const shopSettingsFormSchema = z.object({
  shopName: z.string().min(2, "Shop name is required"),
  phone: z.string().min(6, "A valid phone number is required"),
  email: z.string().email("Enter a valid email"),
  address: z.string().min(2, "Address is required"),
  taxRatePercent: z.number().min(0, "Enter a valid rate").max(100, "Enter a rate between 0 and 100"),
});
export type ShopSettingsFormValues = z.infer<typeof shopSettingsFormSchema>;

export const SERVICE_CATALOG_CATEGORIES = ["Hardware Repair", "Software", "Advanced Repair", "Diagnostics"] as const;

export const serviceCatalogFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  category: z.string().min(1, "Category is required"),
  basePrice: z.number().min(0, "Enter a valid price"),
  estDurationMinutes: z.number().min(1, "Enter a valid duration"),
  description: z.string().optional(),
});
export type ServiceCatalogFormValues = z.infer<typeof serviceCatalogFormSchema>;

export const myProfileFormSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.string().email("Enter a valid email"),
});
export type MyProfileFormValues = z.infer<typeof myProfileFormSchema>;
