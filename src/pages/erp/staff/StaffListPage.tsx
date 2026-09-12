import { MoreHorizontal, Plus, Search, UserCog } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { RoleBadge, StaffStatusBadge } from "@/components/feedback/status-badge";
import { useAuthStore } from "@/features/auth/store";
import { StaffFormDialog } from "@/features/staff/components/staff-form-dialog";
import { useSetStaffStatus, useStaffRows } from "@/features/staff/hooks";
import { formatRelativeTime, humanizeStatus } from "@/lib/utils";
import type { Role, StaffUser } from "@/types";

const ROLES: Role[] = ["admin", "manager", "front_desk", "technician"];

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function RowActions({ user }: { user: StaffUser }) {
  const navigate = useNavigate();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const setStatus = useSetStaffStatus(user.id);
  const isSelf = user.id === currentUserId;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => navigate(`/app/staff/${user.id}`)}>View Profile</DropdownMenuItem>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function StaffListPage() {
  const navigate = useNavigate();
  const currentUserId = useAuthStore((s) => s.user?.id);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "all">("all");
  const [status, setStatus] = useState<StaffUser["status"] | "all">("all");
  const [addOpen, setAddOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useStaffRows({ search, role, status });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Staff & Users"
        description="Every login to the system, their role, and what they can access."
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus /> Add Account
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email..."
            className="pl-8"
          />
        </div>
        <Select value={role} onValueChange={(v) => setRole(v as Role | "all")}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            {ROLES.map((r) => (
              <SelectItem key={r} value={r}>
                {humanizeStatus(r)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as StaffUser["status"] | "all")}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="suspended">Suspended</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isError && <ErrorState onRetry={() => refetch()} />}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      )}

      {data && data.length === 0 && (
        <EmptyState
          icon={UserCog}
          title="No staff accounts match your filters"
          description="Try adjusting your search or filters, or add a new account."
          action={
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus /> Add Account
            </Button>
          }
        />
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[860px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">User</th>
                <th className="px-4 py-2.5 font-medium">Role</th>
                <th className="px-4 py-2.5 font-medium">Linked Technician</th>
                <th className="px-4 py-2.5 font-medium">Last Login</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {data.map(({ user, technician }) => (
                <tr
                  key={user.id}
                  onClick={() => navigate(`/app/staff/${user.id}`)}
                  className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-accent/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{initials(user.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5 font-medium text-foreground">
                          {user.name}
                          {user.id === currentUserId && <Badge variant="outline">You</Badge>}
                        </div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <RoleBadge role={user.role} />
                  </td>
                  <td className="px-4 py-3">
                    {technician ? (
                      <Link
                        to={`/app/technicians/${technician.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-muted-foreground hover:text-primary"
                      >
                        {technician.name}
                      </Link>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {user.lastLoginAt ? formatRelativeTime(user.lastLoginAt) : "Never"}
                  </td>
                  <td className="px-4 py-3">
                    <StaffStatusBadge status={user.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RowActions user={user} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <StaffFormDialog open={addOpen} onOpenChange={setAddOpen} onSaved={(u) => navigate(`/app/staff/${u.id}`)} />
    </div>
  );
}
