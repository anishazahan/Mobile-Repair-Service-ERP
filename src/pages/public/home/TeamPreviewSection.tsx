import { Link } from "react-router-dom";
import { db } from "@/mocks/db";
import { humanizeStatus } from "@/lib/utils";

const TECH_PHOTOS: Record<string, string> = {
  "TECH-01": "https://images.unsplash.com/photo-1560249956-b3731ecf3153?q=80&w=500&auto=format&fit=crop",
  "TECH-02": "https://images.unsplash.com/photo-1699389795119-297f8af9111f?q=80&w=500&auto=format&fit=crop",
  "TECH-03": "https://images.unsplash.com/photo-1705579608984-0d54d6643e57?q=80&w=500&auto=format&fit=crop",
  "TECH-05": "https://images.unsplash.com/photo-1581091224003-01e7c2e69f6f?q=80&w=500&auto=format&fit=crop",
};

export function TeamPreviewSection() {
  const activeTechs = db.technicians.filter((t) => t.status === "active").slice(0, 4);

  return (
    <section className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">Meet the Team</span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          Certified, specialized technicians
        </h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {activeTechs.map((tech) => (
          <div key={tech.id} className="group text-center">
            <div className="overflow-hidden">
              <img
                src={TECH_PHOTOS[tech.id]}
                alt={tech.name}
                className="aspect-[4/5] w-full object-cover grayscale transition-all duration-300 group-hover:grayscale-0"
              />
            </div>
            <h3 className="mt-4 font-semibold text-foreground">{tech.name}</h3>
            <p className="mt-1 text-xs uppercase tracking-wide text-primary">
              {tech.specialties.map((s) => humanizeStatus(s)).join(" · ")}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/team" className="text-sm font-semibold text-primary hover:underline">
          Meet the full team →
        </Link>
      </div>
    </section>
  );
}
