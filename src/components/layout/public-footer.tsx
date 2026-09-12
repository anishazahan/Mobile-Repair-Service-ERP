import { Camera, Mail, MapPin, MessageCircle, Phone, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CONTACT_ITEMS = [
  { icon: MapPin, label: "Head Office", value: "House 12, Road 5, Dhanmondi, Dhaka" },
  { icon: Mail, label: "Email", value: "hello@gadgetfix.shop" },
  { icon: Phone, label: "Phone", value: "+880 1700-000000" },
];

export function PublicFooter() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="border-b border-white/10">
        <div className="container grid gap-6 py-8 sm:grid-cols-3">
          {CONTACT_ITEMS.map((item) => (
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
          <Link to="/" className="text-xl font-extrabold tracking-tight">
            <span className="text-white">Gadget</span>
            <span className="text-primary">FIX</span>
          </Link>
          <p className="max-w-xs text-sm text-slate-400">
            Trusted mobile & tablet repair — genuine parts, certified technicians, and honest
            turnaround times, every time.
          </p>
          <div className="flex gap-3">
            {[MessageCircle, Camera, Video].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-primary"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/team" className="hover:text-white">Our Team</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Services</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/services" className="hover:text-white">Screen Replacement</Link></li>
            <li><Link to="/services" className="hover:text-white">Battery Replacement</Link></li>
            <li><Link to="/services" className="hover:text-white">Water Damage Repair</Link></li>
            <li><Link to="/services" className="hover:text-white">Software Troubleshooting</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold uppercase tracking-wide text-white">Newsletter</h4>
          <p className="mb-3 text-sm text-slate-400">Get repair tips and shop offers in your inbox.</p>
          <form className="flex" onSubmit={(e) => e.preventDefault()}>
            <Input
              type="email"
              placeholder="Email"
              className="rounded-none border-white/20 bg-white/5 text-white placeholder:text-slate-500 focus-visible:ring-primary"
            />
            <Button type="submit" className="shrink-0 rounded-none px-4 text-[13px] font-semibold uppercase tracking-wider">
              Subscribe
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} GadgetFIX. All rights reserved.</p>
          <div className="flex gap-5">
            <a href="#" className="hover:text-white">Legal</a>
            <a href="#" className="hover:text-white">GDPR</a>
            <a href="#" className="hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
