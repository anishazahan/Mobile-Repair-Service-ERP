import { Link } from "react-router-dom";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { db } from "@/mocks/db";
import { humanizeStatus } from "@/lib/utils";

function initials(name: string) {
  return name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase();
}

export function TeamPreviewSection() {
  const activeTechs = db.technicians.filter((t) => t.status === "active").slice(0, 4);

  return (
    <section className="container py-20">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-sm font-semibold uppercase tracking-wider text-primary">Meet the Team</span>
        <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Certified, specialized technicians</h2>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {activeTechs.map((tech) => (
          <div key={tech.id} className="rounded-md border border-border p-6 text-center">
            <Avatar className="mx-auto h-16 w-16">
              <AvatarFallback className="text-lg">{initials(tech.name)}</AvatarFallback>
            </Avatar>
            <h3 className="mt-4 font-semibold text-foreground">{tech.name}</h3>
            <p className="mt-1 text-xs text-muted-foreground">
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
