import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const IMAGE_BACK =
  "https://images.unsplash.com/photo-1743836798811-6208a08233c9?q=80&w=900&auto=format&fit=crop";
const IMAGE_FRONT =
  "https://images.unsplash.com/photo-1635501108232-29707bfb7c75?q=80&w=900&auto=format&fit=crop";

export function AboutSection() {
  return (
    <section className="container py-20">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <div className="relative mx-auto w-full max-w-md pb-10 pr-10 sm:pb-14 sm:pr-14">
          <img
            src={IMAGE_BACK}
            alt="Technician working on an opened phone at the repair bench"
            className="h-56 w-full max-w-[280px] object-cover shadow-md sm:h-64"
          />
          <img
            src={IMAGE_FRONT}
            alt="Technician diagnosing a device in the workshop"
            className="absolute bottom-0 right-0 h-56 w-52 border-4 border-background object-cover shadow-lg sm:h-64 sm:w-64"
          />
        </div>

        <div className="space-y-5">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">About Us</span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            First And Foremost, We Are Problem Solvers
          </h2>
          <p className="text-muted-foreground">
            GadgetFIX started as a two-person repair bench in Dhanmondi and grew into a
            full-service repair shop by doing one thing consistently: telling customers the truth
            about what's wrong and fixing it right the first time. Today our certified
            technicians handle everything from cracked screens to board-level water damage.
          </p>
          <Button variant="outline" className="rounded-none px-7 text-[13px] font-semibold uppercase tracking-wider" asChild>
            <Link to="/about">Learn More</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
