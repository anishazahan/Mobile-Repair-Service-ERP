import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import { formatCurrency } from "@/lib/utils";
import type { RevenuePoint } from "@/features/dashboard/types";

function abbreviateCurrency(value: number): string {
  if (value >= 1000) return `৳${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  return `৳${value}`;
}

function RevenueTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: RevenuePoint }> }) {
  if (!active || !payload?.length) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">{point.label}</p>
      <p className="text-muted-foreground">{formatCurrency(point.revenue)} collected</p>
    </div>
  );
}

export function RevenueTrendChart({ data }: { data: RevenuePoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_COLORS.seriesBlue} stopOpacity={0.22} />
            <stop offset="100%" stopColor={CHART_COLORS.seriesBlue} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} stroke={CHART_COLORS.gridline} strokeDasharray="0" />
        <XAxis
          dataKey="label"
          tickLine={false}
          axisLine={{ stroke: CHART_COLORS.axis }}
          tick={{ fill: CHART_COLORS.mutedInk, fontSize: 11 }}
          interval="preserveStartEnd"
          minTickGap={24}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={{ fill: CHART_COLORS.mutedInk, fontSize: 11 }}
          tickFormatter={abbreviateCurrency}
          width={44}
        />
        <Tooltip content={<RevenueTooltip />} cursor={{ stroke: CHART_COLORS.axis, strokeWidth: 1 }} />
        <Area
          type="monotone"
          dataKey="revenue"
          stroke={CHART_COLORS.seriesBlue}
          strokeWidth={2}
          fill="url(#revenueFill)"
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
