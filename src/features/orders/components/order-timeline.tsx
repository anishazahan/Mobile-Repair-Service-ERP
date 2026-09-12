import {
  AlertTriangle,
  CheckCircle2,
  MessageSquare,
  UserCog,
  Wrench,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { EmptyState } from "@/components/feedback/empty-state";
import { cn, formatDateTime } from "@/lib/utils";
import type { OrderTimelineEvent } from "@/types";

const EVENT_STYLE: Record<OrderTimelineEvent["type"], { icon: LucideIcon; dot: string; ring: string }> = {
  status_change: { icon: Wrench, dot: "bg-primary", ring: "border-primary/30" },
  note: { icon: MessageSquare, dot: "bg-muted-foreground", ring: "border-border" },
  approval: { icon: CheckCircle2, dot: "bg-success", ring: "border-success/30" },
  assignment: { icon: UserCog, dot: "bg-accent", ring: "border-accent/30" },
  warning: { icon: AlertTriangle, dot: "bg-warning", ring: "border-warning/30" },
  cancellation: { icon: XCircle, dot: "bg-destructive", ring: "border-destructive/30" },
};

export function OrderTimeline({ events }: { events: OrderTimelineEvent[] }) {
  if (events.length === 0) {
    return <EmptyState icon={MessageSquare} title="No activity yet" description="Timeline events will appear here as the order progresses." />;
  }

  const sorted = [...events].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <ol className="space-y-0">
      {sorted.map((event, i) => {
        const style = EVENT_STYLE[event.type];
        const Icon = style.icon;
        return (
          <li key={event.id} className="relative flex gap-4 pb-8 last:pb-0">
            {i !== sorted.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-1.5rem)] w-px bg-border" />}
            <span
              className={cn(
                "z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-background text-white",
                style.ring,
              )}
            >
              <span className={cn("flex h-5 w-5 items-center justify-center rounded-full", style.dot)}>
                <Icon className="h-3 w-3" />
              </span>
            </span>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="text-sm font-medium text-foreground">{event.label}</p>
                <p className="shrink-0 text-xs text-muted-foreground">{formatDateTime(event.createdAt)}</p>
              </div>
              {event.description && <p className="mt-1 text-sm text-muted-foreground">{event.description}</p>}
              <p className="mt-1 text-xs text-muted-foreground">
                {event.actorName} · <span className="capitalize">{event.actorRole.replace("_", " ")}</span>
              </p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
