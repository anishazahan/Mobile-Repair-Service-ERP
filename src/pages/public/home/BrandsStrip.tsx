const BRANDS = ["Apple", "Samsung", "Xiaomi", "Oppo", "Vivo", "Realme"];

export function BrandsStrip() {
  return (
    <section className="border-y border-border bg-background py-10">
      <div className="container">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Certified To Repair Every Major Brand
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
          {BRANDS.map((brand) => (
            <span key={brand} className="font-serif text-2xl text-foreground/60">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
