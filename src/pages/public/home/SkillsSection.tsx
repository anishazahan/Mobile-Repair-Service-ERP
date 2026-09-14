import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

const SKILLS = [
  {
    title: "Diagnostics",
    description:
      "Every repair starts with a free, no-obligation inspection so you know exactly what's wrong before you commit to anything.",
  },
  {
    title: "Replacement",
    description:
      "Screens, batteries, cameras and ports are swapped using genuine or OEM-grade parts, backed by a real warranty.",
  },
  {
    title: "Device Repair",
    description:
      "From water damage to board-level faults, our senior technicians handle the repairs other shops turn away.",
  },
];

export function SkillsSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="container py-20">
      <div className="grid items-start gap-16 lg:grid-cols-2">
        <Reveal direction="left" className="space-y-5">
          <span className="text-sm font-semibold uppercase tracking-wider text-primary">
            Our Skills & Expertise
          </span>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            We Specialize In Quick And Professional Repairs
          </h2>
          <p className="text-muted-foreground">
            Every technician on our floor is trained across the major brands and
            repair categories below, so whatever walks through the door, someone
            on shift can handle it the same day.
          </p>
          <Button
            className="rounded-none px-7 h-14 text-[13px] font-semibold uppercase tracking-wider"
            asChild
          >
            <Link to="/book-a-service">Make Appointment</Link>
          </Button>
        </Reveal>

        <Reveal
          direction="right"
          delay={120}
          className="divide-y divide-border border-y border-border"
        >
          {SKILLS.map((skill, i) => {
            const isOpen = openIndex === i;
            return (
              <div key={skill.title}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between py-5 text-left"
                >
                  <span
                    className={cn(
                      "text-base font-semibold transition-colors",
                      isOpen ? "text-primary" : "text-foreground",
                    )}
                  >
                    {skill.title}
                  </span>
                  <Plus
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300",
                      isOpen && "rotate-45 text-primary",
                    )}
                  />
                </button>
                <div
                  className="grid transition-[grid-template-rows] duration-300 ease-out"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <p className="overflow-hidden pb-5 text-sm text-muted-foreground">
                    {skill.description}
                  </p>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
