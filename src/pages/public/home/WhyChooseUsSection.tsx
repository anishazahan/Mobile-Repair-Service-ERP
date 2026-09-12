import { BadgeCheck, Clock, ShieldCheck, Sparkles, Tag, Users } from "lucide-react";

const REASONS = [
  { icon: ShieldCheck, title: "90-Day Warranty", description: "Every repair is backed by a genuine warranty — parts and labor." },
  { icon: BadgeCheck, title: "Genuine Parts Only", description: "We never use counterfeit components — sourced from vetted suppliers." },
  { icon: Clock, title: "Fast Turnaround", description: "Most repairs are completed the same day, some in under an hour." },
  { icon: Tag, title: "Transparent Pricing", description: "You approve the exact cost before any work begins — no hidden fees." },
  { icon: Users, title: "Certified Technicians", description: "Our team is trained and specialized across every major brand." },
  { icon: Sparkles, title: "Free Diagnostics", description: "No obligation, no cost to find out exactly what's wrong." },
];

export function WhyChooseUsSection() {
  return (
    <section className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">Why GadgetFIX</span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Repairs you can actually trust</h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {REASONS.map((reason) => (
          <div key={reason.title} className="flex gap-4 rounded-xl border border-border p-5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <reason.icon className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{reason.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{reason.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
