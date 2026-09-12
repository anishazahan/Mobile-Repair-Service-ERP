import type { ServiceOrderStatus } from "@/types";

/** Pipeline sequence used by the Repair Board and the Dashboard's pipeline chart. */
export const PIPELINE_STATUSES: ServiceOrderStatus[] = [
  "RECEIVED",
  "INITIAL_INSPECTION",
  "DIAGNOSING",
  "AWAITING_APPROVAL",
  "APPROVED",
  "IN_REPAIR",
  "AWAITING_PARTS",
  "QUALITY_CHECK",
  "READY_FOR_PICKUP",
  "DELIVERED",
];

export const TERMINAL_STATUSES: ServiceOrderStatus[] = ["CLOSED", "CANCELLED"];

export type TransitionAction =
  | "start_inspection"
  | "start_diagnosis"
  | "submit_diagnosis"
  | "send_for_approval_again"
  | "start_repair"
  | "pause_for_parts"
  | "resume_repair"
  | "send_for_qc"
  | "qc_pass"
  | "qc_fail"
  | "mark_delivered"
  | "close_order"
  | "cancel_order";

export interface TransitionOption {
  action: TransitionAction;
  label: string;
  to: ServiceOrderStatus;
  /** Which modal (if any) must be completed to perform this transition. */
  modal?: "diagnosis" | "approval" | "awaiting_parts" | "quality_check" | "delivery" | "cancel" | "close";
  /** Simple transitions with no extra data still show a lightweight confirm. */
  requiresConfirm?: boolean;
  destructive?: boolean;
}

/** Valid next actions for each non-terminal status — the UI only ever offers these. */
export const TRANSITIONS: Record<ServiceOrderStatus, TransitionOption[]> = {
  RECEIVED: [
    { action: "start_inspection", label: "Start Initial Inspection", to: "INITIAL_INSPECTION" },
    { action: "cancel_order", label: "Cancel Order", to: "CANCELLED", modal: "cancel", destructive: true },
  ],
  INITIAL_INSPECTION: [
    { action: "start_diagnosis", label: "Start Diagnosis", to: "DIAGNOSING" },
    { action: "cancel_order", label: "Cancel Order", to: "CANCELLED", modal: "cancel", destructive: true },
  ],
  DIAGNOSING: [
    { action: "submit_diagnosis", label: "Submit Diagnosis & Send for Approval", to: "AWAITING_APPROVAL", modal: "diagnosis" },
    { action: "cancel_order", label: "Cancel Order", to: "CANCELLED", modal: "cancel", destructive: true },
  ],
  AWAITING_APPROVAL: [
    { action: "submit_diagnosis", label: "Record Customer Decision", to: "APPROVED", modal: "approval" },
    { action: "cancel_order", label: "Cancel Order", to: "CANCELLED", modal: "cancel", destructive: true },
  ],
  APPROVED: [
    { action: "start_repair", label: "Start Repair", to: "IN_REPAIR" },
    { action: "cancel_order", label: "Cancel Order", to: "CANCELLED", modal: "cancel", destructive: true },
  ],
  IN_REPAIR: [
    { action: "send_for_qc", label: "Repair Complete — Send for Quality Check", to: "QUALITY_CHECK" },
    { action: "pause_for_parts", label: "Pause — Awaiting Parts", to: "AWAITING_PARTS", modal: "awaiting_parts" },
    { action: "send_for_approval_again", label: "Report Additional Issue Found", to: "AWAITING_APPROVAL", modal: "diagnosis" },
    { action: "cancel_order", label: "Cancel Order", to: "CANCELLED", modal: "cancel", destructive: true },
  ],
  AWAITING_PARTS: [
    { action: "resume_repair", label: "Resume Repair — Parts Arrived", to: "IN_REPAIR", requiresConfirm: true },
    { action: "cancel_order", label: "Cancel Order", to: "CANCELLED", modal: "cancel", destructive: true },
  ],
  QUALITY_CHECK: [
    { action: "qc_pass", label: "Run Quality Check", to: "READY_FOR_PICKUP", modal: "quality_check" },
  ],
  READY_FOR_PICKUP: [
    { action: "mark_delivered", label: "Confirm Delivery to Customer", to: "DELIVERED", modal: "delivery" },
  ],
  DELIVERED: [
    { action: "close_order", label: "Close Order", to: "CLOSED", modal: "close" },
  ],
  CLOSED: [],
  CANCELLED: [],
};

export const CANCEL_REASONS = [
  "Customer Declined Estimate",
  "Customer Requested Cancellation",
  "Unrepairable",
  "Other",
] as const;

export const APPROVAL_METHODS = ["In Person", "Phone Call", "SMS / WhatsApp Confirmation"] as const;

export const DELIVERY_METHODS = ["Picked Up In Person", "Handed to Representative"] as const;

export const ACCESSORY_OPTIONS = ["Charger", "Cable", "Earphones", "SIM Card", "Memory Card", "Case/Cover", "Box"] as const;

export const REPAIR_CATEGORIES = [
  "Screen Replacement",
  "Battery Replacement",
  "Charging Port",
  "Motherboard",
  "Software",
  "Water Damage Treatment",
  "Camera",
  "Speaker/Mic",
  "Other",
] as const;
