import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Reveal } from "@/components/motion/reveal";
import { db } from "@/mocks/db";
import { cn } from "@/lib/utils";

const FEATURED_IDS = ["SVC-10", "SVC-02", "SVC-01", "SVC-09"];
const POPULAR_ID = "SVC-01";

export function PricingSection() {
  const packages = FEATURED_IDS.map((id) => db.serviceCatalog.find((s) => s.id === id)).filter(
    (s): s is NonNullable<typeof s> => Boolean(s),
  );

  return (
    <section className="container py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">Pricing</span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Simple, honest pricing</h2>
        <p className="mt-3 text-muted-foreground">
          Starting prices for our most requested repairs — your technician confirms the exact
          cost after a free diagnosis, before any work begins.
        </p>
      </Reveal>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {packages.map((pkg, i) => {
          const isPopular = pkg.id === POPULAR_ID;
          return (
            <Reveal key={pkg.id} delay={i * 90} className="h-full">
            <Card
              className={cn(
                "relative flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                isPopular && "border-primary shadow-md ring-1 ring-primary",
              )}
            >
              {isPopular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2" variant="default">
                  Most Popular
                </Badge>
              )}
              <CardContent className="flex flex-1 flex-col p-6">
                <h3 className="font-semibold text-foreground">{pkg.name}</h3>
                <p className="mt-3 text-3xl font-bold tracking-tight text-foreground">
                  {pkg.basePrice === 0 ? "Free" : `৳${pkg.basePrice.toLocaleString()}`}
                  {pkg.basePrice > 0 && <span className="text-sm font-normal text-muted-foreground"> starting</span>}
                </p>
                <ul className="mt-5 flex-1 space-y-2.5 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> ~{pkg.estDurationMinutes} min turnaround
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Genuine parts & warranty
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" /> Free re-diagnosis if unresolved
                  </li>
                </ul>
                <Button
                  className="mt-6 rounded-none text-[13px] font-semibold uppercase tracking-wider"
                  variant={isPopular ? "default" : "outline"}
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
    </section>
  );
}
