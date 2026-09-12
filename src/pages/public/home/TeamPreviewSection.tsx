import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { db } from "@/mocks/db";
import { humanizeStatus } from "@/lib/utils";

const TECH_PHOTOS: Record<string, string> = {
  "TECH-01": "https://images.unsplash.com/photo-1560249956-b3731ecf3153?q=85&w=900&auto=format&fit=crop",
  "TECH-03": "https://images.unsplash.com/photo-1705579608984-0d54d6643e57?q=85&w=900&auto=format&fit=crop",
};

export function TeamPreviewSection() {
  const featured = db.technicians.filter((t) => ["TECH-01", "TECH-03"].includes(t.id));

  return (
    <section className="container py-20">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <Reveal direction="left" className="relative mx-auto w-full max-w-md pb-16 pr-10 sm:pb-20 sm:pr-16">
          {featured.map((tech, i) => (
            <figure
              key={tech.id}
              className={
                i === 0
                  ? "relative w-4/5"
                  : "absolute bottom-0 right-0 w-4/5 border-4 border-background shadow-lg"
              }
            >
              <img
                src={TECH_PHOTOS[tech.id]}
                alt={tech.name}
                className="aspect-[4/5] w-full object-cover"
              />
              <figcaption className="absolute -bottom-6 left-4 bg-background px-4 py-3 shadow-md">
                <p className="text-sm font-bold text-foreground">{tech.name}</p>
                <p className="text-xs text-muted-foreground">{humanizeStatus(tech.specialties[0])} Specialist</p>
              </figcaption>
            </figure>
          ))}
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
