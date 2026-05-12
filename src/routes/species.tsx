import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search, Sparkles } from "lucide-react";
import { mockSpecies, Species } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/species")({ component: SpeciesPage });

const cats: { id: "all" | Species["category"]; label: string }[] = [
  { id: "all", label: "All" },
  { id: "native", label: "Native" },
  { id: "fast-growing", label: "Fast-growing" },
  { id: "drought-resistant", label: "Drought-tolerant" },
  { id: "fruit", label: "Fruit" },
];

function SpeciesPage() {
  const [cat, setCat] = useState<(typeof cats)[number]["id"]>("all");
  const [q, setQ] = useState("");
  const list = mockSpecies.filter((s) => (cat === "all" || s.category === cat) && s.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="px-5 pt-4">
      <h1 className="font-display text-2xl font-bold">Species Guide</h1>
      <p className="text-sm text-muted-foreground">Pick the right tree for your soil and climate.</p>

      <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search species" className="flex-1 bg-transparent text-sm outline-none" />
      </div>

      <div className="mt-3 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {cats.map((c) => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium",
              cat === c.id ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card text-muted-foreground",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-primary/30 bg-accent p-4">
        <div className="flex items-center gap-2 text-primary"><Sparkles className="h-4 w-4" /><span className="text-xs font-semibold uppercase tracking-wider">AI pick for your area</span></div>
        <p className="mt-2 font-display text-base font-semibold">Neem & Tamarind likely thrive in JP Nagar's clay soil.</p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 pb-4">
        {list.map((s) => (
          <div key={s.id} className="overflow-hidden rounded-2xl border border-border bg-card">
            <div className="relative h-28">
              <img src={s.image} alt={s.name} className="h-full w-full object-cover" />
              <span className="absolute right-2 top-2 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-bold text-success">{s.successRate}%</span>
            </div>
            <div className="p-3">
              <p className="font-display text-sm font-semibold">{s.name}</p>
              <p className="text-[10px] italic text-muted-foreground">{s.scientificName}</p>
              <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">{s.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
