import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface KpiCardProps {
  label: string;
  value: string;
  icon: LucideIcon;
  trend?: { value: string; direction: "up" | "down"; positive?: boolean };
  accent?: "primary" | "success" | "warning" | "destructive";
  /** When set, the whole card links into the module this metric summarizes. */
  to?: string;
}

const ACCENT_CLASSES: Record<NonNullable<KpiCardProps["accent"]>, string> = {
  primary: "bg-primary/10 text-primary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

/** Compact metric tile used across the Dashboard and Reports. */
export function KpiCard({ label, value, icon: Icon, trend, accent = "primary", to }: KpiCardProps) {
  const content = (
    <CardContent className="flex items-start justify-between p-5">
      <div className="space-y-1.5">
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-semibold tracking-tight text-foreground">{value}</p>
        {trend && (
          <p
            className={cn(
              "flex items-center gap-1 text-xs font-medium",
              trend.positive === false ? "text-destructive" : "text-success",
            )}
          >
            {trend.direction === "up" ? (
              <ArrowUpRight className="h-3.5 w-3.5" />
            ) : (
              <ArrowDownRight className="h-3.5 w-3.5" />
            )}
            {trend.value}
          </p>
        )}
      </div>
      <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", ACCENT_CLASSES[accent])}>
        <Icon className="h-5 w-5" />
      </div>
    </CardContent>
  );

  if (to) {
    return (
      <Card className="transition-colors hover:border-primary/40 hover:bg-accent/30">
        <Link to={to}>{content}</Link>
      </Card>
    );
  }

  return <Card>{content}</Card>;
}
