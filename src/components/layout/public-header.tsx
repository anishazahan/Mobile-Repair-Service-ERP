import { Menu, Phone, Wrench } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Pricing", to: "/pricing" },
  { label: "About", to: "/about" },
  { label: "Team", to: "/team" },
  { label: "Contact", to: "/contact" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Wrench className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">GadgetFIX</span>
        </NavLink>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === "/"}
              className={({ isActive }) =>
                cn(
                  "rounded-md px-3.5 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-primary" : "text-foreground/70 hover:text-foreground",
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <a href="tel:+8801700000000" className="flex items-center gap-1.5 text-sm font-medium text-foreground/80">
            <Phone className="h-4 w-4" /> +880 1700-000000
          </a>
          <Button variant="ghost" asChild>
            <NavLink to="/login">Staff Login</NavLink>
          </Button>
          <Button asChild>
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
              <SheetTitle>GadgetFIX</SheetTitle>
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
                      "rounded-md px-3 py-2.5 text-sm font-medium",
                      isActive ? "bg-accent text-primary" : "text-foreground/80 hover:bg-accent",
                    )
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
                <Button variant="outline" asChild>
                  <NavLink to="/login" onClick={() => setOpen(false)}>
                    Staff Login
                  </NavLink>
                </Button>
                <Button asChild>
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
