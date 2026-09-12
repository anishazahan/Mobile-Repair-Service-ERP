import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CHART_COLORS } from "@/lib/chart-colors";
import type { TechnicianWorkloadRow } from "@/features/dashboard/types";

function WorkloadTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: TechnicianWorkloadRow }>;
}) {
  if (!active || !payload?.length) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-md border border-border bg-popover px-3 py-2 text-xs shadow-md">
      <p className="font-medium text-foreground">{row.technicianName}</p>
      <p className="text-muted-foreground">
        {row.activeJobs} active {row.activeJobs === 1 ? "job" : "jobs"}
      </p>
    </div>
  );
}

export function TechnicianWorkloadChart({ data }: { data: TechnicianWorkloadRow[] }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} layout="vertical" margin={{ top: 4, right: 16, left: 0, bottom: 4 }} barCategoryGap={14}>
        <CartesianGrid horizontal={false} stroke={CHART_COLORS.gridline} />
        <XAxis type="number" allowDecimals={false} tickLine={false} axisLine={false} tick={{ fill: CHART_COLORS.mutedInk, fontSize: 11 }} />
        <YAxis
          type="category"
          dataKey="technicianName"
          tickLine={false}
          axisLine={false}
          width={96}
          tick={{ fill: CHART_COLORS.secondaryInk, fontSize: 12 }}
        />
        <Tooltip content={<WorkloadTooltip />} cursor={{ fill: CHART_COLORS.gridline, opacity: 0.5 }} />
        <Bar dataKey="activeJobs" radius={[0, 4, 4, 0]} maxBarSize={18}>
          {data.map((row) => (
            <Cell key={row.technicianId} fill={CHART_COLORS.seriesBlue} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
