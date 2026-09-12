import { ClipboardCheck, PackageCheck, Search, ThumbsUp, Wrench } from "lucide-react";

const STEPS = [
  {
    icon: ClipboardCheck,
    title: "Drop Off or Book Online",
    description: "Bring your device in or reserve a slot online — we log the intake in minutes.",
  },
  {
    icon: Search,
    title: "Free Diagnosis",
    description: "A certified technician inspects the device and identifies the exact issue.",
  },
  {
    icon: ThumbsUp,
    title: "Transparent Approval",
    description: "We share the exact cost upfront — nothing starts until you approve it.",
  },
  {
    icon: Wrench,
    title: "Expert Repair",
    description: "Genuine parts, careful workmanship, and a quality check before it leaves the bench.",
  },
  {
    icon: PackageCheck,
    title: "Ready for Pickup",
    description: "We notify you the moment it's ready — most repairs are done the same day.",
  },
];

export function ProcessSection() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">How It Works</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            From drop-off to pickup, fully tracked
          </h2>
          <p className="mt-3 text-muted-foreground">
            Every repair moves through the same transparent process — no surprises, no guesswork.
          </p>
        </div>

        <div className="relative mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          <div className="absolute left-0 right-0 top-6 hidden h-px bg-border lg:block" aria-hidden="true" />
          {STEPS.map((step, i) => (
            <div key={step.title} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background text-primary">
                <step.icon className="h-5 w-5" />
              </div>
              <span className="mt-3 text-xs font-semibold text-primary">STEP {i + 1}</span>
              <h3 className="mt-1 font-semibold text-foreground">{step.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
