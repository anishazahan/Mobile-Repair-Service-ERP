import { Badge, type BadgeProps } from "@/components/ui/badge";
import { humanizeStatus } from "@/lib/utils";
import type { InvoiceStatus, Role, ServiceOrderStatus, StaffUser, Technician } from "@/types";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

const TECHNICIAN_STATUS_VARIANTS: Record<Technician["status"], BadgeVariant> = {
  active: "success",
  on_leave: "warning",
  inactive: "secondary",
};

const STAFF_STATUS_VARIANTS: Record<StaffUser["status"], BadgeVariant> = {
  active: "success",
  inactive: "secondary",
  suspended: "destructive",
};

const ROLE_VARIANTS: Record<Role, BadgeVariant> = {
  admin: "default",
  manager: "default",
  front_desk: "secondary",
  technician: "secondary",
};

const ORDER_STATUS_VARIANTS: Record<ServiceOrderStatus, BadgeVariant> = {
  RECEIVED: "secondary",
  INITIAL_INSPECTION: "secondary",
  DIAGNOSING: "default",
  AWAITING_APPROVAL: "warning",
  APPROVED: "default",
  IN_REPAIR: "default",
  AWAITING_PARTS: "warning",
  QUALITY_CHECK: "default",
  READY_FOR_PICKUP: "success",
  DELIVERED: "success",
  CLOSED: "secondary",
  CANCELLED: "destructive",
};

const INVOICE_STATUS_VARIANTS: Record<InvoiceStatus, BadgeVariant> = {
  draft: "secondary",
  unpaid: "warning",
  partially_paid: "warning",
  paid: "success",
  overdue: "destructive",
  refunded: "secondary",
};

export function OrderStatusBadge({ status }: { status: ServiceOrderStatus }) {
  return <Badge variant={ORDER_STATUS_VARIANTS[status]}>{humanizeStatus(status)}</Badge>;
}

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  return <Badge variant={INVOICE_STATUS_VARIANTS[status]}>{humanizeStatus(status)}</Badge>;
}

export function TechnicianStatusBadge({ status }: { status: Technician["status"] }) {
  return <Badge variant={TECHNICIAN_STATUS_VARIANTS[status]}>{humanizeStatus(status)}</Badge>;
}

export function StaffStatusBadge({ status }: { status: StaffUser["status"] }) {
  return <Badge variant={STAFF_STATUS_VARIANTS[status]}>{humanizeStatus(status)}</Badge>;
}

export function RoleBadge({ role }: { role: Role }) {
  return <Badge variant={ROLE_VARIANTS[role]}>{humanizeStatus(role)}</Badge>;
}

export function PriorityBadge({ priority }: { priority: "normal" | "urgent" }) {
  if (priority === "normal") return null;
  return <Badge variant="destructive">Urgent</Badge>;
}
