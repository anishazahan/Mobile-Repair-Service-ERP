import type { ServiceOrder, ServiceOrderStatus, SparePart } from "@/types";

export interface DashboardQueueRow {
  order: ServiceOrder;
  customerName: string;
  deviceLabel: string;
  technicianName?: string;
}

export interface TechnicianWorkloadRow {
  technicianId: string;
  technicianName: string;
  activeJobs: number;
}

export interface RevenuePoint {
  date: string; // ISO date, day precision
  label: string; // "Sep 12"
  revenue: number;
}

export interface ActivityItem {
  id: string;
  orderId: string;
  label: string;
  description?: string;
  actorName: string;
  createdAt: string;
}

export interface DashboardData {
  kpis: {
    jobsToday: number;
    inProgress: number;
    readyForPickup: number;
    revenueToday: number;
    revenueThisMonth: number;
    pendingPaymentsTotal: number;
    lowStockCount: number;
    overdueJobs: number;
  };
  todaysQueue: DashboardQueueRow[];
  technicianWorkload: TechnicianWorkloadRow[];
  revenueTrend: RevenuePoint[];
  statusBreakdown: { status: ServiceOrderStatus; count: number }[];
  recentActivity: ActivityItem[];
  lowStockParts: SparePart[];
}
