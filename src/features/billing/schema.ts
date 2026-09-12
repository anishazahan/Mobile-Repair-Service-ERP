import { z } from "zod";

export const recordPaymentSchema = z.object({
  amount: z.number().min(0.01, "Enter a payment amount"),
  method: z.enum(["cash", "card", "mobile_wallet", "bank_transfer"]),
});
export type RecordPaymentValues = z.infer<typeof recordPaymentSchema>;
