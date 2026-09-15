import { cn } from "@/lib/utils";
import { Wrench } from "lucide-react";

interface LogoProps {
  className?: string;
  theme?: "dark" | "light";
  size?: "sm" | "lg";
  icon?: boolean;
  suffix?: string;
}

const WORDMARK_SIZE = {
  sm: "text-sm font-semibold",
  lg: "text-xl font-extrabold tracking-tight",
};

export function Logo({
  className,
  theme = "dark",
  size = "lg",
  icon = false,
  suffix,
}: LogoProps) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      {icon && (
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Wrench className="h-4 w-4" />
        </span>
      )}
      <span
        className={cn("inline-flex items-baseline gap-1", WORDMARK_SIZE[size])}
      >
        <span className={theme === "light" ? "text-white" : "text-foreground"}>
          Gadget
        </span>
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
