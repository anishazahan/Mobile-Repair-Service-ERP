import { ChevronRight, PackagePlus, Pencil, Tag, Truck, Wrench } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { OrderStatusBadge } from "@/components/feedback/status-badge";
import { PartFormDialog } from "@/features/parts/components/part-form-dialog";
import { RestockDialog } from "@/features/parts/components/restock-dialog";
import { categoryLabel, stockBadge } from "@/features/parts/constants";
import { usePart } from "@/features/parts/hooks";
import { formatCurrency, formatDate } from "@/lib/utils";

export function PartDetailPage() {
  const { id = "" } = useParams();
  const { data, isLoading, isError, refetch } = usePart(id);
  const [editOpen, setEditOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);

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
    return <ErrorState onRetry={() => refetch()} description="We couldn't load this spare part." />;
  }

  const { part, supplier, usage } = data;
  const badge = stockBadge(part);
  const margin = part.sellingPrice - part.unitCost;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/app/inventory/parts" className="hover:text-foreground">
              Spare Parts
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{part.name}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{part.name}</h1>
            <Badge variant="secondary">{categoryLabel(part.category)}</Badge>
            <Badge variant={badge.variant}>{badge.label}</Badge>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">SKU {part.sku}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil /> Edit
          </Button>
          <Button size="sm" onClick={() => setRestockOpen(true)}>
            <PackagePlus /> Restock
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Used In ({usage.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {usage.length === 0 ? (
                <EmptyState icon={Wrench} title="Not used on any service order yet" className="py-8" />
              ) : (
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full min-w-[560px] text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                        <th className="px-4 py-2.5 font-medium">Order</th>
                        <th className="px-4 py-2.5 font-medium">Qty Used</th>
                        <th className="px-4 py-2.5 font-medium">Status</th>
                        <th className="px-4 py-2.5 font-medium">Line Total</th>
                        <th className="px-4 py-2.5 font-medium">Created</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usage.map(({ order, quantity, unitPrice }) => (
                        <tr key={order.id} className="border-b border-border/60 last:border-0 hover:bg-accent/50">
                          <td className="px-4 py-3">
                            <Link
                              to={`/app/orders/${order.id}`}
                              className="font-medium text-foreground hover:text-primary"
                            >
                              {order.id}
                            </Link>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{quantity}</td>
                          <td className="px-4 py-3">
                            <OrderStatusBadge status={order.status} />
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">{formatCurrency(unitPrice * quantity)}</td>
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
              <CardTitle>Stock</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">In Stock</span>
                <span className="font-medium text-foreground">{part.quantityInStock}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">Reorder Level</span>
                <span className="font-medium text-foreground">{part.reorderLevel}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pricing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Unit Cost</span>
                <span className="text-foreground">{formatCurrency(part.unitCost)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Selling Price</span>
                <span className="text-foreground">{formatCurrency(part.sellingPrice)}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2 font-medium">
                <span className="text-foreground">Margin</span>
                <span className={margin >= 0 ? "text-success" : "text-destructive"}>{formatCurrency(margin)}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supplier</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {supplier ? (
                <Link to={`/app/inventory/suppliers/${supplier.id}`} className="flex items-center gap-3 hover:opacity-80">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-muted text-muted-foreground">
                    <Truck className="h-4 w-4" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-foreground">{supplier.name}</span>
                    <span className="block text-xs text-muted-foreground">{supplier.contactPerson}</span>
                  </span>
                </Link>
              ) : (
                <p className="text-sm text-muted-foreground">No supplier on file</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Compatible Models</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex flex-wrap gap-1.5">
                {part.compatibleModels.map((m) => (
                  <Badge key={m} variant="outline" className="gap-1">
                    <Tag className="h-3 w-3" /> {m}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <PartFormDialog open={editOpen} onOpenChange={setEditOpen} part={part} />
      <RestockDialog open={restockOpen} onOpenChange={setRestockOpen} part={part} />
    </div>
  );
}
