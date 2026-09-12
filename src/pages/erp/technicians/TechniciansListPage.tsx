import { MoreHorizontal, Plus, Search, Wrench } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/page-header";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { TechnicianStatusBadge } from "@/components/feedback/status-badge";
import { TechnicianFormDialog } from "@/features/technicians/components/technician-form-dialog";
import { useSetTechnicianStatus, useTechnicianRows } from "@/features/technicians/hooks";
import { TECHNICIAN_SPECIALTIES } from "@/features/technicians/schema";
import { formatCurrency, humanizeStatus } from "@/lib/utils";
import type { Technician, TechnicianSpecialty } from "@/types";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

function RowActions({ technician }: { technician: Technician }) {
  const navigate = useNavigate();
  const setStatus = useSetTechnicianStatus(technician.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => navigate(`/app/technicians/${technician.id}`)}>View Profile</DropdownMenuItem>
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
  );
}

export function TechniciansListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Technician["status"] | "all">("all");
  const [specialty, setSpecialty] = useState<TechnicianSpecialty | "all">("all");
  const [addOpen, setAddOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useTechnicianRows({ search, status, specialty });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Technicians"
        description="Every technician on the team, their specialties, and their current workload."
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus /> Add Technician
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone..."
            className="pl-8"
          />
        </div>
        <Select value={specialty} onValueChange={(v) => setSpecialty(v as TechnicianSpecialty | "all")}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Specialty" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Specialties</SelectItem>
            {TECHNICIAN_SPECIALTIES.map((s) => (
              <SelectItem key={s} value={s}>
                {humanizeStatus(s)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as Technician["status"] | "all")}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="on_leave">On Leave</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
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
          icon={Wrench}
          title="No technicians match your filters"
          description="Try adjusting your search or filters, or add a new technician."
          action={
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus /> Add Technician
            </Button>
          }
        />
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Technician</th>
                <th className="px-4 py-2.5 font-medium">Specialties</th>
                <th className="px-4 py-2.5 font-medium">Active Jobs</th>
                <th className="px-4 py-2.5 font-medium">Completed</th>
                <th className="px-4 py-2.5 font-medium">Revenue Generated</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {data.map(({ technician, activeJobs, completedJobs, revenueGenerated }) => (
                <tr
                  key={technician.id}
                  onClick={() => navigate(`/app/technicians/${technician.id}`)}
                  className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-accent/50"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>{initials(technician.name)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-foreground">{technician.name}</div>
                        <div className="text-xs text-muted-foreground">{technician.phone}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex max-w-[220px] flex-wrap gap-1">
                      {technician.specialties.map((s) => (
                        <Badge key={s} variant="secondary">
                          {humanizeStatus(s)}
                        </Badge>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{activeJobs}</td>
                  <td className="px-4 py-3 text-muted-foreground">{completedJobs}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatCurrency(revenueGenerated)}</td>
                  <td className="px-4 py-3">
                    <TechnicianStatusBadge status={technician.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RowActions technician={technician} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <TechnicianFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSaved={(t) => navigate(`/app/technicians/${t.id}`)}
      />
    </div>
  );
}
