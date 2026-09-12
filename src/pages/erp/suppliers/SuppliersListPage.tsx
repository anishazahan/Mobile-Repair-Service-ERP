import { MoreHorizontal, Plus, Search, Truck } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/page-header";
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
import { SupplierFormDialog } from "@/features/suppliers/components/supplier-form-dialog";
import { useSetSupplierStatus, useSupplierRows } from "@/features/suppliers/hooks";
import type { Supplier } from "@/types";

function RowActions({ supplier }: { supplier: Supplier }) {
  const navigate = useNavigate();
  const setStatus = useSetSupplierStatus(supplier.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => navigate(`/app/inventory/suppliers/${supplier.id}`)}>
          View Profile
        </DropdownMenuItem>
        {supplier.status === "active" ? (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setStatus.mutate("inactive")}
          >
            Mark Inactive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => setStatus.mutate("active")}>Reactivate</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function SuppliersListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<Supplier["status"] | "all">("active");
  const [addOpen, setAddOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useSupplierRows({ search, status });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Suppliers"
        description="Every parts supplier on file, and what they've supplied into inventory."
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus /> Add Supplier
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, contact, phone..."
            className="pl-8"
          />
        </div>
        <Select value={status} onValueChange={(v) => setStatus(v as Supplier["status"] | "all")}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {isError && <ErrorState onRetry={() => refetch()} />}

      {isLoading && (
        <div className="space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full" />
          ))}
        </div>
      )}

      {data && data.length === 0 && (
        <EmptyState
          icon={Truck}
          title="No suppliers match your filters"
          description="Try adjusting your search or filters, or add a new supplier."
          action={
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus /> Add Supplier
            </Button>
          }
        />
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[760px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Supplier</th>
                <th className="px-4 py-2.5 font-medium">Contact Person</th>
                <th className="px-4 py-2.5 font-medium">Phone</th>
                <th className="px-4 py-2.5 font-medium">Parts Supplied</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {data.map(({ supplier, partCount }) => (
                <tr
                  key={supplier.id}
                  onClick={() => navigate(`/app/inventory/suppliers/${supplier.id}`)}
                  className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-accent/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{supplier.name}</div>
                    {supplier.email && <div className="text-xs text-muted-foreground">{supplier.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{supplier.contactPerson}</td>
                  <td className="px-4 py-3 text-muted-foreground">{supplier.phone}</td>
                  <td className="px-4 py-3 text-muted-foreground">{partCount}</td>
                  <td className="px-4 py-3">
                    <Badge variant={supplier.status === "active" ? "success" : "secondary"}>
                      {supplier.status === "active" ? "Active" : "Inactive"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <RowActions supplier={supplier} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <SupplierFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        onSaved={(s) => navigate(`/app/inventory/suppliers/${s.id}`)}
      />
    </div>
  );
}
