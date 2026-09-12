import { db, MOCK_NOW } from "@/mocks/db";
import { simulateRequest } from "@/mocks/server";
import type { ServiceOrderStatus } from "@/types";
import type { ActivityItem, DashboardData, RevenuePoint } from "./types";

const ACTIVE_PIPELINE_STATUSES: ServiceOrderStatus[] = [
  "DIAGNOSING",
  "AWAITING_APPROVAL",
  "APPROVED",
  "IN_REPAIR",
  "AWAITING_PARTS",
  "QUALITY_CHECK",
];

const TERMINAL_STATUSES: ServiceOrderStatus[] = ["CLOSED", "CANCELLED"];

function isSameDay(iso: string, reference: Date): boolean {
  const d = new Date(iso);
  return (
    d.getUTCFullYear() === reference.getUTCFullYear() &&
    d.getUTCMonth() === reference.getUTCMonth() &&
    d.getUTCDate() === reference.getUTCDate()
  );
}

function isSameMonth(iso: string, reference: Date): boolean {
  const d = new Date(iso);
  return d.getUTCFullYear() === reference.getUTCFullYear() && d.getUTCMonth() === reference.getUTCMonth();
}

function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function buildRevenueTrend(days: number): RevenuePoint[] {
  const totals = new Map<string, number>();
  for (const payment of db.payments) {
    const key = dayKey(new Date(payment.createdAt));
    totals.set(key, (totals.get(key) ?? 0) + payment.amount);
  }

  const points: RevenuePoint[] = [];
  for (let i = days - 1; i >= 0; i -= 1) {
    const date = new Date(MOCK_NOW);
    date.setUTCDate(date.getUTCDate() - i);
    const key = dayKey(date);
    points.push({
      date: key,
      label: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      revenue: totals.get(key) ?? 0,
    });
  }
  return points;
}

export async function getDashboardData(): Promise<DashboardData> {
  return simulateRequest(() => {
    const customerById = new Map(db.customers.map((c) => [c.id, c]));
    const deviceById = new Map(db.devices.map((d) => [d.id, d]));
    const technicianById = new Map(db.technicians.map((t) => [t.id, t]));

    const todaysOrders = db.serviceOrders.filter((o) => isSameDay(o.createdAt, MOCK_NOW));
    const inProgress = db.serviceOrders.filter((o) => ACTIVE_PIPELINE_STATUSES.includes(o.status));
    const readyForPickup = db.serviceOrders.filter((o) => o.status === "READY_FOR_PICKUP");
    const overdueJobs = db.serviceOrders.filter(
      (o) =>
        o.estimatedCompletionAt &&
        new Date(o.estimatedCompletionAt) < MOCK_NOW &&
        !TERMINAL_STATUSES.includes(o.status) &&
        o.status !== "READY_FOR_PICKUP",
    );

    const revenueToday = db.payments
      .filter((p) => isSameDay(p.createdAt, MOCK_NOW))
      .reduce((sum, p) => sum + p.amount, 0);
    const revenueThisMonth = db.payments
      .filter((p) => isSameMonth(p.createdAt, MOCK_NOW))
      .reduce((sum, p) => sum + p.amount, 0);

    const pendingPaymentsTotal = db.invoices
      .filter((inv) => inv.status === "unpaid" || inv.status === "partially_paid" || inv.status === "overdue")
      .reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);

    const lowStockParts = db.parts
      .filter((p) => p.quantityInStock <= p.reorderLevel)
      .sort((a, b) => a.quantityInStock - b.quantityInStock);

    const todaysQueue = todaysOrders
      .slice()
      .sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
      .map((order) => {
        const customer = customerById.get(order.customerId);
        const device = deviceById.get(order.deviceId);
        const technician = order.assignedTechnicianId ? technicianById.get(order.assignedTechnicianId) : undefined;
        return {
          order,
          customerName: customer?.name ?? "Unknown Customer",
          deviceLabel: device ? `${device.brand} ${device.model}` : "Unknown Device",
          technicianName: technician?.name,
        };
      });

    const technicianWorkload = db.technicians
      .filter((t) => t.status === "active")
      .map((t) => ({
        technicianId: t.id,
        technicianName: t.name,
        activeJobs: db.serviceOrders.filter(
          (o) => o.assignedTechnicianId === t.id && !TERMINAL_STATUSES.includes(o.status),
        ).length,
      }))
      .sort((a, b) => b.activeJobs - a.activeJobs);

    const revenueTrend = buildRevenueTrend(14);

    const statusCounts = new Map<ServiceOrderStatus, number>();
    for (const order of db.serviceOrders) {
      if (TERMINAL_STATUSES.includes(order.status)) continue;
      statusCounts.set(order.status, (statusCounts.get(order.status) ?? 0) + 1);
    }
    const statusBreakdown = Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count }));

    const recentActivity: ActivityItem[] = db.serviceOrders
      .flatMap((order) => order.timeline.map((event) => ({ ...event, orderId: order.id })))
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
      .slice(0, 8)
      .map((event) => ({
        id: event.id + event.orderId,
        orderId: event.orderId,
        label: event.label,
        description: event.description,
        actorName: event.actorName,
        createdAt: event.createdAt,
      }));

    return {
      kpis: {
        jobsToday: todaysOrders.length,
        inProgress: inProgress.length,
        readyForPickup: readyForPickup.length,
        revenueToday,
        revenueThisMonth,
        pendingPaymentsTotal,
        lowStockCount: lowStockParts.length,
        overdueJobs: overdueJobs.length,
      },
      todaysQueue,
      technicianWorkload,
      revenueTrend,
      statusBreakdown,
      recentActivity,
      lowStockParts,
    };
  }, { delayMs: 500 });
}
