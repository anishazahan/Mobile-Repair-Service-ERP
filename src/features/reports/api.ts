import { db, MOCK_NOW } from "@/mocks/db";
import { simulateRequest } from "@/mocks/server";
import type { ServiceOrderStatus } from "@/types";
import type { RevenuePoint } from "@/features/dashboard/types";
import type { ReportsData, TechnicianPerformanceRow, TopCustomerRow, TopPartRow } from "./types";

const ACTIVE_PIPELINE_STATUSES: ServiceOrderStatus[] = [
  "RECEIVED",
  "INITIAL_INSPECTION",
  "DIAGNOSING",
  "AWAITING_APPROVAL",
  "APPROVED",
  "IN_REPAIR",
  "AWAITING_PARTS",
  "QUALITY_CHECK",
  "READY_FOR_PICKUP",
];

const COMPLETED_STATUSES: ServiceOrderStatus[] = ["DELIVERED", "CLOSED"];

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

export async function getReportsData(): Promise<ReportsData> {
  return simulateRequest(() => {
    const totalRevenue = db.payments.reduce((sum, p) => sum + p.amount, 0);
    const completedOrders = db.serviceOrders.filter((o) => o.finalCost !== undefined);
    const avgOrderValue = completedOrders.length
      ? completedOrders.reduce((sum, o) => sum + (o.finalCost ?? 0), 0) / completedOrders.length
      : 0;
    const outstandingBalance = db.invoices
      .filter((inv) => inv.status !== "paid" && inv.status !== "refunded")
      .reduce((sum, inv) => sum + (inv.total - inv.amountPaid), 0);

    const statusCounts = new Map<ServiceOrderStatus, number>();
    for (const order of db.serviceOrders) {
      if (!ACTIVE_PIPELINE_STATUSES.includes(order.status)) continue;
      statusCounts.set(order.status, (statusCounts.get(order.status) ?? 0) + 1);
    }
    const statusBreakdown = Array.from(statusCounts.entries()).map(([status, count]) => ({ status, count }));

    const customerTotals = new Map<string, { orderCount: number; totalSpent: number }>();
    for (const order of completedOrders) {
      const entry = customerTotals.get(order.customerId) ?? { orderCount: 0, totalSpent: 0 };
      entry.orderCount += 1;
      entry.totalSpent += order.finalCost ?? 0;
      customerTotals.set(order.customerId, entry);
    }
    const topCustomers: TopCustomerRow[] = Array.from(customerTotals.entries())
      .map(([customerId, v]) => ({
        customerId,
        customerName: db.customers.find((c) => c.id === customerId)?.name ?? "Unknown Customer",
        ...v,
      }))
      .sort((a, b) => b.totalSpent - a.totalSpent)
      .slice(0, 5);

    const technicianTotals = new Map<string, { completedJobs: number; revenueGenerated: number }>();
    for (const order of db.serviceOrders) {
      if (!order.assignedTechnicianId || !COMPLETED_STATUSES.includes(order.status)) continue;
      const entry = technicianTotals.get(order.assignedTechnicianId) ?? { completedJobs: 0, revenueGenerated: 0 };
      entry.completedJobs += 1;
      entry.revenueGenerated += order.finalCost ?? 0;
      technicianTotals.set(order.assignedTechnicianId, entry);
    }
    const technicianPerformance: TechnicianPerformanceRow[] = Array.from(technicianTotals.entries())
      .map(([technicianId, v]) => ({
        technicianId,
        technicianName: db.technicians.find((t) => t.id === technicianId)?.name ?? "Unknown Technician",
        ...v,
      }))
      .sort((a, b) => b.revenueGenerated - a.revenueGenerated);

    const partTotals = new Map<string, { quantityUsed: number; revenue: number }>();
    for (const order of db.serviceOrders) {
      for (const line of order.partsUsed) {
        const entry = partTotals.get(line.partId) ?? { quantityUsed: 0, revenue: 0 };
        entry.quantityUsed += line.quantity;
        entry.revenue += line.quantity * line.unitPrice;
        partTotals.set(line.partId, entry);
      }
    }
    const topParts: TopPartRow[] = Array.from(partTotals.entries())
      .map(([partId, v]) => ({
        partId,
        partName: db.parts.find((p) => p.id === partId)?.name ?? "Unknown Part",
        ...v,
      }))
      .sort((a, b) => b.quantityUsed - a.quantityUsed)
      .slice(0, 5);

    return {
      kpis: {
        totalRevenue,
        totalOrders: db.serviceOrders.length,
        avgOrderValue,
        outstandingBalance,
      },
      revenueTrend: buildRevenueTrend(30),
      statusBreakdown,
      topCustomers,
      technicianPerformance,
      topParts,
    };
  }, { delayMs: 500 });
}
