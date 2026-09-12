import type { BadgeProps } from "@/components/ui/badge";
import { humanizeStatus } from "@/lib/utils";
import { stockLevel, type StockLevel } from "@/features/parts/api";
import type { SparePart } from "@/types";

type BadgeVariant = NonNullable<BadgeProps["variant"]>;

const STOCK_BADGE: Record<StockLevel, { label: string; variant: BadgeVariant }> = {
  in_stock: { label: "In Stock", variant: "success" },
  low: { label: "Low Stock", variant: "warning" },
  out: { label: "Out of Stock", variant: "destructive" },
};

export function stockBadge(part: SparePart) {
  return STOCK_BADGE[stockLevel(part)];
}

export function categoryLabel(category: string): string {
  return humanizeStatus(category);
}
