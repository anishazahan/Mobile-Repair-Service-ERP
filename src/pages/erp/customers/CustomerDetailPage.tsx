import {
  ChevronRight,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Smartphone,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { OrderStatusBadge, PriorityBadge } from "@/components/feedback/status-badge";
import { CustomerFormDialog } from "@/features/customers/components/customer-form-dialog";
import { useCustomer, useSetCustomerStatus } from "@/features/customers/hooks";
import { DeviceFormDialog } from "@/features/devices/components/device-form-dialog";
import { formatCurrency, formatDate } from "@/lib/utils";

export function CustomerDetailPage() {
  const { id = "" } = useParams();
  const { data, isLoading, isError, refetch } = useCustomer(id);
  const [editOpen, setEditOpen] = useState(false);
  const [addDeviceOpen, setAddDeviceOpen] = useState(false);
  const setStatus = useSetCustomerStatus(id);

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
    return <ErrorState onRetry={() => refetch()} description="We couldn't load this customer." />;
  }

  const { customer, devices, orders, totalSpent, openOrderCount } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/app/customers" className="hover:text-foreground">
              Customers
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{customer.name}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{customer.name}</h1>
            <Badge variant={customer.type === "regular" ? "default" : "secondary"}>
              {customer.type === "regular" ? "Regular" : "Walk-in"}
            </Badge>
            {customer.status === "archived" && <Badge variant="destructive">Archived</Badge>}
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">Customer since {formatDate(customer.createdAt)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil /> Edit
          </Button>
          {customer.status === "active" ? (
            <Button variant="outline" size="sm" onClick={() => setStatus.mutate("archived")}>
              Archive
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setStatus.mutate("active")}>
              Reactivate
            </Button>
          )}
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
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Devices ({devices.length})</CardTitle>
              <Button variant="ghost" size="sm" onClick={() => setAddDeviceOpen(true)}>
                <Plus /> Add Device
              </Button>
            </CardHeader>
            <CardContent className="pt-0">
              {devices.length === 0 ? (
                <EmptyState
                  icon={Smartphone}
                  title="No devices on file"
                  description="Add this customer's device so it's ready for their next service order."
                />
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  {devices.map((device) => (
                    <Link
                      key={device.id}
                      to={`/app/devices/${device.id}`}
                      className="flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:border-primary/40 hover:bg-accent/50"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                        <Smartphone className="h-4 w-4" />
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium text-foreground">
                          {device.brand} {device.model}
                        </span>
                        <span className="block text-xs text-muted-foreground">
                          IMEI {device.imei}
                          {device.color ? ` · ${device.color}` : ""}
                        </span>
                      </span>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Service Order History ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {orders.length === 0 ? (
                <EmptyState
                  icon={Wrench}
                  title="No service orders yet"
                  description="This customer hasn't brought in a device for repair yet."
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
                        <th className="px-4 py-2.5 font-medium">Device</th>
                        <th className="px-4 py-2.5 font-medium">Status</th>
                        <th className="px-4 py-2.5 font-medium">Cost</th>
                        <th className="px-4 py-2.5 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(({ order, device }) => (
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
                          <td className="px-4 py-3 text-muted-foreground">
                            {device ? (
                              <Link to={`/app/devices/${device.id}`} className="hover:text-primary">
                                {device.brand} {device.model}
                              </Link>
                            ) : (
                              "—"
                            )}
                          </td>
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
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <div className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-foreground">{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-foreground">{customer.email}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-foreground">{customer.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Orders</span>
                <span className="font-medium text-foreground">{orders.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Open Orders</span>
                <span className="font-medium text-foreground">{openOrderCount}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">Total Spent</span>
                <span className="font-medium text-foreground">{formatCurrency(totalSpent)}</span>
              </div>
            </CardContent>
          </Card>

          {customer.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{customer.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <CustomerFormDialog open={editOpen} onOpenChange={setEditOpen} customer={customer} />
      <DeviceFormDialog open={addDeviceOpen} onOpenChange={setAddDeviceOpen} customerId={customer.id} />
    </div>
  );
}
