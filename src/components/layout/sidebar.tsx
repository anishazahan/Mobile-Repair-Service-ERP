import { Logo } from "@/components/layout/logo";
import { useAuthStore } from "@/features/auth/store";
import { cn } from "@/lib/utils";
import { Link, NavLink } from "react-router-dom";
import { isNavItemVisible, NAV_GROUPS } from "./nav-config";

/** Persistent ERP navigation — filtered per the signed-in user's role. */
export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const role = useAuthStore((s) => s.user?.role);

  return (
    <div className="flex h-full w-64 flex-col bg-sidebar text-sidebar-foreground">
      <div className="flex h-14 items-center border-b border-sidebar-border px-5">
        <Link to="/" onClick={onNavigate}>
          <Logo theme="light" size="sm" icon />
        </Link>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-4 no-scrollbar">
        {NAV_GROUPS.map((group, i) => {
          const items = role
            ? group.items.filter((item) => isNavItemVisible(item, role))
            : group.items;
          if (items.length === 0) return null;
          return (
            <div key={group.label ?? i}>
              {group.label && (
                <p className="mb-1.5 px-3 text-[11px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                  {group.label}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/app"}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-accent-foreground",
                      )
                    }
                  >
                    <item.icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
