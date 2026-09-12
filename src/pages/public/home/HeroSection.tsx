import { CheckCircle2, PhoneCall, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const TRUST_POINTS = ["Genuine parts only", "90-day repair warranty", "Same-day service available"];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-slate-950 text-white">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, rgba(37,99,235,0.45), transparent 45%), radial-gradient(circle at 85% 0%, rgba(14,165,233,0.35), transparent 40%)",
        }}
      />
      <div className="container relative grid gap-12 py-20 lg:grid-cols-2 lg:items-center lg:py-28">
        <div className="space-y-7">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-200">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" /> Dhaka's most trusted mobile repair shop
          </span>
          <h1 className="text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl">
            Expert repairs for every phone, tablet & wearable.
          </h1>
          <p className="max-w-lg text-lg text-slate-300">
            From cracked screens to water damage, our certified technicians diagnose the issue
            for free and get you back up and running — usually the same day.
          </p>

          <div className="flex flex-wrap gap-3">
            <Button size="lg" asChild>
              <Link to="/book-a-service">Book a Service</Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white" asChild>
              <a href="tel:+8801700000000">
                <PhoneCall /> Call Us Now
              </a>
            </Button>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
            {TRUST_POINTS.map((point) => (
              <li key={point} className="flex items-center gap-1.5 text-sm text-slate-300">
                <CheckCircle2 className="h-4 w-4 text-primary" /> {point}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative mx-auto w-full max-w-md">
          <div className="absolute -inset-6 rounded-[2rem] bg-primary/20 blur-3xl" aria-hidden="true" />
          <div className="relative space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">Live Repair Status</span>
              <span className="rounded-full bg-warning/20 px-2.5 py-0.5 text-xs font-medium text-warning">
                In Repair
              </span>
            </div>
            <div className="space-y-3 rounded-xl bg-white/5 p-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Order</span>
                <span className="font-medium text-white">SO-1004</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Device</span>
                <span className="font-medium text-white">iPhone 12</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Technician</span>
                <span className="font-medium text-white">Mizanur Rahman</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-2/3 rounded-full bg-primary" />
              </div>
              <p className="text-xs text-slate-400">Screen & battery replacement — 2 of 3 steps complete</p>
            </div>
            <p className="text-center text-xs text-slate-400">
              Every repair is tracked end-to-end on our internal ERP system
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
