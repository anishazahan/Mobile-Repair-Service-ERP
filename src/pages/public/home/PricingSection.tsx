import { BatteryCharging, Check, Cpu, ScanSearch, type LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { db } from "@/mocks/db";
import { cn } from "@/lib/utils";

const FEATURED_IDS = ["SVC-10", "SVC-02", "SVC-01", "SVC-09"];
const POPULAR_ID = "SVC-01";

const PLAN_ICONS: Record<string, LucideIcon> = {
  "SVC-10": ScanSearch,
  "SVC-02": BatteryCharging,
  "SVC-01": Cpu,
  "SVC-09": Cpu,
};

export function PricingSection() {
  const packages = FEATURED_IDS.map((id) => db.serviceCatalog.find((s) => s.id === id)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  );

  return (
    <section className="relative overflow-hidden bg-muted/30 py-24">
      <div
        className="pointer-events-none absolute -right-24 top-1/2 h-[420px] w-[420px] -translate-y-1/2 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />
      <div className="container relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing</span>
          <span className="mx-auto mt-2 block h-1 w-12 bg-primary" />
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">Simple, Honest Pricing</h2>
          <p className="mt-3 text-muted-foreground">
            Starting prices for our most requested repairs — one-time service, no subscriptions.
            Your technician confirms the exact cost after a free diagnosis, before any work begins.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-4 lg:items-center">
          {packages.map((pkg, i) => {
            const isPopular = pkg.id === POPULAR_ID;
            const Icon = PLAN_ICONS[pkg.id] ?? Cpu;
            return (
              <Reveal key={pkg.id} direction="zoom" delay={i * 110} className="h-full">
                <Card
                  className={cn(
                    "relative h-full border-none transition-all duration-500",
                    isPopular
                      ? "relative z-10 bg-primary text-primary-foreground shadow-2xl lg:scale-110"
                      : "bg-background shadow-sm hover:-translate-y-1 hover:shadow-lg",
                  )}
                >
                  <CardContent className="flex h-full flex-col p-7">
                    {isPopular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-warning px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-warning-foreground">
                        Most Popular
                      </span>
                    )}

                    <div
                      className={cn(
                        "flex h-12 w-12 items-center justify-center",
                        isPopular ? "bg-white/15 text-white" : "bg-primary/10 text-primary",
                      )}
                    >
                      <Icon className="h-6 w-6" />
                    </div>

                    <h3 className="mt-5 font-semibold">{pkg.name}</h3>

                    <p className="mt-3 flex items-baseline gap-1">
                      <span className="text-4xl font-extrabold tracking-tight">
                        {pkg.basePrice === 0 ? "Free" : `৳${pkg.basePrice.toLocaleString()}`}
                      </span>
                      {pkg.basePrice > 0 && (
                        <span className={cn("text-sm font-normal", isPopular ? "text-white/70" : "text-muted-foreground")}>
                          /repair
                        </span>
                      )}
                    </p>

                    <ul className={cn("mt-6 flex-1 space-y-3 text-sm", isPopular ? "text-white/85" : "text-muted-foreground")}>
                      {[
                        `~${pkg.estDurationMinutes} min turnaround`,
                        "Genuine parts & warranty",
                        "Free re-diagnosis if unresolved",
                      ].map((line) => (
                        <li key={line} className="flex items-center gap-2.5">
                          <Check className={cn("h-4 w-4 shrink-0", isPopular ? "text-white" : "text-primary")} />
                          {line}
                        </li>
                      ))}
                    </ul>

                    <Button
                      className={cn(
                        "mt-7 rounded-none text-[13px] font-semibold uppercase tracking-wider",
                        isPopular && "bg-white text-primary hover:bg-white/90",
                      )}
                      variant={isPopular ? undefined : "outline"}
                      asChild
                    >
                      <Link to="/book-a-service">Book This Service</Link>
                    </Button>
                  </CardContent>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
