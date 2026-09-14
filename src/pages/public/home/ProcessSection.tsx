import { Reveal } from "@/components/motion/reveal";
import { Mail, PackageCheck, Truck } from "lucide-react";

const STEPS = [
  {
    icon: PackageCheck,
    title: "Walk In , Drop Off & Collect",
    description:
      "Bring your device to the shop, get a free on-the-spot diagnosis, and collect it once it's ready.",
  },
  {
    icon: Mail,
    title: "Mail In ,Send Your Gadget",
    description:
      "Ship it to us with a prepaid label  we diagnose, repair, and post it straight back to you.",
  },
  {
    icon: Truck,
    title: "Pickup , We Come Collect It",
    description:
      "Book a courier pickup from your home or office and we'll return it once the repair is complete.",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="container">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Our Process
          </span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            No Matter Where You Bought It, We Can Fix It
          </h2>
        </Reveal>

        <div className="mt-14 grid gap-10 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <Reveal
              key={step.title}
              delay={i * 120}
              className="flex flex-col items-center text-center"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-300 hover:scale-105">
                <step.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-semibold text-foreground">
                {step.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
              <div className="mt-6 flex w-full items-center gap-3">
                <span className="h-px flex-1 bg-border" />
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-foreground">
                  {i + 1}
                </span>
                <span className="h-px flex-1 bg-border" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
