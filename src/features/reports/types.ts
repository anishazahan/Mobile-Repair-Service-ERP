import type { RevenuePoint } from "@/features/dashboard/types";
import type { ServiceOrderStatus } from "@/types";

export interface TopCustomerRow {
  customerId: string;
  customerName: string;
  orderCount: number;
  totalSpent: number;
}

export interface TechnicianPerformanceRow {
  technicianId: string;
  technicianName: string;
  completedJobs: number;
  revenueGenerated: number;
}

export interface TopPartRow {
  partId: string;
  partName: string;
  quantityUsed: number;
  revenue: number;
}

export interface ReportsData {
  kpis: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
    outstandingBalance: number;
  };
  revenueTrend: RevenuePoint[];
  statusBreakdown: { status: ServiceOrderStatus; count: number }[];
  topCustomers: TopCustomerRow[];
  technicianPerformance: TechnicianPerformanceRow[];
  topParts: TopPartRow[];
}
