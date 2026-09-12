// Centralized domain types for the GadgetFIX ERP frontend.
// This file is the single source of truth for shapes shared across features.

export type Role = "admin" | "manager" | "front_desk" | "technician";

export interface StaffUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: Role;
  status: "active" | "inactive" | "suspended";
  linkedTechnicianId?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  type: "walk_in" | "regular";
  status: "active" | "archived";
  notes?: string;
  createdAt: string;
}

export type DeviceType = "phone" | "tablet" | "smartwatch" | "laptop";

export interface Device {
  id: string;
  customerId: string;
  brand: string;
  model: string;
  type: DeviceType;
  imei: string;
  color?: string;
  purchaseDate?: string;
  conditionNotes?: string;
  photos?: string[];
  createdAt: string;
}

export type TechnicianSpecialty =
  | "screen"
  | "battery"
  | "charging_port"
  | "motherboard"
  | "software"
  | "water_damage"
  | "camera"
  | "general";

export interface Technician {
  id: string;
  name: string;
  avatarUrl?: string;
  phone: string;
  email?: string;
  specialties: TechnicianSpecialty[];
  status: "active" | "on_leave" | "inactive";
  joinedAt: string;
}

export type ServiceOrderStatus =
  | "RECEIVED"
  | "INITIAL_INSPECTION"
  | "DIAGNOSING"
  | "AWAITING_APPROVAL"
  | "APPROVED"
  | "IN_REPAIR"
  | "AWAITING_PARTS"
  | "QUALITY_CHECK"
  | "READY_FOR_PICKUP"
  | "DELIVERED"
  | "CLOSED"
  | "CANCELLED";

export type OrderPriority = "normal" | "urgent";

export interface OrderPartLine {
  partId: string;
  partName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderTimelineEvent {
  id: string;
  type:
    | "status_change"
    | "note"
    | "approval"
    | "assignment"
    | "warning"
    | "cancellation";
  label: string;
  description?: string;
  actorName: string;
  actorRole: Role;
  createdAt: string;
}

export interface ServiceOrder {
  id: string;
  customerId: string;
  deviceId: string;
  reportedIssue: string;
  diagnosisNotes?: string;
  priority: OrderPriority;
  status: ServiceOrderStatus;
  assignedTechnicianId?: string;
  accessoriesReceived: string[];
  estimatedCost?: number;
  laborCost?: number;
  partsUsed: OrderPartLine[];
  finalCost?: number;
  estimatedCompletionAt?: string;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  timeline: OrderTimelineEvent[];
}

export type PartCategory =
  | "screen"
  | "battery"
  | "charging_port"
  | "camera"
  | "speaker"
  | "motherboard"
  | "other";

export interface SparePart {
  id: string;
  name: string;
  sku: string;
  category: PartCategory;
  compatibleModels: string[];
  quantityInStock: number;
  reorderLevel: number;
  unitCost: number;
  sellingPrice: number;
  supplierId?: string;
}

export interface Supplier {
  id: string;
  name: string;
  contactPerson: string;
  phone: string;
  email?: string;
  address?: string;
  status: "active" | "inactive";
}

export type InvoiceStatus =
  | "draft"
  | "unpaid"
  | "partially_paid"
  | "paid"
  | "overdue"
  | "refunded";

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface Invoice {
  id: string;
  orderId: string;
  customerId: string;
  lineItems: InvoiceLineItem[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  amountPaid: number;
  status: InvoiceStatus;
  issuedAt: string;
  dueAt?: string;
}

export type PaymentMethod = "cash" | "card" | "mobile_wallet" | "bank_transfer";

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  method: PaymentMethod;
  recordedBy: string;
  createdAt: string;
}

export interface ServiceCatalogItem {
  id: string;
  name: string;
  category: string;
  basePrice: number;
  estDurationMinutes: number;
  status: "active" | "inactive";
  description?: string;
}

export interface ShopSettings {
  shopName: string;
  phone: string;
  email: string;
  address: string;
  taxRatePercent: number;
}

export type NotificationType =
  | "low_stock"
  | "order_update"
  | "payment"
  | "new_booking"
  | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  message: string;
  relatedEntityId?: string;
  relatedEntityType?: "order" | "part" | "invoice" | "customer";
  read: boolean;
  createdAt: string;
}
