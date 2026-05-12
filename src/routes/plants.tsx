import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { mockPlants, PlantStatus } from "@/lib/mock-data";
import { PlantCard } from "@/components/PlantCard";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plants")({ component: PlantsPage });

const filters: { id: "all" | PlantStatus | "checkup"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "checkup", label: "Needs check" },
  { id: "thriving", label: "Thriving" },
  { id: "growing", label: "Growing" },
  { id: "struggling", label: "Struggling" },
];

function PlantsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [q, setQ] = useState("");

  const list = mockPlants.filter((p) => {
    if (filter === "checkup" && !p.needsCheckup) return false;
    if (filter !== "all" && filter !== "checkup" && p.status !== filter) return false;
    if (q && !`${p.species} ${p.location}`.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="px-5 pt-4">
      <h1 className="font-display text-2xl font-bold">My Plants</h1>
      <p className="text-sm text-muted-foreground">{mockPlants.length} planted · {mockPlants.filter(p=>p.status==="thriving").length} thriving</p>

      <div className="mt-4 flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5">
        <Search className="h-4 w-4 text-muted-foreground" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search species or location"
          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-3 -mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "whitespace-nowrap rounded-full border px-4 py-1.5 text-xs font-medium transition",
              filter === f.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-muted-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2">
        {list.length === 0 ? (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border py-16 text-center">
            <p className="font-display text-base font-semibold">No plants found</p>
            <p className="mt-1 text-xs text-muted-foreground">Try a different filter</p>
          </div>
        ) : (
          list.map((p) => <PlantCard key={p.id} plant={p} />)
        )}
      </div>
    </div>
  );
}
