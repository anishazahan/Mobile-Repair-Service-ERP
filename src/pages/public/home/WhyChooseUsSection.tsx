import { Cog, ShieldCheck, Timer, Users } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";

const REASONS = [
  { icon: Timer, title: "Quick Repair Service", description: "Most repairs are completed the same day, some in under an hour." },
  { icon: ShieldCheck, title: "Two Years Warranty", description: "Every repair is backed by a genuine warranty on parts and labor." },
  { icon: Users, title: "Expert Technicians", description: "Certified and specialized across every major device brand." },
  { icon: Cog, title: "Quality Parts", description: "We never use counterfeit components — sourced from vetted suppliers." },
];

const STATS = [
  { value: "100%", label: "Satisfaction" },
  { value: "12K+", label: "Devices Fixed" },
  { value: "20+", label: "Certified Techs" },
];

const IMAGE =
  "https://images.unsplash.com/photo-1581092921461-eab62e97a780?q=85&w=1600&auto=format&fit=crop";

export function WhyChooseUsSection() {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="grid lg:grid-cols-2">
        <Reveal direction="left" className="hidden lg:block">
          <img src={IMAGE} alt="Technician holding professional repair tools" className="h-full w-full object-cover" />
        </Reveal>

        <div className="space-y-8 px-6 py-16 sm:px-10 lg:px-16">
          <Reveal direction="right" className="space-y-4">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary-foreground/80">
              Why Choose Us?
            </span>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Quality Service And Competitive Rates</h2>
            <p className="text-primary-foreground/85">
              We treat every device like it's our own — honest diagnostics, fair pricing, and
              work that holds up long after you walk out the door.
            </p>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {REASONS.map((reason, i) => (
              <Reveal key={reason.title} direction="right" delay={120 + i * 90} className="flex gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/15 transition-transform duration-300 hover:scale-105">
                  <reason.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{reason.title}</h3>
                  <p className="mt-1 text-sm text-primary-foreground/80">{reason.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal direction="right" delay={480} className="flex flex-wrap gap-10 border-t border-white/20 pt-6">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-extrabold">{stat.value}</p>
                <p className="text-xs uppercase tracking-wide text-primary-foreground/80">{stat.label}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
