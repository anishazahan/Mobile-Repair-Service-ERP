import { z } from "zod";

export const newOrderSchema = z.object({
  customerId: z.string().min(1, "Select or add a customer"),
  deviceId: z.string().min(1, "Select or add a device"),
  reportedIssue: z.string().min(5, "Describe the reported issue (at least 5 characters)"),
  priority: z.enum(["normal", "urgent"]),
  accessoriesReceived: z.array(z.string()),
  conditionNotes: z.string().optional(),
  ballparkEstimateNote: z.string().optional(),
});
export type NewOrderValues = z.infer<typeof newOrderSchema>;

export const newCustomerSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(6, "A valid phone number is required"),
  email: z.string().email("Enter a valid email").optional().or(z.literal("")),
});
export type NewCustomerValues = z.infer<typeof newCustomerSchema>;

export const newDeviceSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  imei: z.string().min(4, "IMEI / serial number is required"),
  color: z.string().optional(),
});
export type NewDeviceValues = z.infer<typeof newDeviceSchema>;

export const diagnosisSchema = z.object({
  diagnosisNotes: z.string().min(5, "Describe the diagnosis"),
  laborCost: z.number().min(0, "Enter a labor cost"),
});
export type DiagnosisValues = z.infer<typeof diagnosisSchema>;

export const approvalSchema = z
  .object({
    decision: z.enum(["approved", "declined"]),
    method: z.string().optional(),
    declineReason: z.string().optional(),
    note: z.string().optional(),
    attested: z.boolean().optional(),
  })
  .refine((data) => data.decision !== "approved" || Boolean(data.method), {
    message: "Select how the customer approved",
    path: ["method"],
  })
  .refine((data) => data.decision !== "approved" || data.attested === true, {
    message: "Confirm the customer approved before continuing",
    path: ["attested"],
  })
  .refine((data) => data.decision !== "declined" || Boolean(data.declineReason), {
    message: "Select a decline reason",
    path: ["declineReason"],
  });
export type ApprovalValues = z.infer<typeof approvalSchema>;

export const awaitingPartsSchema = z.object({
  missingPartName: z.string().min(1, "Describe the missing part"),
  note: z.string().optional(),
});
export type AwaitingPartsValues = z.infer<typeof awaitingPartsSchema>;

export const qualityCheckSchema = z
  .object({
    issueResolved: z.boolean(),
    functionsNormally: z.boolean(),
    cosmeticOk: z.boolean(),
    notes: z.string().optional(),
  })
  .refine((data) => (data.issueResolved && data.functionsNormally && data.cosmeticOk) || Boolean(data.notes), {
    message: "Notes are required when quality check fails",
    path: ["notes"],
  });
export type QualityCheckValues = z.infer<typeof qualityCheckSchema>;

export const deliverySchema = z.object({
  method: z.string().min(1, "Select a delivery method"),
  representativeName: z.string().optional(),
  accessoriesConfirmed: z.array(z.string()),
  conditionOk: z.boolean(),
  conditionNote: z.string().optional(),
});
export type DeliveryValues = z.infer<typeof deliverySchema>;

export const cancelSchema = z.object({
  reason: z.string().min(1, "Select a cancellation reason"),
  note: z.string().optional(),
});
export type CancelValues = z.infer<typeof cancelSchema>;

export const partLineSchema = z.object({
  partId: z.string().min(1, "Select a part"),
  quantity: z.coerce.number().int().min(1, "Quantity must be at least 1"),
});
export type PartLineValues = z.infer<typeof partLineSchema>;
