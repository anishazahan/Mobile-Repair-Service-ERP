import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { db } from "@/mocks/db";
import { humanizeStatus } from "@/lib/utils";

// All-male technician photography for a consistent look across the two
// featured spots in this composition (back/top and front/bottom). Features
// Ahmed Karim and Mizanur Rahman specifically so the photo matches the name.
const TECH_PHOTOS: Record<string, string> = {
  "TECH-01": "https://images.unsplash.com/photo-1560249956-b3731ecf3153?q=85&w=1200&auto=format&fit=crop",
  "TECH-02": "https://images.unsplash.com/photo-1699389795119-297f8af9111f?q=85&w=1200&auto=format&fit=crop",
};

export function TeamPreviewSection() {
  const featured = db.technicians.filter((t) => ["TECH-01", "TECH-02"].includes(t.id));

  return (
    <section className="container py-20">
      <div className="grid items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
        <Reveal direction="left" className="relative mx-auto h-[420px] w-full max-w-lg sm:h-[500px] lg:h-[600px] lg:max-w-none">
          {/* Back photo — top-left, caption pinned to its own top edge so the
              front photo overlapping its lower-right can never cover it. */}
          <figure className="group absolute left-0 top-0 h-[68%] w-[68%] overflow-hidden border-4 border-primary shadow-md">
            <img
              src={TECH_PHOTOS["TECH-01"]}
              alt={featured[0]?.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent p-4">
              <figcaption>
                <p className="text-sm font-bold text-white">{featured[0]?.name}</p>
                <p className="text-xs text-white/80">{humanizeStatus(featured[0]?.specialties[0] ?? "")} Specialist</p>
              </figcaption>
            </div>
          </figure>

          {/* Front photo — bottom-right, higher stacking order, caption
              pinned to its own bottom edge. Always fully visible since
              nothing renders above it. */}
          <figure className="group absolute bottom-0 right-0 z-10 h-[68%] w-[68%] overflow-hidden border-4 border-primary shadow-xl">
            <img
              src={TECH_PHOTOS["TECH-02"]}
              alt={featured[1]?.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4">
              <figcaption>
                <p className="text-sm font-bold text-white">{featured[1]?.name}</p>
                <p className="text-xs text-white/80">{humanizeStatus(featured[1]?.specialties[0] ?? "")} Specialist</p>
              </figcaption>
            </div>
          </figure>
        </Reveal>

        <Reveal direction="right" delay={100} className="space-y-5">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">Our Team</span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Meet The Team</h2>
          <p className="text-muted-foreground">
            Every technician on the floor is certified across the major device brands, and every
            job is double-checked before it goes back out the door — that's who's actually
            working on your device.
          </p>
          <Button className="rounded-none px-7 text-[13px] font-semibold uppercase tracking-wider" asChild>
            <Link to="/team">See All Team</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
