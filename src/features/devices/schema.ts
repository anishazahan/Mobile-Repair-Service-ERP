import { z } from "zod";

// Canonical device form shape — shared by the Devices module's own
// add/edit dialog and the Customer detail page's "Add Device" action, so
// both modules stay in lockstep instead of drifting apart.
export const deviceFormSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  type: z.enum(["phone", "tablet", "smartwatch", "laptop"]),
  imei: z.string().min(4, "IMEI / serial number is required"),
  color: z.string().optional(),
  purchaseDate: z.string().optional(),
  conditionNotes: z.string().optional(),
});
export type DeviceFormValues = z.infer<typeof deviceFormSchema>;
