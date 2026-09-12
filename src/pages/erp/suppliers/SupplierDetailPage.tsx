import { ChevronRight, Mail, MapPin, Package, Pencil, Phone, User } from "lucide-react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { categoryLabel, stockBadge } from "@/features/parts/constants";
import { SupplierFormDialog } from "@/features/suppliers/components/supplier-form-dialog";
import { useSetSupplierStatus, useSupplier } from "@/features/suppliers/hooks";
import { formatCurrency } from "@/lib/utils";

export function SupplierDetailPage() {
  const { id = "" } = useParams();
  const { data, isLoading, isError, refetch } = useSupplier(id);
  const [editOpen, setEditOpen] = useState(false);
  const setStatus = useSetSupplierStatus(id);

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
    return <ErrorState onRetry={() => refetch()} description="We couldn't load this supplier." />;
  }

  const { supplier, parts, stockValue } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/app/inventory/suppliers" className="hover:text-foreground">
              Suppliers
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-foreground">{supplier.name}</span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2">
            <h1 className="text-xl font-semibold tracking-tight text-foreground">{supplier.name}</h1>
            <Badge variant={supplier.status === "active" ? "success" : "secondary"}>
              {supplier.status === "active" ? "Active" : "Inactive"}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">Contact: {supplier.contactPerson}</p>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setEditOpen(true)}>
            <Pencil /> Edit
          </Button>
          {supplier.status === "active" ? (
            <Button variant="outline" size="sm" onClick={() => setStatus.mutate("inactive")}>
              Mark Inactive
            </Button>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setStatus.mutate("active")}>
              Reactivate
            </Button>
          )}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Parts Supplied ({parts.length})</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {parts.length === 0 ? (
                <EmptyState icon={Package} title="No parts on file from this supplier" className="py-8" />
              ) : (
                <div className="overflow-x-auto rounded-md border border-border">
                  <table className="w-full min-w-[640px] text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                        <th className="px-4 py-2.5 font-medium">Part</th>
                        <th className="px-4 py-2.5 font-medium">Category</th>
                        <th className="px-4 py-2.5 font-medium">Stock</th>
                        <th className="px-4 py-2.5 font-medium">Unit Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parts.map((part) => {
                        const badge = stockBadge(part);
                        return (
                          <tr key={part.id} className="border-b border-border/60 last:border-0 hover:bg-accent/50">
                            <td className="px-4 py-3">
                              <Link
                                to={`/app/inventory/parts/${part.id}`}
                                className="font-medium text-foreground hover:text-primary"
                              >
                                {part.name}
                              </Link>
                              <div className="text-xs text-muted-foreground">{part.sku}</div>
                            </td>
                            <td className="px-4 py-3">
                              <Badge variant="secondary">{categoryLabel(part.category)}</Badge>
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-2">
                                <span className="text-foreground">{part.quantityInStock}</span>
                                <Badge variant={badge.variant}>{badge.label}</Badge>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground">{formatCurrency(part.unitCost)}</td>
                          </tr>
                        );
                      })}
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
                <User className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-foreground">{supplier.contactPerson}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="text-foreground">{supplier.phone}</span>
              </div>
              {supplier.email && (
                <div className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-foreground">{supplier.email}</span>
                </div>
              )}
              {supplier.address && (
                <div className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="text-foreground">{supplier.address}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-0 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Parts Supplied</span>
                <span className="font-medium text-foreground">{parts.length}</span>
              </div>
              <div className="flex justify-between border-t border-border pt-2">
                <span className="text-muted-foreground">Current Stock Value</span>
                <span className="font-medium text-foreground">{formatCurrency(stockValue)}</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <SupplierFormDialog open={editOpen} onOpenChange={setEditOpen} supplier={supplier} />
    </div>
  );
}
