import { Reveal } from "@/components/motion/reveal";

const BRANDS = ["Apple", "Samsung", "Xiaomi", "Oppo", "Vivo", "Realme"];

export function BrandsStrip() {
  return (
    <section className="border-y border-border bg-background py-10">
      <div className="container">
        <Reveal>
          <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Certified To Repair Every Major Brand
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {BRANDS.map((brand, i) => (
              <span
                key={brand}
                style={{ transitionDelay: `${i * 60}ms` }}
                className="font-serif text-2xl text-foreground/50 transition-colors duration-300 hover:text-primary"
              >
                {brand}
              </span>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
