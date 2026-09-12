import { useQueryClient } from "@tanstack/react-query";
import { List, Plus } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ErrorState } from "@/components/feedback/error-state";
import { PriorityBadge } from "@/components/feedback/status-badge";
import * as api from "@/features/orders/api";
import { PIPELINE_STATUSES, TRANSITIONS } from "@/features/orders/constants";
import { useOrders } from "@/features/orders/hooks";
import { cn, formatCurrency, humanizeStatus } from "@/lib/utils";
import type { OrderRow } from "@/features/orders/api";
import type { ServiceOrderStatus } from "@/types";

const DIRECT_ACTIONS: Partial<Record<string, (id: string) => Promise<void>>> = {
  start_inspection: api.startInspection,
  start_diagnosis: api.startDiagnosis,
  start_repair: api.startRepair,
  resume_repair: api.resumeRepair,
  send_for_qc: api.sendForQualityCheck,
};

export function RepairBoardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading, isError, refetch } = useOrders();
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<ServiceOrderStatus | null>(null);

  async function handleDrop(row: OrderRow, toStatus: ServiceOrderStatus) {
    setDragOverColumn(null);
    if (row.order.status === toStatus) return;

    const option = TRANSITIONS[row.order.status].find((t) => t.to === toStatus);
    if (!option) {
      toast.error(`Can't move from "${humanizeStatus(row.order.status)}" straight to "${humanizeStatus(toStatus)}".`);
      return;
    }
    if (option.modal) {
      toast.info(`Open ${row.order.id} to complete this step — it needs more information first.`);
      navigate(`/app/orders/${row.order.id}`);
      return;
    }
    const fn = DIRECT_ACTIONS[option.action];
    if (!fn) return;
    try {
      await fn(row.order.id);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      toast.success(option.label);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't update the order.");
    }
  }

  return (
    <div className="flex h-full flex-col space-y-6">
      <PageHeader
        title="Repair Board"
        description="Drag a card to move it through the pipeline."
        actions={
          <>
            <Button variant="outline" size="sm" asChild>
              <Link to="/app/orders">
                <List /> Table View
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

      {isError && <ErrorState onRetry={() => refetch()} />}

      {isLoading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      )}

      {data && (
        <div className="flex-1 overflow-x-auto pb-4">
          <div className="flex h-full gap-4">
            {PIPELINE_STATUSES.map((status) => {
              const rows = data.filter((r) => r.order.status === status);
              return (
                <div
                  key={status}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragOverColumn(status);
                  }}
                  onDragLeave={() => setDragOverColumn((c) => (c === status ? null : c))}
                  onDrop={(e) => {
                    e.preventDefault();
                    const id = e.dataTransfer.getData("text/plain");
                    const row = data.find((r) => r.order.id === id);
                    if (row) handleDrop(row, status);
                    setDraggingId(null);
                  }}
                  className={cn(
                    "flex w-72 shrink-0 flex-col rounded-md border border-border bg-muted/30 transition-colors",
                    dragOverColumn === status && "border-primary bg-primary/5",
                  )}
                >
                  <div className="flex items-center justify-between border-b border-border px-3 py-2.5">
                    <h3 className="text-sm font-semibold text-foreground">{humanizeStatus(status)}</h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {rows.length}
                    </span>
                  </div>
                  <div className="flex-1 space-y-2.5 overflow-y-auto p-2.5">
                    {rows.length === 0 && (
                      <p className="py-6 text-center text-xs text-muted-foreground">No orders in this stage</p>
                    )}
                    {rows.map((row) => (
                      <Card
                        key={row.order.id}
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData("text/plain", row.order.id);
                          setDraggingId(row.order.id);
                        }}
                        onDragEnd={() => setDraggingId(null)}
                        onClick={() => navigate(`/app/orders/${row.order.id}`)}
                        className={cn(
                          "cursor-grab space-y-2 p-3 transition-opacity hover:shadow-md active:cursor-grabbing",
                          draggingId === row.order.id && "opacity-40",
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-semibold text-foreground">{row.order.id}</span>
                          <PriorityBadge priority={row.order.priority} />
                        </div>
                        <p className="truncate text-sm text-foreground">{row.customer?.name ?? "Unknown customer"}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {row.device ? `${row.device.brand} ${row.device.model}` : "Unknown device"}
                        </p>
                        <div className="flex items-center justify-between border-t border-border/70 pt-2 text-xs text-muted-foreground">
                          <span>{row.technicianName ?? "Unassigned"}</span>
                          {row.order.estimatedCost !== undefined && <span>{formatCurrency(row.order.estimatedCost)}</span>}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
