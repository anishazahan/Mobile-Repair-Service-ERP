import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    name: "Rakib Hasan",
    device: "iPhone 13 Pro",
    quote:
      "Cracked my screen the night before a flight — they had it fixed in under two hours with a genuine part. Couldn't ask for better service.",
  },
  {
    name: "Farzana Rahman",
    device: "Samsung Galaxy S21",
    quote:
      "Really appreciated that they called before doing anything and explained exactly what was wrong and what it would cost. No surprises at pickup.",
  },
  {
    name: "Imran Chowdhury",
    device: "iPad Air",
    quote:
      "My tablet had water damage and I thought it was gone for good. GadgetFIX recovered it completely and it's been working perfectly for months.",
  },
];

export function TestimonialsSection() {
  return (
    <section className="bg-muted/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Testimonials</span>
          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">What our customers say</h2>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <Card key={t.name}>
              <CardContent className="p-6">
                <div className="flex gap-0.5 text-warning">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-sm text-foreground">"{t.quote}"</p>
                <div className="mt-5 border-t border-border pt-4">
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.device} · Verified Customer</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
