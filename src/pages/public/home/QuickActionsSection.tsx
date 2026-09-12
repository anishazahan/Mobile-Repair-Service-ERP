import { Recycle, Wrench } from "lucide-react";

export function QuickActionsSection() {
  return (
    <section className="grid lg:grid-cols-2">
      <div className="grid grid-cols-2 gap-6 bg-muted/60 px-6 py-16 sm:px-10 lg:px-16">
        {[
          { icon: Wrench, title: "Repair Device" },
          { icon: Recycle, title: "Replace Device" },
        ].map((item) => (
          <div key={item.title} className="flex flex-col items-center text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <item.icon className="h-8 w-8" />
            </div>
            <h3 className="mt-5 font-semibold text-foreground">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Certified technicians, genuine parts, and a real warranty on every job.
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center bg-background px-6 py-16 sm:px-10 lg:px-16">
        <div className="space-y-4">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Quality Repair</span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            We Can Fix Any Problem Your Gadget
          </h2>
          <p className="text-muted-foreground">
            Whether it's a shattered screen, a battery that won't hold a charge, or something more
            serious under the hood — our team diagnoses the real problem first, quotes it
            honestly, and only starts once you say go.
          </p>
        </div>
      </div>
    </section>
  );
}
