import { Facebook, Instagram, Mail, MapPin, Phone, Wrench, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

export function PublicFooter() {
  return (
    <footer className="border-t border-border bg-slate-950 text-slate-300">
      <div className="container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Wrench className="h-5 w-5" />
            </div>
            <span className="text-lg font-bold text-white">GadgetFIX</span>
          </Link>
          <p className="max-w-xs text-sm text-slate-400">
            Trusted mobile & tablet repair — genuine parts, certified technicians, and honest
            turnaround times, every time.
          </p>
          <div className="flex gap-3">
            {[Facebook, Instagram, Youtube].map((Icon, i) => (
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
          <h4 className="mb-4 text-sm font-semibold text-white">Company</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/about" className="hover:text-white">About Us</Link></li>
            <li><Link to="/team" className="hover:text-white">Our Team</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-white">Services</h4>
          <ul className="space-y-2.5 text-sm">
            <li><Link to="/services" className="hover:text-white">Screen Replacement</Link></li>
            <li><Link to="/services" className="hover:text-white">Battery Replacement</Link></li>
            <li><Link to="/services" className="hover:text-white">Water Damage Repair</Link></li>
            <li><Link to="/services" className="hover:text-white">Software Troubleshooting</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-sm font-semibold text-white">Get in Touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              House 12, Road 5, Dhanmondi, Dhaka
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-primary" /> +880 1700-000000
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="h-4 w-4 shrink-0 text-primary" /> hello@gadgetfix.shop
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-slate-500 sm:flex-row">
          <p>© {new Date().getFullYear()} GadgetFIX. All rights reserved.</p>
          <p>Built as a frontend ERP prototype for a Developer Hiring Assessment.</p>
        </div>
      </div>
    </footer>
  );
}
