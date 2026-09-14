import { Search, Smartphone, User, Wrench, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { OrderStatusBadge } from "@/components/feedback/status-badge";
import { useCustomerRows } from "@/features/customers/hooks";
import { useDeviceRows } from "@/features/devices/hooks";
import { useOrders } from "@/features/orders/hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { cn } from "@/lib/utils";

const MAX_PER_GROUP = 5;

export function GlobalSearch() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebouncedValue(query.trim(), 250);
  const isSearching = debouncedQuery.length >= 2;

  const { data: orderRows, isFetching: ordersLoading } = useOrders(
    { search: debouncedQuery },
    { enabled: isSearching },
  );
  const { data: customerRows, isFetching: customersLoading } = useCustomerRows(
    { search: debouncedQuery },
    { enabled: isSearching },
  );
  const { data: deviceRows, isFetching: devicesLoading } = useDeviceRows(
    { search: debouncedQuery },
    { enabled: isSearching },
  );

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function clearAndClose() {
    setQuery("");
    setIsOpen(false);
  }

  function goTo(path: string) {
    navigate(path);
    clearAndClose();
  }

  const orders = isSearching ? (orderRows ?? []).slice(0, MAX_PER_GROUP) : [];
  const customers = isSearching ? (customerRows ?? []).slice(0, MAX_PER_GROUP) : [];
  const devices = isSearching ? (deviceRows ?? []).slice(0, MAX_PER_GROUP) : [];
  const isLoading = ordersLoading || customersLoading || devicesLoading;
  const hasResults = orders.length > 0 || customers.length > 0 || devices.length > 0;
  const showPanel = isOpen && isSearching;

  return (
    <div ref={containerRef} className="relative hidden max-w-sm flex-1 sm:block">
      <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "Escape") clearAndClose();
        }}
        placeholder="Search orders, customers, devices…"
        className="pl-8 pr-8"
      />
      {query && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={clearAndClose}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {showPanel && (
        <div className="absolute left-0 right-0 top-full z-50 mt-1.5 max-h-[70vh] overflow-y-auto border border-border bg-popover shadow-md">
          {isLoading && !hasResults && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">Searching…</p>
          )}

          {!isLoading && !hasResults && (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground">
              No results for "{debouncedQuery}"
            </p>
          )}

          {orders.length > 0 && (
            <div className="border-b border-border py-1.5">
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Service Orders
              </p>
              {orders.map((row) => (
                <button
                  key={row.order.id}
                  onClick={() => goTo(`/app/orders/${row.order.id}`)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <Wrench className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">{row.order.id}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {row.customer?.name ?? "Unknown customer"}
                      {row.device ? ` · ${row.device.brand} ${row.device.model}` : ""}
                    </span>
                  </span>
                  <OrderStatusBadge status={row.order.status} />
                </button>
              ))}
            </div>
          )}

          {customers.length > 0 && (
            <div className={cn("py-1.5", devices.length > 0 && "border-b border-border")}>
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Customers
              </p>
              {customers.map((row) => (
                <button
                  key={row.customer.id}
                  onClick={() => goTo(`/app/customers/${row.customer.id}`)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <User className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">{row.customer.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{row.customer.phone}</span>
                  </span>
                </button>
              ))}
            </div>
          )}

          {devices.length > 0 && (
            <div className="py-1.5">
              <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                Devices
              </p>
              {devices.map((row) => (
                <button
                  key={row.device.id}
                  onClick={() => goTo(`/app/devices/${row.device.id}`)}
                  className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-accent"
                >
                  <Smartphone className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-foreground">
                      {row.device.brand} {row.device.model}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      IMEI {row.device.imei}
                      {row.customer ? ` · ${row.customer.name}` : ""}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
