import { MoreHorizontal, Plus, Search, Users } from "lucide-react";
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
import { CustomerFormDialog } from "@/features/customers/components/customer-form-dialog";
import { useCustomerRows, useSetCustomerStatus } from "@/features/customers/hooks";
import { formatCurrency, formatDate } from "@/lib/utils";
import type { Customer } from "@/types";

function CustomerTypeBadge({ type }: { type: Customer["type"] }) {
  return <Badge variant={type === "regular" ? "default" : "secondary"}>{type === "regular" ? "Regular" : "Walk-in"}</Badge>;
}

function RowActions({ customer }: { customer: Customer }) {
  const navigate = useNavigate();
  const setStatus = useSetCustomerStatus(customer.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => e.stopPropagation()}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
        <DropdownMenuItem onClick={() => navigate(`/app/customers/${customer.id}`)}>View Profile</DropdownMenuItem>
        {customer.status === "active" ? (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setStatus.mutate("archived")}
          >
            Archive Customer
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => setStatus.mutate("active")}>Reactivate Customer</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CustomersListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<Customer["type"] | "all">("all");
  const [status, setStatus] = useState<Customer["status"] | "all">("active");
  const [addOpen, setAddOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useCustomerRows({ search, type, status });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Customers"
        description="Every customer who has walked through the door, with their devices and repair history."
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus /> Add Customer
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, phone, email..."
            className="pl-8"
          />
        </div>
        <Select value={type} onValueChange={(v) => setType(v as Customer["type"] | "all")}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="regular">Regular</SelectItem>
            <SelectItem value="walk_in">Walk-in</SelectItem>
          </SelectContent>
        </Select>
        <Select value={status} onValueChange={(v) => setStatus(v as Customer["status"] | "all")}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
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
          icon={Users}
          title="No customers match your filters"
          description="Try adjusting your search or filters, or add a new customer."
          action={
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus /> Add Customer
            </Button>
          }
        />
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Customer</th>
                <th className="px-4 py-2.5 font-medium">Phone</th>
                <th className="px-4 py-2.5 font-medium">Type</th>
                <th className="px-4 py-2.5 font-medium">Devices</th>
                <th className="px-4 py-2.5 font-medium">Orders</th>
                <th className="px-4 py-2.5 font-medium">Total Spent</th>
                <th className="px-4 py-2.5 font-medium">Since</th>
                <th className="px-4 py-2.5 font-medium" />
              </tr>
            </thead>
            <tbody>
              {data.map(({ customer, deviceCount, orderCount, openOrderCount, totalSpent }) => (
                <tr
                  key={customer.id}
                  onClick={() => navigate(`/app/customers/${customer.id}`)}
                  className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-accent/50"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{customer.name}</div>
                    {customer.email && <div className="text-xs text-muted-foreground">{customer.email}</div>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{customer.phone}</td>
                  <td className="px-4 py-3">
                    <CustomerTypeBadge type={customer.type} />
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{deviceCount}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {orderCount}
                    {openOrderCount > 0 && <span className="ml-1.5 text-xs text-primary">({openOrderCount} open)</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{formatCurrency(totalSpent)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{formatDate(customer.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <RowActions customer={customer} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <CustomerFormDialog open={addOpen} onOpenChange={setAddOpen} onSaved={(c) => navigate(`/app/customers/${c.id}`)} />
    </div>
  );
}
