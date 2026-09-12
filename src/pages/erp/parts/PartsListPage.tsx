import { Package, Plus, Search } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { PartFormDialog } from "@/features/parts/components/part-form-dialog";
import type { StockLevel } from "@/features/parts/api";
import { categoryLabel, stockBadge } from "@/features/parts/constants";
import { usePartRows } from "@/features/parts/hooks";
import { PART_CATEGORIES } from "@/features/parts/schema";
import { formatCurrency } from "@/lib/utils";
import type { PartCategory } from "@/types";

export function PartsListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<PartCategory | "all">("all");
  const [stock, setStock] = useState<StockLevel | "all">("all");
  const [addOpen, setAddOpen] = useState(false);

  const { data, isLoading, isError, refetch } = usePartRows({ search, category, stock });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Spare Parts"
        description="Inventory across every part on the shelf, with live stock and usage history."
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus /> Add Part
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, SKU, model..."
            className="pl-8"
          />
        </div>
        <Select value={category} onValueChange={(v) => setCategory(v as PartCategory | "all")}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {PART_CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {categoryLabel(c)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={stock} onValueChange={(v) => setStock(v as StockLevel | "all")}>
          <SelectTrigger className="sm:w-40">
            <SelectValue placeholder="Stock" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Stock Levels</SelectItem>
            <SelectItem value="in_stock">In Stock</SelectItem>
            <SelectItem value="low">Low Stock</SelectItem>
            <SelectItem value="out">Out of Stock</SelectItem>
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
          icon={Package}
          title="No parts match your filters"
          description="Try adjusting your search or filters, or add a new part."
          action={
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus /> Add Part
            </Button>
          }
        />
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[900px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Part</th>
                <th className="px-4 py-2.5 font-medium">SKU</th>
                <th className="px-4 py-2.5 font-medium">Category</th>
                <th className="px-4 py-2.5 font-medium">Supplier</th>
                <th className="px-4 py-2.5 font-medium">Stock</th>
                <th className="px-4 py-2.5 font-medium">Cost / Price</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ part, supplier }) => {
                const badge = stockBadge(part);
                return (
                  <tr
                    key={part.id}
                    onClick={() => navigate(`/app/inventory/parts/${part.id}`)}
                    className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-accent/50"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{part.name}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {part.compatibleModels.join(", ")}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{part.sku}</td>
                    <td className="px-4 py-3">
                      <Badge variant="secondary">{categoryLabel(part.category)}</Badge>
                    </td>
                    <td className="px-4 py-3">
                      {supplier ? (
                        <Link
                          to={`/app/inventory/suppliers/${supplier.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-muted-foreground hover:text-primary"
                        >
                          {supplier.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-foreground">{part.quantityInStock}</span>
                        <Badge variant={badge.variant}>{badge.label}</Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatCurrency(part.unitCost)} / {formatCurrency(part.sellingPrice)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <PartFormDialog open={addOpen} onOpenChange={setAddOpen} onSaved={(p) => navigate(`/app/inventory/parts/${p.id}`)} />
    </div>
  );
}
