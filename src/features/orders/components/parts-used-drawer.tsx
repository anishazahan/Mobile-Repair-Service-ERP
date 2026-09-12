import { Minus, Plus, Search, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAddPartsUsed } from "@/features/orders/hooks";
import { db } from "@/mocks/db";
import { cn, formatCurrency } from "@/lib/utils";
import type { OrderPartLine } from "@/types";

interface DraftLine extends OrderPartLine {
  availableStock: number;
}

export function PartsUsedDrawer({
  orderId,
  open,
  onOpenChange,
}: {
  orderId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [draft, setDraft] = useState<DraftLine[]>([]);
  const mutation = useAddPartsUsed(orderId);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return db.parts
      .filter((p) => p.name.toLowerCase().includes(q) || p.compatibleModels.some((m) => m.toLowerCase().includes(q)))
      .slice(0, 6);
  }, [query]);

  function addPart(partId: string) {
    const part = db.parts.find((p) => p.id === partId);
    if (!part) return;
    setDraft((prev) => {
      if (prev.some((l) => l.partId === partId)) return prev;
      return [...prev, { partId: part.id, partName: part.name, quantity: 1, unitPrice: part.sellingPrice, availableStock: part.quantityInStock }];
    });
    setQuery("");
  }

  function updateQty(partId: string, delta: number) {
    setDraft((prev) =>
      prev.map((l) => (l.partId === partId ? { ...l, quantity: Math.max(1, l.quantity + delta) } : l)),
    );
  }

  function removeLine(partId: string) {
    setDraft((prev) => prev.filter((l) => l.partId !== partId));
  }

  const subtotal = draft.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  async function handleSave() {
    if (draft.length === 0) return;
    await mutation.mutateAsync({ parts: draft.map(({ availableStock: _availableStock, ...line }) => line) });
    setDraft([]);
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add Parts Used</SheetTitle>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          <div className="relative">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search parts by name or model..."
              className="pl-8"
            />
            {results.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-md">
                {results.map((part) => (
                  <button
                    key={part.id}
                    type="button"
                    onClick={() => addPart(part.id)}
                    className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-sm hover:bg-accent"
                  >
                    <span>
                      <span className="font-medium text-foreground">{part.name}</span>
                      <span className="ml-2 text-xs text-muted-foreground">{formatCurrency(part.sellingPrice)}</span>
                    </span>
                    <span
                      className={cn(
                        "shrink-0 text-xs",
                        part.quantityInStock === 0 ? "text-destructive" : part.quantityInStock <= part.reorderLevel ? "text-warning" : "text-muted-foreground",
                      )}
                    >
                      {part.quantityInStock} in stock
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Separator />

          {draft.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">No parts added yet — search above to add one.</p>
          ) : (
            <div className="space-y-3">
              {draft.map((line) => (
                <div key={line.partId} className="rounded-md border border-border p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{line.partName}</p>
                      <p className="text-xs text-muted-foreground">{formatCurrency(line.unitPrice)} each</p>
                      {line.quantity > line.availableStock && (
                        <Badge variant="warning" className="mt-1">
                          Only {line.availableStock} in stock
                        </Badge>
                      )}
                    </div>
                    <button onClick={() => removeLine(line.partId)} className="text-muted-foreground hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(line.partId, -1)}>
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="w-6 text-center text-sm tabular-nums">{line.quantity}</span>
                      <Button type="button" variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQty(line.partId, 1)}>
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                    <p className="text-sm font-medium text-foreground">{formatCurrency(line.unitPrice * line.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-border p-4">
          <div className="mb-3 flex items-center justify-between text-sm font-medium">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <Button className="w-full" disabled={draft.length === 0 || mutation.isPending} onClick={handleSave}>
            Add {draft.length > 0 ? `${draft.length} Part${draft.length > 1 ? "s" : ""}` : "Parts"} to Order
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
