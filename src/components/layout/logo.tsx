import { Wrench } from "lucide-react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  /** "light" for dark backgrounds (footer, ERP sidebar) — keeps "Gadget" readable. */
  theme?: "dark" | "light";
  /** "sm" for compact chrome like the ERP sidebar; "lg" (default) for the public site header/footer. */
  size?: "sm" | "lg";
  /** Shows the small icon mark before the wordmark — used in the ERP sidebar. */
  icon?: boolean;
  /** Optional trailing label, e.g. "ERP". */
  suffix?: string;
}

const WORDMARK_SIZE = {
  sm: "text-sm font-semibold",
  lg: "text-xl font-extrabold tracking-tight",
};

/** The GadgetFIX wordmark — single source of the brand mark, used by the public header, public footer, and the ERP sidebar. */
export function Logo({ className, theme = "dark", size = "lg", icon = false, suffix }: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {icon && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Wrench className="h-4 w-4" />
        </span>
      )}
      <span className={cn("inline-flex items-baseline gap-1", WORDMARK_SIZE[size])}>
        <span className={theme === "light" ? "text-white" : "text-foreground"}>Gadget</span>
        <span className="text-primary">FIX</span>
        {suffix && (
          <span
            className={cn(
              "ml-1 text-xs font-semibold uppercase tracking-wider",
              theme === "light" ? "text-white/60" : "text-muted-foreground",
            )}
          >
            {suffix}
          </span>
        )}
      </span>
    </span>
  );
}
