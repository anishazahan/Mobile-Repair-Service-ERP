import { BatteryCharging, Camera, Crop, Droplet, Thermometer, Wifi } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const ISSUES = [
  { icon: Crop, title: "Cracked Screen" },
  { icon: Droplet, title: "Water Damage" },
  { icon: Thermometer, title: "Overheating" },
  { icon: BatteryCharging, title: "Not Charging" },
  { icon: Camera, title: "Broken Camera" },
  { icon: Wifi, title: "Sporadic Wi-Fi" },
];

export function IssuesGridSection() {
  return (
    <section className="container py-20">
      <Reveal className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">What We Do</span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          You Break It! We Can Fix It!
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-px overflow-hidden border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
        {ISSUES.map((issue, i) => (
          <Reveal
            key={issue.title}
            delay={i * 80}
            className="group flex flex-col items-center gap-4 bg-background px-8 py-10 text-center transition-colors duration-300 hover:bg-primary/[0.04]"
          >
            <issue.icon className="h-9 w-9 stroke-[1.4] text-primary transition-transform duration-300 group-hover:scale-110" />
            <h3 className="font-semibold text-foreground">{issue.title}</h3>
            <p className="text-sm text-muted-foreground">
              Diagnosed for free and repaired the same day by a certified technician.
            </p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
