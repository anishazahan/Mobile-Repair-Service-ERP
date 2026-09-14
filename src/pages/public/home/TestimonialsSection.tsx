import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Quote,
  ShieldCheck,
  Smartphone,
  Star,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  device: string;
  rating: number;
  quote: string;
  reviewUrl: string;
  source: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: "Rakib Hasan",
    role: "Verified Customer",
    avatar:
      "https://images.unsplash.com/photo-1579803270109-987eda7479be?q=80&w=600&auto=format&fit=crop",
    device: "iPhone 14 Pro Max &bull; OLED Screen Fix",
    rating: 5,
    quote:
      "Cracked my screen the night before an urgent business trip. GadgetFIX replaced it with an OEM panel in under 90 minutes. True Tone and Face ID were calibrated perfectly.",
    reviewUrl: "https://maps.google.com",
    source: "Google Review",
  },
  {
    name: "Farzana Rahman",
    role: "Verified Customer",
    avatar:
      "https://images.unsplash.com/photo-1735875530804-d661ca2001da?q=80&w=600&auto=format&fit=crop",
    device: "Samsung Galaxy S22 Ultra &bull; Motherboard Repair",
    rating: 5,
    quote:
      "My phone suddenly blacked out and wouldn't charge. Other shops told me to buy a new phone, but their technicians diagnosed a shorted IC and revived it with zero data loss.",
    reviewUrl: "https://trustpilot.com",
    source: "Trustpilot",
  },
  {
    name: "Imran Chowdhury",
    role: "Verified Customer",
    avatar:
      "https://images.unsplash.com/photo-1769763227060-726b7b926bf2?q=80&w=600&auto=format&fit=crop",
    device: "iPad Pro 11-inch &bull; Liquid Damage Recovery",
    rating: 5,
    quote:
      "Spilled coffee directly onto my charging port and internal logic board. They conducted an ultrasonic cleaning, replaced the corroded pins, and had it running solid the next day.",
    reviewUrl: "https://maps.google.com",
    source: "Google Review",
  },
  {
    name: "Nusrat Jahan",
    role: "Verified Customer",
    avatar:
      "https://images.unsplash.com/photo-1752993018672-bb0f25f528bc?q=80&w=600&auto=format&fit=crop",
    device: "Google Pixel 7 &bull; Battery & Port Replacement",
    rating: 5,
    quote:
      "Battery health was down to 68% and shutting down randomly at noon. Fast genuine replacement with an official 6-month warranty card included. Top-tier professional shop.",
    reviewUrl: "https://maps.google.com",
    source: "Google Review",
  },
];

export function TestimonialsSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS.length);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex(
      (prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length,
    );
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(handleNext, 6000);
    return () => clearInterval(interval);
  }, [handleNext, isPaused]);

  const current = TESTIMONIALS[activeIndex];

  return (
    <section
      className="bg-white py-14 lg:py-16"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container">
        {/* Section Header — heading left, trust/rating block right */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <Reveal direction="left">
            <span className="text-sm font-semibold uppercase tracking-wider text-primary">
              Customer Feedback
            </span>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
              What Our Customers Say
            </h2>
            <p className="mt-3 max-w-md text-sm text-slate-600">
              Real feedback from device owners who trusted our repair center
              with their hardware.
            </p>
          </Reveal>

          <Reveal
            direction="right"
            delay={120}
            className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5 lg:justify-end"
          >
            <div className="flex -space-x-3">
              {TESTIMONIALS.map((t) => (
                <img
                  key={t.name}
                  src={t.avatar}
                  alt={t.name}
                  className="h-11 w-11 border-2 border-white object-cover shadow-sm"
                />
              ))}
            </div>
            <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
              <div className="flex text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>
              <div>
                <p className="text-lg font-bold leading-none text-slate-950">
                  4.9/5
                </p>
                <p className="text-xs text-slate-500">
                  From 500+ verified reviews
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        {/* 2-Column Split Slider Card */}
        <div className="mx-auto mt-10 max-w-5xl overflow-hidden border border-slate-200 bg-white shadow-sm transition-all">
          <div className="grid items-stretch lg:grid-cols-[1.25fr_1fr]">
            {/* Left Column: Testimonial Details */}
            <div className="flex flex-col justify-between p-6 sm:p-10">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 text-amber-500">
                    {Array.from({ length: current.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-500" />
                    ))}
                  </div>
                  <span className="inline-flex items-center gap-1 border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                    <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                    {current.source}
                  </span>
                </div>

                <div className="relative mt-6">
                  <Quote className="pointer-events-none absolute -left-2 -top-4 h-10 w-10 text-slate-100" />
                  {/* Fixed min-height keeps layout smooth across slides */}
                  <div className="flex min-h-[5.5rem] items-center">
                    <p className="relative text-base font-medium leading-relaxed text-slate-800 sm:text-lg">
                      "{current.quote}"
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {current.name}
                  </h3>
                  <p
                    className="text-xs text-slate-500"
                    dangerouslySetInnerHTML={{ __html: current.device }}
                  />
                </div>

                <a
                  href={current.reviewUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:border-primary hover:bg-primary/5"
                >
                  <span>Verified Review</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Right Column: Aspect-Constrained Image Container */}
            <div className="relative min-h-[260px] max-h-[360px] border-t border-slate-100 lg:border-l lg:border-t-0">
              <img
                src={current.avatar}
                alt={current.name}
                className="h-full w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Device chip — ties the photo back to the specific repair */}
              <div className="absolute left-5 top-4 inline-flex items-center gap-1.5 border border-white/20 bg-black/40 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm">
                <Smartphone className="h-3.5 w-3.5" />
                <span dangerouslySetInnerHTML={{ __html: current.device }} />
              </div>

              {/* Slide Controls & Dots inside Image */}
              <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between">
                <div className="flex gap-1.5">
                  {TESTIMONIALS.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveIndex(idx)}
                      aria-label={`Go to slide ${idx + 1}`}
                      className={`h-1.5 transition-all ${
                        idx === activeIndex
                          ? "w-6 bg-white"
                          : "w-2 bg-white/40 hover:bg-white/70"
                      }`}
                    />
                  ))}
                </div>

                <div className="flex gap-1.5">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handlePrev}
                    aria-label="Previous review"
                    className="h-8 w-8 rounded-none border-white/20 bg-black/40 text-white backdrop-blur-sm hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleNext}
                    aria-label="Next review"
                    className="h-8 w-8 rounded-none border-white/20 bg-black/40 text-white backdrop-blur-sm hover:border-primary hover:bg-primary hover:text-white"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Pills */}
        <div className="mx-auto mt-6 flex max-w-5xl flex-wrap justify-center gap-2 sm:gap-3">
          {TESTIMONIALS.map((t, idx) => (
            <button
              key={t.name}
              onClick={() => setActiveIndex(idx)}
              className={`flex items-center gap-2.5 border px-3.5 py-1.5 text-left transition-all ${
                idx === activeIndex
                  ? "border-primary bg-primary/5 ring-1 ring-primary/30"
                  : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              <img
                src={t.avatar}
                alt={t.name}
                className="h-6 w-6 object-cover"
              />
              <span className="text-xs font-semibold text-slate-800">
                {t.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
