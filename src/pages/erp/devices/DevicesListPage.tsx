import { Plus, Search, Smartphone } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/feedback/empty-state";
import { ErrorState } from "@/components/feedback/error-state";
import { DeviceFormDialog } from "@/features/devices/components/device-form-dialog";
import { DEVICE_TYPE_ICON, DEVICE_TYPE_LABEL } from "@/features/devices/constants";
import { useDeviceRows } from "@/features/devices/hooks";
import { formatDate } from "@/lib/utils";
import type { DeviceType } from "@/types";

export function DevicesListPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [type, setType] = useState<DeviceType | "all">("all");
  const [addOpen, setAddOpen] = useState(false);

  const { data, isLoading, isError, refetch } = useDeviceRows({ search, type });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Devices"
        description="Every device on file, across every customer, with its full repair history."
        actions={
          <Button size="sm" onClick={() => setAddOpen(true)}>
            <Plus /> Add Device
          </Button>
        }
      />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 sm:max-w-xs">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search brand, model, IMEI, owner..."
            className="pl-8"
          />
        </div>
        <Select value={type} onValueChange={(v) => setType(v as DeviceType | "all")}>
          <SelectTrigger className="sm:w-44">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {(Object.keys(DEVICE_TYPE_LABEL) as DeviceType[]).map((t) => (
              <SelectItem key={t} value={t}>
                {DEVICE_TYPE_LABEL[t]}
              </SelectItem>
            ))}
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
          icon={Smartphone}
          title="No devices match your filters"
          description="Try adjusting your search or filters, or add a new device."
          action={
            <Button size="sm" onClick={() => setAddOpen(true)}>
              <Plus /> Add Device
            </Button>
          }
        />
      )}

      {data && data.length > 0 && (
        <div className="overflow-x-auto rounded-md border border-border bg-card">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/40 text-left text-xs text-muted-foreground">
                <th className="px-4 py-2.5 font-medium">Device</th>
                <th className="px-4 py-2.5 font-medium">IMEI / Serial</th>
                <th className="px-4 py-2.5 font-medium">Owner</th>
                <th className="px-4 py-2.5 font-medium">Orders</th>
                <th className="px-4 py-2.5 font-medium">Last Service</th>
                <th className="px-4 py-2.5 font-medium">Added</th>
              </tr>
            </thead>
            <tbody>
              {data.map(({ device, customer, orderCount, lastServiceAt }) => {
                const Icon = DEVICE_TYPE_ICON[device.type];
                return (
                  <tr
                    key={device.id}
                    onClick={() => navigate(`/app/devices/${device.id}`)}
                    className="cursor-pointer border-b border-border/60 last:border-0 hover:bg-accent/50"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
                          <Icon className="h-4 w-4" />
                        </span>
                        <div className="min-w-0">
                          <div className="truncate font-medium text-foreground">
                            {device.brand} {device.model}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {DEVICE_TYPE_LABEL[device.type]}
                            {device.color ? ` · ${device.color}` : ""}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{device.imei}</td>
                    <td className="px-4 py-3">
                      {customer ? (
                        <Link
                          to={`/app/customers/${customer.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-foreground hover:text-primary"
                        >
                          {customer.name}
                        </Link>
                      ) : (
                        <span className="text-muted-foreground">Unknown</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{orderCount}</td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {lastServiceAt ? formatDate(lastServiceAt) : "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{formatDate(device.createdAt)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <DeviceFormDialog open={addOpen} onOpenChange={setAddOpen} onSaved={(d) => navigate(`/app/devices/${d.id}`)} />
    </div>
  );
}
