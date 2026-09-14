import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const IMAGE_BACK =
  "https://images.unsplash.com/photo-1611396000732-f8c9a933424f?q=85&w=1200&auto=format&fit=crop";
const IMAGE_FRONT =
  "https://images.unsplash.com/photo-1539331586018-346b53b2aaa4?q=85&w=1000&auto=format&fit=crop";

export function AboutSection() {
  return (
    <section className="container py-20">
      <div className="grid items-center gap-16 lg:grid-cols-2">
        <Reveal direction="left" className="relative w-full pb-12 pr-12 sm:pb-16 sm:pr-16">
          <img
            src={IMAGE_BACK}
            alt="Disassembled phone parts laid out on the repair bench"
            className="aspect-[4/3] w-[82%] object-cover shadow-md transition-transform duration-500 hover:scale-[1.03]"
          />
          <img
            src={IMAGE_FRONT}
            alt="Technician's gloved hands repairing a phone screen"
            className="absolute bottom-0 right-0 aspect-[4/5] w-[62%] border-4 border-background object-cover shadow-lg transition-transform duration-500 hover:scale-[1.03]"
          />
        </Reveal>

        <Reveal direction="right" delay={120} className="space-y-5">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            About Us
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            First And Foremost, We Are Problem Solvers
          </h2>
          <p className="text-muted-foreground">
            GadgetFIX started as a two-person repair bench in Dhanmondi and grew
            into a full-service repair shop by doing one thing consistently:
            telling customers the truth about what's wrong and fixing it right
            the first time. Today our certified technicians handle everything
            from cracked screens to board-level water damage.
          </p>
          <Button
            variant="outline"
            className="rounded-none px-7 h-12 lg:h-13 hover:bg-primary text-[13px] font-semibold uppercase tracking-wider"
            asChild
          >
            <Link to="/about">Learn More</Link>
          </Button>
        </Reveal>
      </div>
    </section>
  );
}
