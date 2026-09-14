import { Reveal } from "@/components/motion/reveal";

const BRANDS = [
  {
    name: "Apple",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
    className: "h-6 sm:h-7",
  },
  {
    name: "Samsung",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
    className: "h-4 sm:h-5",
  },
  {
    name: "Xiaomi",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/ae/Xiaomi_logo_%282021-%29.svg",
    className: "h-6 sm:h-7",
  },
  {
    name: "Oppo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/b/b8/OPPO_Logo.svg",
    className: "h-4 sm:h-5",
  },
  {
    name: "Vivo",
    logo: "https://upload.wikimedia.org/wikipedia/commons/e/e5/Vivo_mobile_logo.png",
    className: "h-5 sm:h-6",
  },
  {
    name: "Realme",
    logo: "https://upload.wikimedia.org/wikipedia/commons/a/a2/Realme_logo.svg",
    className: "h-4 sm:h-5",
  },
  {
    name: "Google Pixel",
    logo: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg",
    className: "h-5 sm:h-6",
  },
  {
    name: "OnePlus",
    logo: "https://upload.wikimedia.org/wikipedia/commons/f/f8/OP_LU_Reg_1L_RGB_red_pos.png",
    className: "h-5 sm:h-6",
  },
];

export function BrandsStrip() {
  return (
    <section className="border-y border-slate-100 bg-white py-10 lg:py-12">
      <div className="container max-w-6xl">
        <Reveal>
          {/* Subheading Badge */}
          <div className="text-center">
            <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400 sm:text-xs">
              Certified To Repair Every Major Brand
            </span>
          </div>

          {/* Logos Grid / Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 sm:gap-x-14 sm:gap-y-8">
            {BRANDS.map((brand, i) => (
              <div
                key={brand.name}
                style={{ transitionDelay: `${i * 40}ms` }}
                className="group relative flex items-center justify-center px-2 py-1 transition-transform duration-300 hover:-translate-y-0.5"
                title={`${brand.name} Authorized Repair Support`}
              >
                <img
                  src={brand.logo}
                  alt={`${brand.name} logo`}
                  className={`${brand.className} w-auto max-w-[110px] object-contain opacity-45 grayscale transition-all duration-300 group-hover:opacity-100 group-hover:grayscale-0`}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
