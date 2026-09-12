import {
  BatteryCharging,
  Camera,
  Cpu,
  Database,
  Droplets,
  type LucideIcon,
  Plug,
  ScanSearch,
  Smartphone,
  Volume2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { db } from "@/mocks/db";

const SERVICE_ICONS: Record<string, LucideIcon> = {
  "SVC-01": Smartphone,
  "SVC-02": BatteryCharging,
  "SVC-03": Plug,
  "SVC-04": Droplets,
  "SVC-05": Camera,
  "SVC-06": Cpu,
  "SVC-07": Database,
  "SVC-08": Volume2,
  "SVC-09": Cpu,
  "SVC-10": ScanSearch,
};

export function ServicesSection() {
  const featured = db.serviceCatalog.filter((s) => s.status === "active").slice(0, 8);

  return (
    <section className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">What We Fix</span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Repair services for every issue</h2>
        <p className="mt-3 text-muted-foreground">
          Whatever's wrong with your device, our technicians have the parts and expertise to fix it right.
        </p>
      </div>

      <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((service) => {
          const Icon = SERVICE_ICONS[service.id] ?? Smartphone;
          return (
            <Card key={service.id} className="group transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-semibold text-foreground">{service.name}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{service.description}</p>
                <p className="mt-3 text-sm font-medium text-primary">
                  {service.basePrice === 0 ? "Free" : `From ৳${service.basePrice.toLocaleString()}`}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-10 text-center">
        <Link to="/services" className="text-sm font-semibold text-primary hover:underline">
          View all services →
        </Link>
      </div>
    </section>
  );
}
