import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay in ms — pass index * 80 for grid/list items. */
  delay?: number;
  /** Direction/style the content animates in with. */
  direction?: "up" | "down" | "left" | "right" | "zoom" | "none";
  /** Animation duration in ms. Defaults to a premium, slightly slow 900ms. */
  duration?: number;
}

const DIRECTION_START: Record<NonNullable<RevealProps["direction"]>, string> = {
  up: "translate-y-10",
  down: "-translate-y-10",
  left: "-translate-x-12",
  right: "translate-x-12",
  zoom: "scale-90",
  none: "",
};

/**
 * Scroll-triggered entrance animation used across every public-site section.
 * Animates once when the element first enters the viewport using a premium
 * "ease-out-expo" curve (fast start, long soft settle) rather than a linear
 * fade — combines opacity with a directional translate or scale. No-ops for
 * prefers-reduced-motion.
 */
export function Reveal({ children, className, delay = 0, direction = "up", duration = 900 }: RevealProps) {
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
      { threshold: 0.15, rootMargin: "0px 0px -60px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn(
        "transition-all motion-reduce:transition-none motion-reduce:transform-none motion-reduce:opacity-100",
        visible ? "opacity-100 translate-x-0 translate-y-0 scale-100" : cn("opacity-0", DIRECTION_START[direction]),
        className,
      )}
      style={{
        transitionDuration: `${duration}ms`,
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        transitionDelay: visible ? `${delay}ms` : "0ms",
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}
