import { KanbanSquare, Plus, Search, Wrench } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { OrderStatusBadge, PriorityBadge } from "@/components/feedback/status-badge";
import { PIPELINE_STATUSES } from "@/features/orders/constants";
import { useOrders } from "@/features/orders/hooks";
import { db } from "@/mocks/db";
import { formatCurrency, formatDate, humanizeStatus } from "@/lib/utils";
import type { ServiceOrderStatus } from "@/types";

export function OrdersListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ServiceOrderStatus | "all">("all");
  const [technicianId, setTechnicianId] = useState<string>("all");
  const [priority, setPriority] = useState<"normal" | "urgent" | "all">("all");

  const { data, isLoading, isError, refetch } = useOrders({ search, status, technicianId, priority });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service Orders"
        description="Track every repair from intake to delivery."
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/orders/board">
                <KanbanSquare /> Repair Board
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

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search order ID, customer, phone, IMEI..."
            className="pl-8"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as ServiceOrderStatus | "all")}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {[...PIPELINE_STATUSES, "CLOSED", "CANCELLED"].map((s) => (
              <SelectItem key={s} value={s}>
                {humanizeStatus(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={technicianId} onValueChange={setTechnicianId}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Technician" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Technicians</SelectItem>
            {db.technicians.map((t) => (
              <SelectItem key={t.id} value={t.id}>
                {t.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priority} onValueChange={(v) => setPriority(v as "normal" | "urgent" | "all")}>
          <SelectTrigger className="sm:w-36">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="normal">Normal</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isError && <ErrorState onRetry={() => refetch()} />}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      )}

      {data && data.length === 0 && (
        <EmptyState
          icon={Wrench}
          title="No service orders match your filters"
          description="Try adjusting your search or filters, or create a new service order."
          action={
            <Button size="sm" asChild>
              <Link to="/app/orders/new">
                <Plus /> New Service Order
              </Link>
            </Button>
          }
        />
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Order</th>
                <th className="px-4 py-2.5 font-medium">Customer</th>
                <th className="px-4 py-2.5 font-medium">Device</th>
                <th className="px-4 py-2.5 font-medium">Technician</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Cost</th>
                <th className="px-4 py-2.5 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr
                  key={row.order.id}
                  onClick={() => navigate(`/app/orders/${row.order.id}`)}
                  className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-accent/50"
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    <div className="flex items-center gap-1.5">
                      {row.order.id}
                      <PriorityBadge priority={row.order.priority} />
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.customer ? (
                      <Link
                        to={`/app/customers/${row.customer.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-primary"
                      >
                        {row.customer.name}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.device ? (
                      <Link
                        to={`/app/devices/${row.device.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="hover:text-primary"
                      >
                        {row.device.brand} {row.device.model}
                      </Link>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
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
                  <td className="px-4 py-3">
                    <OrderStatusBadge status={row.order.status} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {row.order.finalCost !== undefined
                      ? formatCurrency(row.order.finalCost)
                      : row.order.estimatedCost !== undefined
                        ? `~${formatCurrency(row.order.estimatedCost)}`
                        : "—"}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(row.order.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
