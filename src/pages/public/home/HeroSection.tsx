import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1550041473-d296a3a8a18a?q=85&w=2200&auto=format&fit=crop";

const STATS = [
  { value: "15+", label: "Years Experience" },
  { value: "12K+", label: "Devices Repaired" },
];

export function HeroSection() {
  return (
    <section className="bg-background">
      <div className="grid lg:grid-cols-2">
        <div className="flex items-center bg-background px-6 py-16 sm:px-10 lg:px-16 lg:py-0">
          <Reveal direction="left" className="max-w-lg space-y-6">
            <h1 className="text-4xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-[3.25rem]">
              Have Broken <span className="text-primary">Gadget?</span> We Can Fix Anything
            </h1>
            <p className="text-muted-foreground">
              From cracked screens to water damage, our certified technicians diagnose the issue
              for free and get you back up and running — usually the same day, with genuine parts
              and a real warranty.
            </p>
            <Button size="lg" className="rounded-none px-8 text-[13px] font-semibold uppercase tracking-wider" asChild>
              <Link to="/book-a-service">Book a Service</Link>
            </Button>
          </Reveal>
        </div>

        <Reveal direction="right" delay={150} className="relative min-h-[340px] lg:min-h-[560px]">
          <img
            src={HERO_IMAGE}
            alt="Technician repairing a smartphone with precision tools"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-x-0 bottom-0 grid grid-cols-2 bg-primary text-primary-foreground sm:inset-x-8 sm:bottom-8 sm:w-fit sm:min-w-[320px]">
            {STATS.map((stat) => (
              <div key={stat.label} className="px-8 py-6 text-center first:border-r first:border-white/20">
                <p className="text-3xl font-extrabold">{stat.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wide text-primary-foreground/85">{stat.label}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
