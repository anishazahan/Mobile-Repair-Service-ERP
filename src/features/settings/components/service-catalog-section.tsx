import { ListChecks, MoreHorizontal, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { ServiceCatalogFormDialog } from "@/features/settings/components/service-catalog-form-dialog";
import { useServiceCatalogRows, useSetServiceCatalogItemStatus } from "@/features/settings/hooks";
import { formatCurrency } from "@/lib/utils";
import type { ServiceCatalogItem } from "@/types";

function RowActions({ item, onEdit }: { item: ServiceCatalogItem; onEdit: () => void }) {
  const setStatus = useSetServiceCatalogItemStatus(item.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
        {item.status === "active" ? (
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => setStatus.mutate("inactive")}
          >
            Mark Inactive
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem onClick={() => setStatus.mutate("active")}>Mark Active</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ServiceCatalogSection() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ServiceCatalogItem["status"] | "all">("all");
  const [dialogItem, setDialogItem] = useState<ServiceCatalogItem | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useServiceCatalogRows({ search, status });

  function openAdd() {
    setDialogItem(undefined);
    setDialogOpen(true);
  }

  function openEdit(item: ServiceCatalogItem) {
    setDialogItem(item);
    setDialogOpen(true);
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Service & Pricing Catalog</CardTitle>
        <Button size="sm" onClick={openAdd}>
          <Plus /> Add Service
        </Button>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, category..."
              className="pl-8"
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as ServiceCatalogItem["status"] | "all")}>
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
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        )}

        {data && data.length === 0 && (
          <EmptyState
            icon={ListChecks}
            title="No services match your filters"
            description="Try adjusting your search or filters, or add a new service."
          />
        )}

        {data && data.length > 0 && (
          <div className="overflow-x-auto rounded-md border border-border">
            <table className="w-full min-w-[720px] text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-medium">Service</th>
                  <th className="px-4 py-2.5 font-medium">Category</th>
                  <th className="px-4 py-2.5 font-medium">Base Price</th>
                  <th className="px-4 py-2.5 font-medium">Est. Duration</th>
                  <th className="px-4 py-2.5 font-medium">Status</th>
                  <th className="px-4 py-2.5 font-medium" />
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b border-border/60 last:border-0 hover:bg-accent/50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{item.name}</div>
                      {item.description && (
                        <div className="max-w-xs truncate text-xs text-muted-foreground">{item.description}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.category}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {item.basePrice === 0 ? "Free" : formatCurrency(item.basePrice)}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.estDurationMinutes} min</td>
                    <td className="px-4 py-3">
                      <Badge variant={item.status === "active" ? "success" : "secondary"}>
                        {item.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <RowActions item={item} onEdit={() => openEdit(item)} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>

      <ServiceCatalogFormDialog open={dialogOpen} onOpenChange={setDialogOpen} item={dialogItem} />
    </Card>
  );
}
