import { ChevronRight, Mail, Pencil, Phone, UserCog, Wrench } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { OrderStatusBadge, PriorityBadge, TechnicianStatusBadge } from "@/components/feedback/status-badge";
import { TechnicianFormDialog } from "@/features/technicians/components/technician-form-dialog";
import { useSetTechnicianStatus, useTechnician } from "@/features/technicians/hooks";
import { formatCurrency, formatDate, humanizeStatus } from "@/lib/utils";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function TechnicianDetailPage() {
  const { id = "" } = useParams();
  const { data, isLoading, isError, refetch } = useTechnician(id);
  const [editOpen, setEditOpen] = useState(false);
  const setStatus = useSetTechnicianStatus(id);

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
    return <ErrorState onRetry={() => refetch()} description="We couldn't load this technician." />;
  }

  const { technician, orders, activeJobs, completedJobs, revenueGenerated, linkedStaffUser } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/app/technicians" className="hover:text-foreground">
              Technicians
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{technician.name}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{initials(technician.name)}</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{technician.name}</h1>
            </div>
            <TechnicianStatusBadge status={technician.status} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">Joined {formatDate(technician.joinedAt)}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil /> Edit
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Set Status
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {technician.status !== "active" && (
                <DropdownMenuItem onClick={() => setStatus.mutate("active")}>Mark Active</DropdownMenuItem>
              )}
              {technician.status !== "on_leave" && (
                <DropdownMenuItem onClick={() => setStatus.mutate("on_leave")}>Mark On Leave</DropdownMenuItem>
              )}
              {technician.status !== "inactive" && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setStatus.mutate("inactive")}
                >
                  Mark Inactive
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Orders ({orders.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {orders.length === 0 ? (
                <EmptyState icon={Wrench} title="No orders assigned yet" className="py-8" />
              ) : (
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                        <th className="px-4 py-2.5 font-medium">Order</th>
                        <th className="px-4 py-2.5 font-medium">Customer</th>
                        <th className="px-4 py-2.5 font-medium">Device</th>
                        <th className="px-4 py-2.5 font-medium">Status</th>
                        <th className="px-4 py-2.5 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(({ order, customerName, deviceLabel }) => (
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
                          <td className="px-4 py-3 text-muted-foreground">{customerName ?? "—"}</td>
                          <td className="px-4 py-3 text-muted-foreground">{deviceLabel ?? "—"}</td>
                          <td className="px-4 py-3">
                            <OrderStatusBadge status={order.status} />
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
                <span className="text-foreground">{technician.phone}</span>
              </div>
              {technician.email && (
                <div className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-foreground">{technician.email}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Specialties</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1.5">
                {technician.specialties.map((s) => (
                  <Badge key={s} variant="secondary">
                    {humanizeStatus(s)}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {linkedStaffUser && (
            <Card>
              <CardHeader>
                <CardTitle>System Account</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link to={`/app/staff/${linkedStaffUser.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <UserCog className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{linkedStaffUser.name}</span>
                    <span className="block text-xs text-muted-foreground">{linkedStaffUser.email}</span>
                  </span>
                </Link>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Performance</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Jobs</span>
                <span className="font-medium text-foreground">{activeJobs}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Completed Jobs</span>
                <span className="font-medium text-foreground">{completedJobs}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">Revenue Generated</span>
                <span className="font-medium text-foreground">{formatCurrency(revenueGenerated)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <TechnicianFormDialog open={editOpen} onOpenChange={setEditOpen} technician={technician} />
    </div>
  );
}
