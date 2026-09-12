import {
  ChevronRight,
  MessageSquarePlus,
  PackagePlus,
  Smartphone,
  User as UserIcon,
  UserCog,
} from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ErrorState } from "@/components/feedback/error-state";
import { OrderStatusBadge, PriorityBadge } from "@/components/feedback/status-badge";
import { AssignTechnicianModal } from "@/features/orders/components/modals/assign-technician-modal";
import { useOrderActions } from "@/features/orders/components/order-action-host";
import { OrderTimeline } from "@/features/orders/components/order-timeline";
import { PartsUsedDrawer } from "@/features/orders/components/parts-used-drawer";
import { StatusTransitionMenu } from "@/features/orders/components/status-transition-menu";
import { useAddProgressNote, useOrder } from "@/features/orders/hooks";
import { formatCurrency, formatDate, formatDateTime, humanizeStatus } from "@/lib/utils";
import type { ServiceOrder } from "@/types";

const EMPTY_ORDER: ServiceOrder = {
  id: "",
  customerId: "",
  deviceId: "",
  reportedIssue: "",
  priority: "normal",
  status: "RECEIVED",
  accessoriesReceived: [],
  partsUsed: [],
  createdAt: "",
  updatedAt: "",
  timeline: [],
};

export function OrderDetailPage() {
  const { id = "" } = useParams();
  const { data, isLoading, isError, refetch } = useOrder(id);
  const [assignOpen, setAssignOpen] = useState(false);
  const [partsOpen, setPartsOpen] = useState(false);
  const [note, setNote] = useState("");

  const addNote = useAddProgressNote(id);
  // useOrderActions must be called unconditionally (rules of hooks), even
  // while the real order is still loading — it's given an inert placeholder
  // until `data` resolves, and the menu that would invoke it isn't rendered
  // until then anyway (see the isLoading/isError guards below).
  const actions = useOrderActions(data?.order ?? EMPTY_ORDER);

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
    return <ErrorState onRetry={() => refetch()} description="We couldn't load this service order." />;
  }

  const { order, customer, device, technicianName } = data;
  const partsTotal = order.partsUsed.reduce((sum, p) => sum + p.unitPrice * p.quantity, 0);
  const canManage = !["CLOSED", "CANCELLED"].includes(order.status);

  async function handleAddNote() {
    if (!note.trim()) return;
    await addNote.mutateAsync(note.trim());
    setNote("");
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/app/orders" className="hover:text-foreground">
              Service Orders
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{order.id}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{order.id}</h1>
            <OrderStatusBadge status={order.status} />
            <PriorityBadge priority={order.priority} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">Created {formatDateTime(order.createdAt)}</p>
        </div>
        {canManage && <StatusTransitionMenu status={order.status} onSelect={actions.handleAction} />}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="parts">Parts Used ({order.partsUsed.length})</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Reported Issue</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <p className="text-sm text-foreground">{order.reportedIssue}</p>
                  {order.diagnosisNotes && (
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Diagnosis</p>
                      <p className="mt-1 whitespace-pre-line text-sm text-foreground">{order.diagnosisNotes}</p>
                    </div>
                  )}
                  {order.cancelReason && (
                    <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                      <span className="font-medium">Cancelled: </span>
                      {order.cancelReason}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Accessories Received</CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  {order.accessoriesReceived.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No accessories logged at intake.</p>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {order.accessoriesReceived.map((a) => (
                        <Badge key={a} variant="secondary">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="timeline">
              <Card>
                <CardContent className="pt-6">
                  <OrderTimeline events={order.timeline} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="parts" className="space-y-4">
              <div className="flex justify-end">
                {canManage && (
                  <Button size="sm" variant="outline" onClick={() => setPartsOpen(true)}>
                    <PackagePlus /> Add Parts
                  </Button>
                )}
              </div>
              <Card>
                <CardContent className="pt-6">
                  {order.partsUsed.length === 0 ? (
                    <p className="py-6 text-center text-sm text-muted-foreground">No parts logged on this order yet.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-border text-left text-xs text-muted-foreground">
                            <th className="pb-2 font-medium">Part</th>
                            <th className="pb-2 font-medium">Qty</th>
                            <th className="pb-2 font-medium">Unit Price</th>
                            <th className="pb-2 text-right font-medium">Line Total</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.partsUsed.map((line) => (
                            <tr key={line.partId} className="border-b border-border/60 last:border-0">
                              <td className="py-2.5 text-foreground">{line.partName}</td>
                              <td className="py-2.5 text-muted-foreground">{line.quantity}</td>
                              <td className="py-2.5 text-muted-foreground">{formatCurrency(line.unitPrice)}</td>
                              <td className="py-2.5 text-right font-medium text-foreground">
                                {formatCurrency(line.unitPrice * line.quantity)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr>
                            <td colSpan={3} className="pt-2.5 text-right text-sm font-medium text-foreground">
                              Parts Subtotal
                            </td>
                            <td className="pt-2.5 text-right text-sm font-semibold text-foreground">{formatCurrency(partsTotal)}</td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              {canManage && (
                <div className="flex gap-2">
                  <Textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Post a progress update visible on the timeline..."
                    rows={2}
                    className="flex-1"
                  />
                  <Button onClick={handleAddNote} disabled={!note.trim() || addNote.isPending} className="self-end">
                    <MessageSquarePlus /> Post
                  </Button>
                </div>
              )}
              <Card>
                <CardContent className="pt-6">
                  <OrderTimeline events={order.timeline.filter((e) => e.type === "note")} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Customer</CardTitle>
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
                <p className="text-sm text-muted-foreground">Unknown customer</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Device</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {device ? (
                <Link to={`/app/devices/${device.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Smartphone className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">
                      {device.brand} {device.model}
                    </span>
                    <span className="block text-xs text-muted-foreground">IMEI {device.imei}</span>
                  </span>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">Unknown device</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle>Technician</CardTitle>
              {canManage && (
                <Button variant="ghost" size="sm" onClick={() => setAssignOpen(true)}>
                  <UserCog /> {order.assignedTechnicianId ? "Reassign" : "Assign"}
                </Button>
              )}
            </CardHeader>
            <CardContent className="pt-0">
              {technicianName && order.assignedTechnicianId ? (
                <Link
                  to={`/app/technicians/${order.assignedTechnicianId}`}
                  className="text-sm font-medium text-foreground hover:text-primary"
                >
                  {technicianName}
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">Unassigned</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cost Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Labor</span>
                <span className="text-foreground">{order.laborCost !== undefined ? formatCurrency(order.laborCost) : "—"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Parts</span>
                <span className="text-foreground">{formatCurrency(partsTotal)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span className="text-foreground">
                  {order.status === "CLOSED" || order.status === "DELIVERED" ? "Final Total" : "Estimated Total"}
                </span>
                <span className="text-foreground">
                  {formatCurrency(order.finalCost ?? order.estimatedCost ?? 0)}
                </span>
              </div>
              {order.estimatedCompletionAt && (
                <div className="flex justify-between pt-1 text-xs text-muted-foreground">
                  <span>Est. Completion</span>
                  <span>{formatDate(order.estimatedCompletionAt)}</span>
                </div>
              )}
              {data.invoiceId && (
                <Link
                  to={`/app/billing/${data.invoiceId}`}
                  className="flex items-center justify-between border-t border-border pt-2 text-primary hover:underline"
                >
                  <span>View Invoice</span>
                  <span>{data.invoiceId}</span>
                </Link>
              )}
            </CardContent>
          </Card>

          {!canManage && (
            <Card className="border-dashed">
              <CardContent className="pt-6 text-center text-sm text-muted-foreground">
                This order is {humanizeStatus(order.status).toLowerCase()} and is read-only.
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {actions.modals}
      <AssignTechnicianModal
        orderId={order.id}
        currentTechnicianId={order.assignedTechnicianId}
        open={assignOpen}
        onOpenChange={setAssignOpen}
      />
      <PartsUsedDrawer orderId={order.id} open={partsOpen} onOpenChange={setPartsOpen} />
    </div>
  );
}
