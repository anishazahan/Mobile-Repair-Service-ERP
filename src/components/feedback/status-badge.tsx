import { Badge, type BadgeProps } from "@/components/ui/badge";
import { humanizeStatus } from "@/lib/utils";
import type { InvoiceStatus, ServiceOrderStatus } from "@/types";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

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

export function PriorityBadge({ priority }: { priority: "normal" | "urgent" }) {
  if (priority === "normal") return null;
  return <Badge variant="destructive">Urgent</Badge>;
}
