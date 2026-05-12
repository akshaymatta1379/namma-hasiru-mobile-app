import { Link } from "@tanstack/react-router";
import { MapPin, Calendar, AlertCircle } from "lucide-react";
import { Plant, statusMeta } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export function PlantCard({ plant }: { plant: Plant }) {
  const meta = statusMeta[plant.status];
  return (
    <Link
      to="/plants/$id"
      params={{ id: plant.id }}
      className="group flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)] transition active:scale-[0.99]"
    >
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
        <img src={plant.photo} alt={plant.species} className="h-full w-full object-cover" loading="lazy" />
        {plant.needsCheckup && (
          <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-sunset/90 py-0.5 text-[9px] font-semibold text-white">
            <AlertCircle className="h-3 w-3" /> Check
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col justify-between py-0.5">
        <div>
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-display text-base font-semibold leading-tight text-foreground">{plant.species}</p>
              <p className="text-[11px] italic text-muted-foreground">{plant.scientificName}</p>
            </div>
            <span className={cn("flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium", meta.color)}>
              <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} />
              {meta.label}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{plant.location.split(",")[0]}</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{plant.daysOld}d</span>
        </div>
      </div>
    </Link>
  );
}
