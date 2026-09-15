import { humanizeStatus } from "@/lib/utils";
import type { ServiceOrderStatus } from "@/types";

const PIPELINE_ORDER: ServiceOrderStatus[] = [
  "RECEIVED",
  "INITIAL_INSPECTION",
  "DIAGNOSING",
  "AWAITING_APPROVAL",
  "APPROVED",
  "IN_REPAIR",
  "AWAITING_PARTS",
  "QUALITY_CHECK",
  "READY_FOR_PICKUP",
];

interface StatusBreakdownListProps {
  data: { status: ServiceOrderStatus; count: number }[];
}

/** Single-hue magnitude list of orders per pipeline stage — a "mini funnel". */
export function StatusBreakdownList({ data }: StatusBreakdownListProps) {
  const countByStatus = new Map(data.map((d) => [d.status, d.count]));
  const rows = PIPELINE_ORDER.map((status) => ({
    status,
    count: countByStatus.get(status) ?? 0,
  }));
  const max = Math.max(1, ...rows.map((r) => r.count));

  return (
    <div className="space-y-2.5">
      {rows.map((row) => (
        <div key={row.status} className="flex items-center gap-3">
          <span className="w-32 shrink-0 truncate text-xs text-muted-foreground">
            {humanizeStatus(row.status)}
          </span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(row.count / max) * 100}%` }}
            />
          </div>
          <span className="w-5 shrink-0 text-right text-xs font-medium tabular-nums text-foreground">
            {row.count}
          </span>
        </div>
      ))}
    </div>
  );
}
