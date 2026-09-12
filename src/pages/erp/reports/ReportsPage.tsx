import { Banknote, Package, TrendingUp, Users, Wallet, Wrench } from "lucide-react";
import { Link } from "react-router-dom";
import { PageHeader } from "@/components/layout/page-header";
import { RevenueTrendChart } from "@/components/charts/revenue-trend-chart";
import { StatusBreakdownList } from "@/components/charts/status-breakdown-list";
import { KpiCard } from "@/components/charts/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { useReportsData } from "@/features/reports/hooks";
import { formatCurrency } from "@/lib/utils";

export function ReportsPage() {
  const { data, isLoading, isError, refetch } = useReportsData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
        <Skeleton className="h-72" />
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} description="We couldn't load reports data." />;
  }

  const { kpis, revenueTrend, statusBreakdown, topCustomers, technicianPerformance, topParts } = data;

  return (
    <div className="space-y-6">
      <PageHeader title="Reports" description="Revenue, pipeline, and performance across the whole shop." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Total Revenue" value={formatCurrency(kpis.totalRevenue)} icon={Wallet} accent="success" />
        <KpiCard label="Total Orders" value={String(kpis.totalOrders)} icon={Wrench} />
        <KpiCard label="Avg. Order Value" value={formatCurrency(Math.round(kpis.avgOrderValue))} icon={TrendingUp} />
        <KpiCard
          label="Outstanding Balance"
          value={formatCurrency(kpis.outstandingBalance)}
          icon={Banknote}
          accent={kpis.outstandingBalance > 0 ? "warning" : "success"}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Revenue — Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueTrendChart data={revenueTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Pipeline</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusBreakdownList data={statusBreakdown} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Top Customers</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {topCustomers.length === 0 ? (
              <EmptyState icon={Users} title="No completed orders yet" className="py-8" />
            ) : (
              <ul className="space-y-3">
                {topCustomers.map((row, i) => (
                  <li key={row.customerId} className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {i + 1}
                      </span>
                      <Link
                        to={`/app/customers/${row.customerId}`}
                        className="truncate text-sm font-medium text-foreground hover:text-primary"
                      >
                        {row.customerName}
                      </Link>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium text-foreground">{formatCurrency(row.totalSpent)}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.orderCount} {row.orderCount === 1 ? "order" : "orders"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Technician Performance</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {technicianPerformance.length === 0 ? (
              <EmptyState icon={Wrench} title="No completed jobs yet" className="py-8" />
            ) : (
              <ul className="space-y-3">
                {technicianPerformance.map((row, i) => (
                  <li key={row.technicianId} className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {i + 1}
                      </span>
                      <span className="truncate text-sm font-medium text-foreground">{row.technicianName}</span>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium text-foreground">{formatCurrency(row.revenueGenerated)}</p>
                      <p className="text-xs text-muted-foreground">
                        {row.completedJobs} {row.completedJobs === 1 ? "job" : "jobs"}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Parts by Usage</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            {topParts.length === 0 ? (
              <EmptyState icon={Package} title="No parts used yet" className="py-8" />
            ) : (
              <ul className="space-y-3">
                {topParts.map((row, i) => (
                  <li key={row.partId} className="flex items-center justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium text-muted-foreground">
                        {i + 1}
                      </span>
                      <Link
                        to={`/app/inventory/parts/${row.partId}`}
                        className="truncate text-sm font-medium text-foreground hover:text-primary"
                      >
                        {row.partName}
                      </Link>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-sm font-medium text-foreground">{formatCurrency(row.revenue)}</p>
                      <p className="text-xs text-muted-foreground">{row.quantityUsed} used</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
