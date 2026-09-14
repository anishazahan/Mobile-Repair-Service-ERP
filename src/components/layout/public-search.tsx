import { Input } from "@/components/ui/input";
import { useServiceCatalogRows } from "@/features/settings/hooks";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { formatCurrency } from "@/lib/utils";
import { Compass, Search, Wrench, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const PAGES = [
  { label: "Home", to: "/", description: "Back to the homepage" },
  { label: "Services", to: "/services", description: "Everything we repair" },
  {
    label: "Pricing",
    to: "/pricing",
    description: "Rates and service packages",
  },
  { label: "About Us", to: "/about", description: "Our story and workshop" },
  { label: "Our Team", to: "/team", description: "Meet the technicians" },
  { label: "Contact", to: "/contact", description: "Get in touch" },
  {
    label: "Book a Service",
    to: "/book-a-service",
    description: "Reserve a repair slot",
  },
];

const MAX_RESULTS = 5;

export function PublicSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const debouncedQuery = useDebouncedValue(query.trim(), 250);
  const isSearching = debouncedQuery.length >= 2;

  const { data: services, isFetching } = useServiceCatalogRows(
    { search: debouncedQuery, status: "active" },
    { enabled: isSearching },
  );

  const matchedPages = isSearching
    ? PAGES.filter((p) =>
        p.label.toLowerCase().includes(debouncedQuery.toLowerCase()),
      ).slice(0, MAX_RESULTS)
    : [];
  const matchedServices = isSearching
    ? (services ?? []).slice(0, MAX_RESULTS)
    : [];
  const hasResults = matchedPages.length > 0 || matchedServices.length > 0;

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  function close() {
    setIsOpen(false);
    setQuery("");
  }

  function goTo(to: string) {
    navigate(to);
    close();
  }

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label={isOpen ? "Close search" : "Search"}
        onClick={() => setIsOpen((v) => !v)}
        className="text-foreground/70 transition-colors hover:text-primary mt-1"
      >
        {isOpen ? (
          <X className="h-[18px] w-[18px]" />
        ) : (
          <Search className="h-[18px] w-[18px]" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-80 border border-border bg-popover shadow-md">
          <div className="relative border-b border-border p-2.5">
            <Search className="pointer-events-none absolute left-5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Escape" && close()}
              placeholder="Search services, pages…"
              className="pl-8"
            />
          </div>

          <div className="max-h-[60vh] overflow-y-auto">
            {!isSearching && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Type at least 2 characters to search.
              </p>
            )}

            {isSearching && isFetching && !hasResults && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                Searching…
              </p>
            )}

            {isSearching && !isFetching && !hasResults && (
              <p className="px-3 py-6 text-center text-sm text-muted-foreground">
                No results for "{debouncedQuery}"
              </p>
            )}

            {matchedPages.length > 0 && (
              <div className="border-b border-border py-1.5">
                <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Pages
                </p>
                {matchedPages.map((page) => (
                  <button
                    key={page.to}
                    onClick={() => goTo(page.to)}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-accent"
                  >
                    <Compass className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-foreground">
                        {page.label}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {page.description}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            )}

            {matchedServices.length > 0 && (
              <div className="py-1.5">
                <p className="px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                  Services
                </p>
                {matchedServices.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => goTo("/services")}
                    className="flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-accent"
                  >
                    <Wrench className="h-4 w-4 shrink-0 text-muted-foreground" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-medium text-foreground">
                        {service.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {service.category}
                      </span>
                    </span>
                    <span className="shrink-0 text-xs font-semibold text-primary">
                      {service.basePrice === 0
                        ? "Free"
                        : formatCurrency(service.basePrice)}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
