import { Calendar, ChevronRight, Hash, Palette, Pencil, Plus, User as UserIcon, Wrench } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { OrderStatusBadge, PriorityBadge } from "@/components/feedback/status-badge";
import { DeviceFormDialog } from "@/features/devices/components/device-form-dialog";
import { DEVICE_TYPE_ICON, DEVICE_TYPE_LABEL } from "@/features/devices/constants";
import { useDevice } from "@/features/devices/hooks";
import { formatCurrency, formatDate } from "@/lib/utils";

export function DeviceDetailPage() {
  const { id = "" } = useParams();
  const { data, isLoading, isError, refetch } = useDevice(id);
  const [editOpen, setEditOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-64" />
        <div className="grid gap-4 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return <ErrorState onRetry={() => refetch()} description="We couldn't load this device." />;
  }

  const { device, customer, orders } = data;
  const Icon = DEVICE_TYPE_ICON[device.type];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/app/devices" className="hover:text-foreground">
              Devices
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">
              {device.brand} {device.model}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">
              {device.brand} {device.model}
            </h1>
            <Badge variant="secondary">{DEVICE_TYPE_LABEL[device.type]}</Badge>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">Added {formatDate(device.createdAt)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil /> Edit
          </Button>
          <Button size="sm" asChild>
            <Link to="/app/orders/new">
              <Plus /> New Service Order
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Service History ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {orders.length === 0 ? (
                <EmptyState
                  icon={Wrench}
                  title="No service orders yet"
                  description="This device hasn't been brought in for repair yet."
                  action={
                    <Button size="sm" asChild>
                      <Link to="/app/orders/new">
                        <Plus /> New Service Order
                      </Link>
                    </Button>
                  }
                />
              ) : (
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                        <th className="px-4 py-2.5 font-medium">Order</th>
                        <th className="px-4 py-2.5 font-medium">Issue</th>
                        <th className="px-4 py-2.5 font-medium">Status</th>
                        <th className="px-4 py-2.5 font-medium">Cost</th>
                        <th className="px-4 py-2.5 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(({ order }) => (
                        <tr key={order.id} className="border-b border-border/60 last:border-0 hover:bg-accent/50">
                          <td className="px-4 py-3">
                            <Link
                              to={`/app/orders/${order.id}`}
                              className="flex items-center gap-1.5 font-medium text-foreground hover:text-primary"
                            >
                              {order.id}
                              <PriorityBadge priority={order.priority} />
                            </Link>
                          </td>
                          <td className="max-w-xs truncate px-4 py-3 text-muted-foreground">{order.reportedIssue}</td>
                          <td className="px-4 py-3">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {order.finalCost !== undefined
                              ? formatCurrency(order.finalCost)
                              : order.estimatedCost !== undefined
                                ? `~${formatCurrency(order.estimatedCost)}`
                                : "—"}
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{formatDate(order.createdAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Owner</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {customer ? (
                <Link to={`/app/customers/${customer.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <UserIcon className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{customer.name}</span>
                    <span className="block text-xs text-muted-foreground">{customer.phone}</span>
                  </span>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">Unknown owner</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <div className="flex items-start gap-2.5">
                <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-foreground">{DEVICE_TYPE_LABEL[device.type]}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Hash className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-foreground">IMEI {device.imei}</span>
              </div>
              {device.color && (
                <div className="flex items-start gap-2.5">
                  <Palette className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-foreground">{device.color}</span>
                </div>
              )}
              {device.purchaseDate && (
                <div className="flex items-start gap-2.5">
                  <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-foreground">Purchased {formatDate(device.purchaseDate)}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {device.conditionNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Condition Notes</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{device.conditionNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <DeviceFormDialog open={editOpen} onOpenChange={setEditOpen} device={device} />
    </div>
  );
}
