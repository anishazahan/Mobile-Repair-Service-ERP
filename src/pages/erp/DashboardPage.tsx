import { KpiCard } from "@/components/charts/kpi-card";
import { RevenueTrendChart } from "@/components/charts/revenue-trend-chart";
import { StatusBreakdownList } from "@/components/charts/status-breakdown-list";
import { TechnicianWorkloadChart } from "@/components/charts/technician-workload-chart";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import {
  OrderStatusBadge,
  PriorityBadge,
} from "@/components/feedback/status-badge";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/features/auth/store";
import { useDashboardData } from "@/features/dashboard/hooks";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import {
  Banknote,
  Clock,
  Inbox,
  PackageCheck,
  PackageX,
  Plus,
  TrendingUp,
  UserPlus,
  Wallet,
  Wrench,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export function DashboardPage() {
  const user = useAuthStore((s) => s.user);
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useDashboardData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description={`Welcome back, ${user?.name.split(" ")[0] ?? "there"},here's what's happening at the shop today.`}
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/customers">
                <UserPlus /> New Customer
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link to="/app/orders/new">
                <Plus /> New Service Order
              </Link>
            </Button>
          </>
        }
      />

      {isError && (
        <ErrorState
          onRetry={() => refetch()}
          description="We couldn't load the dashboard. Please try again."
        />
      )}

      {isLoading && <DashboardSkeleton />}

      {data && (
        <>
          {/* KPI grid */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <KpiCard
              label="Jobs Received Today"
              value={String(data.kpis.jobsToday)}
              icon={Inbox}
              accent="primary"
            />
            <KpiCard
              label="In Progress"
              value={String(data.kpis.inProgress)}
              icon={Wrench}
              accent="primary"
            />
            <KpiCard
              label="Ready for Pickup"
              value={String(data.kpis.readyForPickup)}
              icon={PackageCheck}
              accent="success"
            />
            <KpiCard
              label="Revenue Today"
              value={formatCurrency(data.kpis.revenueToday)}
              icon={Wallet}
              accent="success"
            />
            <KpiCard
              label="Revenue This Month"
              value={formatCurrency(data.kpis.revenueThisMonth)}
              icon={TrendingUp}
              accent="primary"
            />
            <KpiCard
              label="Pending Payments"
              value={formatCurrency(data.kpis.pendingPaymentsTotal)}
              icon={Banknote}
              accent="warning"
              to="/app/billing"
            />
            <KpiCard
              label="Low Stock Alerts"
              value={String(data.kpis.lowStockCount)}
              icon={PackageX}
              accent="warning"
            />
            <KpiCard
              label="Overdue Jobs"
              value={String(data.kpis.overdueJobs)}
              icon={Clock}
              accent={data.kpis.overdueJobs > 0 ? "destructive" : "primary"}
            />
          </div>

          {/* Revenue trend + Low stock */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Revenue — Last 14 Days</CardTitle>
              </CardHeader>
              <CardContent>
                <RevenueTrendChart data={data.revenueTrend} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alerts</CardTitle>
              </CardHeader>
              <CardContent>
                {data.lowStockParts.length === 0 ? (
                  <EmptyState
                    icon={PackageCheck}
                    title="Stock levels look healthy"
                    className="py-8"
                  />
                ) : (
                  <ul className="space-y-3">
                    {data.lowStockParts.map((part) => (
                      <li key={part.id}>
                        <Link
                          to={`/app/inventory/parts/${part.id}`}
                          className="flex items-center justify-between gap-2 rounded-md -mx-1.5 px-1.5 py-1 transition-colors hover:bg-accent/50"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-foreground">
                              {part.name}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              SKU {part.sku}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                              part.quantityInStock === 0
                                ? "bg-destructive/10 text-destructive"
                                : "bg-warning/10 text-warning"
                            }`}
                          >
                            {part.quantityInStock === 0
                              ? "Out of stock"
                              : `${part.quantityInStock} left`}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Today's queue + Recent activity */}
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Today's Service Queue</CardTitle>
              </CardHeader>
              <CardContent>
                {data.todaysQueue.length === 0 ? (
                  <EmptyState
                    icon={Inbox}
                    title="No jobs received today yet"
                    description="New service orders will show up here as they're created."
                  />
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border text-left text-xs text-muted-foreground">
                          <th className="pb-2 font-medium">Order</th>
                          <th className="pb-2 font-medium">Customer</th>
                          <th className="pb-2 font-medium">Device</th>
                          <th className="pb-2 font-medium">Technician</th>
                          <th className="pb-2 font-medium">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.todaysQueue.map((row) => (
                          <tr
                            key={row.order.id}
                            onClick={() =>
                              navigate(`/app/orders/${row.order.id}`)
                            }
                            className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-accent/50"
                          >
                            <td className="py-2.5 pr-2 font-medium text-foreground">
                              <div className="flex items-center gap-1.5">
                                {row.order.id}
                                <PriorityBadge priority={row.order.priority} />
                              </div>
                            </td>
                            <td className="py-2.5 pr-2 text-muted-foreground">
                              {row.customerName}
                            </td>
                            <td className="py-2.5 pr-2 text-muted-foreground">
                              {row.deviceLabel}
                            </td>
                            <td className="py-2.5 pr-2 text-muted-foreground">
                              {row.order.assignedTechnicianId ? (
                                <Link
                                  to={`/app/technicians/${row.order.assignedTechnicianId}`}
                                  onClick={(e) => e.stopPropagation()}
                                  className="hover:text-primary"
                                >
                                  {row.technicianName ?? "Unassigned"}
                                </Link>
                              ) : (
                                "Unassigned"
                              )}
                            </td>
                            <td className="py-2.5">
                              <OrderStatusBadge status={row.order.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-4">
                  {data.recentActivity.map((activity) => (
                    <li key={activity.id} className="flex gap-3 text-sm">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                      <div className="min-w-0">
                        <p className="text-foreground">
                          {activity.label}{" "}
                          <Link
                            to={`/app/orders/${activity.orderId}`}
                            className="font-medium text-primary hover:underline"
                          >
                            {activity.orderId}
                          </Link>
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {activity.actorName} ·{" "}
                          {formatRelativeTime(activity.createdAt)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>

          {/* Workload + pipeline */}
          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Technician Workload</CardTitle>
              </CardHeader>
              <CardContent>
                <TechnicianWorkloadChart data={data.technicianWorkload} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Pipeline</CardTitle>
              </CardHeader>
              <CardContent>
                <StatusBreakdownList data={data.statusBreakdown} />
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[92px] rounded-md" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-64 rounded-md lg:col-span-2" />
        <Skeleton className="h-64 rounded-md" />
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Skeleton className="h-72 rounded-md lg:col-span-2" />
        <Skeleton className="h-72 rounded-md" />
      </div>
    </div>
  );
}
