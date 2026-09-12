const STATS = [
  { value: "12,000+", label: "Devices Repaired" },
  { value: "15+", label: "Certified Technicians" },
  { value: "4.9 / 5", label: "Average Customer Rating" },
  { value: "30 min", label: "Average Diagnosis Time" },
];

export function StatsSection() {
  return (
    <section className="border-b border-border bg-muted/40">
      <div className="container grid grid-cols-2 gap-8 py-10 lg:grid-cols-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold tracking-tight text-foreground">{stat.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
