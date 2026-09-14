import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export function CtaSection() {
  return (
    <section className="container pb-20">
      <Reveal className="relative overflow-hidden bg-primary px-8 py-14 text-center text-primary-foreground sm:px-16">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 30% 20%, white, transparent 45%)",
          }}
        />
        <div className="relative space-y-5">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to get your device fixed?
          </h2>
          <p className="mx-auto max-w-xl text-primary-foreground/90">
            Book online in under a minute, or walk in for a free diagnosis
            either way, you'll know the cost before we touch your device.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-none text-[13px] font-semibold uppercase tracking-wider"
              asChild
            >
              <Link to="/book-a-service">
                Book a Service <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="rounded-none border-white/30 bg-transparent text-[13px] font-semibold uppercase tracking-wider text-white hover:bg-white/10 hover:text-white"
              asChild
            >
              <Link to="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
