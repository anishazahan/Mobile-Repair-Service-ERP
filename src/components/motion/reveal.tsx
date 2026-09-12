import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms — pass index * 80 for grid/list items. */
  delay?: number;
  /** Direction the content animates in from. */
  direction?: "up" | "left" | "right" | "none";
}

const DIRECTION_OFFSET: Record<NonNullable<RevealProps["direction"]>, string> = {
  up: "translate-y-6",
  left: "-translate-x-6",
  right: "translate-x-6",
  none: "",
};

/**
 * Scroll-triggered fade/slide-in wrapper used across every public-site
 * section. Animates once when the element first enters the viewport, and
 * is a no-op (content just renders, no motion) for prefers-reduced-motion.
 */
export function Reveal({ children, className, delay = 0, direction = "up" }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:transform-none",
        visible ? "opacity-100 translate-x-0 translate-y-0" : cn("opacity-0", DIRECTION_OFFSET[direction]),
        className,
      )}
      style={{ transitionDelay: visible ? `${delay}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
