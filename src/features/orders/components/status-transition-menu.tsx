import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TRANSITIONS, type TransitionOption } from "@/features/orders/constants";
import type { ServiceOrderStatus } from "@/types";

export function StatusTransitionMenu({
  status,
  onSelect,
}: {
  status: ServiceOrderStatus;
  onSelect: (option: TransitionOption) => void;
}) {
  const options = TRANSITIONS[status];
  if (options.length === 0) return null;

  const primary = options[0];
  const rest = options.slice(1);

  return (
    <div className="flex">
      <Button onClick={() => onSelect(primary)} className="rounded-r-none">
        {primary.label}
      </Button>
      {rest.length > 0 && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="rounded-l-none border-l border-primary-foreground/20 px-2" aria-label="More actions">
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72">
            {rest.map((option) => (
              <DropdownMenuItem
                key={option.action}
                onClick={() => onSelect(option)}
                className={option.destructive ? "text-destructive focus:text-destructive" : undefined}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}
