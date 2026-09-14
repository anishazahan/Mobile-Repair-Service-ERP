import { FacebookIcon, LinkedInIcon } from "@/components/icons/social-icons";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useShopSettings } from "@/features/settings/hooks";
import { SOCIAL_LINKS } from "@/lib/social-links";
import {
  CheckCircle2,
  Loader2,
  Mail,
  MapPin,
  Phone,
  SendHorizontal,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";

const FALLBACK = {
  address: "House 12, Road 5, Dhanmondi, Dhaka",
  email: "hello@gadgetfix.shop",
  phone: "+880 1700-000000",
};

export function PublicFooter() {
  const { data: shop } = useShopSettings();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const contactItems = [
    {
      icon: MapPin,
      label: "Head Office",
      value: shop?.address ?? FALLBACK.address,
    },
    { icon: Mail, label: "Email", value: shop?.email ?? FALLBACK.email },
    { icon: Phone, label: "Phone", value: shop?.phone ?? FALLBACK.phone },
  ];

  const handleSubscribe = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      toast.error("Please provide your email address.");
      return;
    }

    // Basic email validation check
    const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail);
    if (!isValidEmail) {
      toast.error("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      toast.success("Successfully subscribed!", {
        description: "Thank you for joining our newsletter.",
      });

      setEmail("");
      setIsSubscribed(true);
    } catch {
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="border-b border-white/10">
        <div className="container grid gap-6 py-8 sm:grid-cols-3">
          {contactItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary">
                <item.icon className="h-5 w-5" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.label}</p>
                <p className="text-sm text-slate-400">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link to="/">
            <Logo theme="light" icon />
          </Link>
          <p className="max-w-xs text-sm text-slate-400">
            Trusted mobile & tablet repair genuine parts, certified technicians,
            and honest turnaround times, every time.
          </p>
          <div className="flex gap-3">
            <a
              href={SOCIAL_LINKS.facebook}
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary"
            >
              <FacebookIcon className="h-4 w-4" />
            </a>
            <a
              href={SOCIAL_LINKS.linkedin}
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary"
            >
              <LinkedInIcon className="h-4 w-4" />
            </a>
            <a
              href={`mailto:${SOCIAL_LINKS.email}`}
              aria-label="Email"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary"
            >
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Company
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/team" className="hover:text-white">
                Our Team
              </Link>
            </li>
            <li>
              <Link to="/pricing" className="hover:text-white">
                Pricing
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:text-white">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">
            Services
          </h4>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link to="/services" className="hover:text-white">
                Screen Replacement
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white">
                Battery Replacement
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white">
                Water Damage Repair
              </Link>
            </li>
            <li>
              <Link to="/services" className="hover:text-white">
                Software Troubleshooting
              </Link>
            </li>
          </ul>
        </div>

        {/* Improved Subscription Section */}
        <div className="space-y-3.5">
          <h4 className="text-sm font-semibold uppercase tracking-wide text-white">
            Newsletter
          </h4>
          <p className="text-sm leading-relaxed text-slate-400">
            Get gadget maintenance tips, repair discounts, and service updates
            straight to your inbox.
          </p>

          {isSubscribed ? (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm text-emerald-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>You are subscribed to our updates!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative flex items-center">
                <Mail className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  disabled={isSubmitting}
                  className="h-11 rounded-lg border-white/10 bg-white/[0.06] pl-10 pr-28 text-sm text-white placeholder:text-slate-500 focus-visible:border-primary focus-visible:ring-1 focus-visible:ring-primary focus-visible:ring-offset-0 disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isSubmitting}
                  className="absolute right-1.5 h-8 gap-1.5 rounded-md px-3 text-xs font-semibold uppercase tracking-wider"
                >
                  {isSubmitting ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <>
                      Join
                      <SendHorizontal className="h-3 w-3" />
                    </>
                  )}
                </Button>
              </div>
              <p className="text-[11px] text-slate-500">
                No spam. Unsubscribe at any time.
              </p>
            </form>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container flex flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <p>
            © {new Date().getFullYear()} GadgetFIX. All rights reserved By{" "}
            <span className="font-bold text-primary">Anisha Zahan</span>
          </p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">
              Legal
            </a>
            <a href="#" className="hover:text-white">
              GDPR
            </a>
            <a href="#" className="hover:text-white">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
