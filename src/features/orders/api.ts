import { useAuthStore } from "@/features/auth/store";
import { db, genId } from "@/mocks/db";
import { MockApiError, simulateRequest } from "@/mocks/server";
import type {
  Customer,
  Device,
  Invoice,
  InvoiceLineItem,
  OrderPartLine,
  OrderTimelineEvent,
  ServiceOrder,
  ServiceOrderStatus,
} from "@/types";

export interface OrderFilters {
  search?: string;
  status?: ServiceOrderStatus | "all";
  technicianId?: string | "all";
  priority?: "normal" | "urgent" | "all";
}

export interface OrderRow {
  order: ServiceOrder;
  customer?: Customer;
  device?: Device;
  technicianName?: string;
  invoiceId?: string;
}

function currentActor() {
  const user = useAuthStore.getState().user;
  return { name: user?.name ?? "System", role: user?.role ?? "admin" };
}

function pushTimeline(order: ServiceOrder, entry: Omit<OrderTimelineEvent, "id" | "actorName" | "actorRole" | "createdAt">) {
  const actor = currentActor();
  order.timeline.push({
    id: genId("T"),
    actorName: actor.name,
    actorRole: actor.role,
    createdAt: new Date().toISOString(),
    ...entry,
  });
  order.updatedAt = new Date().toISOString();
}

function findOrder(id: string): ServiceOrder {
  const order = db.serviceOrders.find((o) => o.id === id);
  if (!order) throw new MockApiError(`Service order ${id} was not found.`);
  return order;
}

function enrich(order: ServiceOrder): OrderRow {
  const customer = db.customers.find((c) => c.id === order.customerId);
  const device = db.devices.find((d) => d.id === order.deviceId);
  const technician = order.assignedTechnicianId
    ? db.technicians.find((t) => t.id === order.assignedTechnicianId)
    : undefined;
  const invoice = db.invoices.find((inv) => inv.orderId === order.id);
  return { order, customer, device, technicianName: technician?.name, invoiceId: invoice?.id };
}

export async function getOrders(filters?: OrderFilters): Promise<OrderRow[]> {
  return simulateRequest(() => {
    let rows = db.serviceOrders.map(enrich);

    if (filters?.status && filters.status !== "all") {
      rows = rows.filter((r) => r.order.status === filters.status);
    }
    if (filters?.technicianId && filters.technicianId !== "all") {
      rows = rows.filter((r) => r.order.assignedTechnicianId === filters.technicianId);
    }
    if (filters?.priority && filters.priority !== "all") {
      rows = rows.filter((r) => r.order.priority === filters.priority);
    }
    if (filters?.search) {
      const q = filters.search.trim().toLowerCase();
      rows = rows.filter(
        (r) =>
          r.order.id.toLowerCase().includes(q) ||
          r.customer?.name.toLowerCase().includes(q) ||
          r.customer?.phone.toLowerCase().includes(q) ||
          r.device?.imei.toLowerCase().includes(q) ||
          `${r.device?.brand} ${r.device?.model}`.toLowerCase().includes(q),
      );
    }
    return rows.sort((a, b) => (a.order.createdAt < b.order.createdAt ? 1 : -1));
  });
}

export async function getOrder(id: string): Promise<OrderRow> {
  return simulateRequest(() => enrich(findOrder(id)));
}

export interface CreateOrderInput {
  customerId: string;
  deviceId: string;
  reportedIssue: string;
  priority: "normal" | "urgent";
  accessoriesReceived: string[];
  conditionNotes?: string;
  ballparkEstimateNote?: string;
}

export async function createOrder(input: CreateOrderInput): Promise<ServiceOrder> {
  return simulateRequest(() => {
    const now = new Date().toISOString();
    const order: ServiceOrder = {
      id: genId("SO"),
      customerId: input.customerId,
      deviceId: input.deviceId,
      reportedIssue: input.reportedIssue,
      priority: input.priority,
      status: "RECEIVED",
      accessoriesReceived: input.accessoriesReceived,
      partsUsed: [],
      createdAt: now,
      updatedAt: now,
      timeline: [],
    };
    pushTimeline(order, {
      type: "status_change",
      label: "Order Received",
      description: input.ballparkEstimateNote,
    });
    db.serviceOrders.unshift(order);
    return order;
  }, { delayMs: 500 });
}

export async function startInspection(id: string): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    order.status = "INITIAL_INSPECTION";
    pushTimeline(order, { type: "status_change", label: "Initial Inspection Started" });
  });
}

export async function assignTechnician(id: string, technicianId: string, reason?: string): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    const tech = db.technicians.find((t) => t.id === technicianId);
    if (!tech) throw new MockApiError("Technician not found.");
    const isReassignment = Boolean(order.assignedTechnicianId) && order.assignedTechnicianId !== technicianId;
    order.assignedTechnicianId = technicianId;
    pushTimeline(order, {
      type: "assignment",
      label: isReassignment ? `Reassigned to ${tech.name}` : `Assigned to ${tech.name}`,
      description: reason ? `Reason: ${reason}` : undefined,
    });
  });
}

export async function startDiagnosis(id: string): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    if (!order.assignedTechnicianId) throw new MockApiError("Assign a technician before starting diagnosis.");
    order.status = "DIAGNOSING";
    pushTimeline(order, { type: "status_change", label: "Diagnosis Started" });
  });
}

export interface SubmitDiagnosisInput {
  diagnosisNotes: string;
  laborCost: number;
  isAdditionalIssue?: boolean;
}

export async function submitDiagnosis(id: string, input: SubmitDiagnosisInput): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    order.diagnosisNotes = input.isAdditionalIssue
      ? `${order.diagnosisNotes ? order.diagnosisNotes + "\n\n" : ""}Additional issue: ${input.diagnosisNotes}`
      : input.diagnosisNotes;
    order.laborCost = input.laborCost;
    const partsTotal = order.partsUsed.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0);
    order.estimatedCost = input.laborCost + partsTotal;
    order.status = "AWAITING_APPROVAL";
    pushTimeline(order, {
      type: "status_change",
      label: input.isAdditionalIssue ? "Additional Issue Reported — Re-sent for Approval" : "Diagnosis Submitted — Sent for Approval",
      description: `${input.diagnosisNotes} (Estimate: ৳${order.estimatedCost.toLocaleString()})`,
    });
  });
}

export interface RecordApprovalInput {
  approved: boolean;
  method?: string;
  declineReason?: string;
  note?: string;
}

export async function recordApproval(id: string, input: RecordApprovalInput): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    if (input.approved) {
      order.status = "APPROVED";
      pushTimeline(order, {
        type: "approval",
        label: "Customer Approved",
        description: `Approved via ${input.method}${input.note ? ` — ${input.note}` : ""}`,
      });
    } else {
      order.status = "CANCELLED";
      order.cancelReason = input.declineReason;
      pushTimeline(order, {
        type: "cancellation",
        label: "Order Cancelled — Customer Declined",
        description: input.declineReason,
      });
    }
  });
}

export async function startRepair(id: string): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    order.status = "IN_REPAIR";
    pushTimeline(order, { type: "status_change", label: "Repair Started" });
  });
}

export async function addProgressNote(id: string, note: string): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    pushTimeline(order, { type: "note", label: "Progress Update", description: note });
  });
}

export interface AddPartsInput {
  parts: OrderPartLine[];
}

export async function addPartsUsed(id: string, input: AddPartsInput): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    for (const line of input.parts) {
      const existing = order.partsUsed.find((p) => p.partId === line.partId);
      if (existing) {
        existing.quantity += line.quantity;
      } else {
        order.partsUsed.push(line);
      }
      const stockPart = db.parts.find((p) => p.id === line.partId);
      if (stockPart) stockPart.quantityInStock = Math.max(0, stockPart.quantityInStock - line.quantity);
    }
    const partsTotal = order.partsUsed.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0);
    if (order.laborCost !== undefined) order.estimatedCost = order.laborCost + partsTotal;
    pushTimeline(order, {
      type: "note",
      label: "Parts Added",
      description: input.parts.map((p) => `${p.partName} × ${p.quantity}`).join(", "),
    });
  });
}

export async function pauseForParts(id: string, missingPartName: string, note?: string): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    order.status = "AWAITING_PARTS";
    pushTimeline(order, {
      type: "warning",
      label: "Paused — Awaiting Parts",
      description: `Missing: ${missingPartName}${note ? ` — ${note}` : ""}`,
    });
  });
}

export async function resumeRepair(id: string): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    order.status = "IN_REPAIR";
    pushTimeline(order, { type: "status_change", label: "Repair Resumed — Parts Arrived" });
  });
}

export async function sendForQualityCheck(id: string): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    order.status = "QUALITY_CHECK";
    pushTimeline(order, { type: "status_change", label: "Repair Complete — Sent for Quality Check" });
  });
}

export interface QualityCheckInput {
  passed: boolean;
  notes: string;
}

export async function submitQualityCheck(id: string, input: QualityCheckInput): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    if (input.passed) {
      order.status = "READY_FOR_PICKUP";
      pushTimeline(order, { type: "status_change", label: "Quality Check Passed", description: input.notes });
    } else {
      order.status = "IN_REPAIR";
      pushTimeline(order, { type: "warning", label: "Quality Check Failed — Sent Back for Rework", description: input.notes });
    }
  });
}

export interface DeliveryInput {
  method: string;
  accessoriesConfirmed: string[];
  conditionOk: boolean;
  conditionNote?: string;
  representativeName?: string;
}

export async function confirmDelivery(id: string, input: DeliveryInput): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    order.status = "DELIVERED";
    order.finalCost = order.estimatedCost;
    pushTimeline(order, {
      type: "status_change",
      label: "Delivered to Customer",
      description: `${input.method}${input.representativeName ? ` (${input.representativeName})` : ""}${
        input.conditionOk ? "" : ` — Condition note: ${input.conditionNote}`
      }`,
    });
  });
}

function buildInvoiceLineItems(order: ServiceOrder): InvoiceLineItem[] {
  const items: InvoiceLineItem[] = order.partsUsed.map((line) => ({
    description: `${line.partName} (Part)`,
    quantity: line.quantity,
    unitPrice: line.unitPrice,
  }));
  if (order.laborCost) {
    items.push({ description: "Labor", quantity: 1, unitPrice: order.laborCost });
  }
  return items;
}

export async function closeOrder(id: string): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    order.status = "CLOSED";

    // The close-order flow is payment-gated (see CloseOrderModal) — by the
    // time an order reaches here it's already been paid in full, so this
    // is also where the paid invoice for it actually gets created.
    if (!db.invoices.some((inv) => inv.orderId === order.id)) {
      const lineItems = buildInvoiceLineItems(order);
      const subtotal = lineItems.reduce((sum, li) => sum + li.quantity * li.unitPrice, 0);
      const total = order.finalCost ?? order.estimatedCost ?? subtotal;
      const now = new Date().toISOString();
      const invoice: Invoice = {
        id: genId("INV"),
        orderId: order.id,
        customerId: order.customerId,
        lineItems,
        subtotal,
        tax: 0,
        discount: 0,
        total,
        amountPaid: total,
        status: "paid",
        issuedAt: now,
      };
      db.invoices.unshift(invoice);
      db.payments.unshift({
        id: genId("PAY"),
        invoiceId: invoice.id,
        amount: total,
        method: "cash",
        recordedBy: currentActor().name,
        createdAt: now,
      });
    }

    pushTimeline(order, { type: "status_change", label: "Order Closed — Payment Settled" });
  });
}

export async function cancelOrder(id: string, reason: string, note?: string): Promise<void> {
  return simulateRequest(() => {
    const order = findOrder(id);
    order.status = "CANCELLED";
    order.cancelReason = note ? `${reason} — ${note}` : reason;
    pushTimeline(order, { type: "cancellation", label: "Order Cancelled", description: order.cancelReason });
  });
}
