import { Clock, Mail, Menu, Search } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { FacebookIcon, LinkedInIcon } from "@/components/icons/social-icons";
import { Logo } from "@/components/layout/logo";
import { SOCIAL_LINKS } from "@/lib/social-links";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Team", to: "/team" },
  { label: "Contact", to: "/contact" },
];

function TopUtilityBar() {
  return (
    <div className="hidden bg-primary text-primary-foreground sm:block">
      <div className="container flex h-10 items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 font-medium">
          <Clock className="h-3.5 w-3.5" /> We're Open: Mon – Sat 8:00 – 18:00
        </span>
        <div className="flex items-center gap-4">
          <a
            href={SOCIAL_LINKS.facebook}
            target="_blank"
            rel="noreferrer"
            aria-label="Facebook"
            className="opacity-90 transition-opacity hover:opacity-100"
          >
            <FacebookIcon className="h-3.5 w-3.5" />
          </a>
          <a
            href={SOCIAL_LINKS.linkedin}
            target="_blank"
            rel="noreferrer"
            aria-label="LinkedIn"
            className="opacity-90 transition-opacity hover:opacity-100"
          >
            <LinkedInIcon className="h-3.5 w-3.5" />
          </a>
          <a href={`mailto:${SOCIAL_LINKS.email}`} aria-label="Email" className="opacity-90 transition-opacity hover:opacity-100">
            <Mail className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-background shadow-sm">
      <TopUtilityBar />
      <div className="container flex h-[72px] items-center justify-between">
        <NavLink to="/">
          <Logo icon />
        </NavLink>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "text-[13px] font-semibold uppercase tracking-wider transition-colors",
                  isActive ? "text-primary" : "text-foreground/80 hover:text-primary",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <button aria-label="Search" className="text-foreground/70 transition-colors hover:text-primary">
            <Search className="h-[18px] w-[18px]" />
          </button>
          <NavLink
            to="/login"
            className="text-[13px] font-semibold uppercase tracking-wider text-foreground/70 hover:text-primary"
          >
            Staff Login
          </NavLink>
          <Button className="rounded-none px-6 text-[13px] font-semibold uppercase tracking-wider" asChild>
            <NavLink to="/book-a-service">Book a Service</NavLink>
          </Button>
        </div>

        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72">
            <SheetHeader>
              <SheetTitle asChild>
                <Logo icon />
              </SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1 p-4">
              {NAV_LINKS.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "rounded-sm px-3 py-2.5 text-sm font-semibold uppercase tracking-wide",
                      isActive ? "bg-accent text-primary" : "text-foreground/80 hover:bg-accent",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                <Button variant="outline" className="rounded-none" asChild>
                  <NavLink to="/login" onClick={() => setOpen(false)}>
                    Staff Login
                  </NavLink>
                </Button>
                <Button className="rounded-none" asChild>
                  <NavLink to="/book-a-service" onClick={() => setOpen(false)}>
                    Book a Service
                  </NavLink>
                </Button>
              </div>
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
