import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  /** Target number to count up to, e.g. 12000. */
  value: number;
  /** Text shown after the number, e.g. "+" or "%". */
  suffix?: string;
  /** Text shown before the number, e.g. "৳". */
  prefix?: string;
  duration?: number;
  className?: string;
}

/**
 * Animates a number counting up from 0 to `value` once it scrolls into view.
 * Used for headline stats (years experience, devices repaired, etc.) so the
 * numbers feel alive rather than just appearing.
 */
export function CountUp({ value, suffix = "", prefix = "", duration = 1400, className }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      setDisplay(value);
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      setDisplay(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const startTime = performance.now();
          const tick = (now: number) => {
            const progress = Math.min((now - startTime) / duration, 1);
            // ease-out-quart for a fast-start, gentle-settle count
            const eased = 1 - (1 - progress) ** 4;
            setDisplay(Math.round(eased * value));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          observer.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
