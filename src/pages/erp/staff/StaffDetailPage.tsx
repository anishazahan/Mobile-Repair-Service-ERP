import { ChevronRight, Mail, Pencil, Wrench } from "lucide-react";
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
import { ErrorState } from "@/components/feedback/error-state";
import { RoleBadge, StaffStatusBadge } from "@/components/feedback/status-badge";
import { useAuthStore } from "@/features/auth/store";
import { StaffFormDialog } from "@/features/staff/components/staff-form-dialog";
import { useSetStaffStatus, useStaffMember } from "@/features/staff/hooks";
import { NAV_GROUPS, isNavItemVisible } from "@/components/layout/nav-config";
import { formatDate, formatRelativeTime } from "@/lib/utils";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function StaffDetailPage() {
  const { id = "" } = useParams();
  const { data, isLoading, isError, refetch } = useStaffMember(id);
  const [editOpen, setEditOpen] = useState(false);
  const currentUserId = useAuthStore((s) => s.user?.id);
  const setStatus = useSetStaffStatus(id);

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
    return <ErrorState onRetry={() => refetch()} description="We couldn't load this staff account." />;
  }

  const { user, technician } = data;
  const isSelf = user.id === currentUserId;
  const accessibleItems = NAV_GROUPS.flatMap((g) => g.items).filter((item) => isNavItemVisible(item, user.role));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/app/staff" className="hover:text-foreground">
              Staff & Users
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{user.name}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2.5">
              <Avatar className="h-9 w-9">
                <AvatarFallback>{initials(user.name)}</AvatarFallback>
              </Avatar>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">{user.name}</h1>
            </div>
            {isSelf && <Badge variant="outline">You</Badge>}
            <RoleBadge role={user.role} />
            <StaffStatusBadge status={user.status} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">Member since {formatDate(user.createdAt)}</p>
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
              {user.status !== "active" && (
                <DropdownMenuItem onClick={() => setStatus.mutate("active")}>Mark Active</DropdownMenuItem>
              )}
              {!isSelf && user.status !== "inactive" && (
                <DropdownMenuItem onClick={() => setStatus.mutate("inactive")}>Deactivate</DropdownMenuItem>
              )}
              {!isSelf && user.status !== "suspended" && (
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={() => setStatus.mutate("suspended")}
                >
                  Suspend
                </DropdownMenuItem>
              )}
              {isSelf && user.status === "active" && (
                <DropdownMenuItem disabled>You can't deactivate your own account</DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Module Access</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="mb-3 text-sm text-muted-foreground">
                What the {user.role.replace("_", " ")} role can see in the sidebar.
              </p>
              <div className="flex flex-wrap gap-1.5">
                {accessibleItems.map((item) => (
                  <Badge key={item.to} variant="secondary">
                    {item.label}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {technician && (
            <Card>
              <CardHeader>
                <CardTitle>Linked Technician Profile</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <Link
                  to={`/app/technicians/${technician.id}`}
                  className="flex items-center gap-3 rounded-md border border-border p-3 transition-colors hover:border-primary/40 hover:bg-accent/50"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Wrench className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{technician.name}</span>
                    <span className="block text-xs text-muted-foreground">
                      {technician.specialties.length} specialt{technician.specialties.length === 1 ? "y" : "ies"}
                    </span>
                  </span>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0 text-sm">
              <div className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-foreground">{user.email}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 text-xs">
                <span className="text-muted-foreground">Last Login</span>
                <span className="text-foreground">
                  {user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : "Never"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <StaffFormDialog open={editOpen} onOpenChange={setEditOpen} user={user} />
    </div>
  );
}
