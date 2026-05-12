import { createFileRoute, Link } from "@tanstack/react-router";
import { Layers, Filter, MapPin } from "lucide-react";
import { mockPlants, statusMeta } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/map")({ component: MapPage });

function MapPage() {
  return (
    <div className="relative">
      <div className="relative h-[calc(100vh-9rem)] overflow-hidden bg-[radial-gradient(circle_at_30%_20%,oklch(0.88_0.16_142),oklch(0.78_0.05_120)_50%,oklch(0.72_0.08_140))]">
        {/* terrain grid */}
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(oklch(0.5_0.06_140)_1px,transparent_1px),linear-gradient(90deg,oklch(0.5_0.06_140)_1px,transparent_1px)] [background-size:40px_40px]" />

        {/* fake plant markers */}
        {mockPlants.map((p, i) => {
          const meta = statusMeta[p.status];
          const pos = [
            { top: "20%", left: "35%" },
            { top: "45%", left: "60%" },
            { top: "60%", left: "25%" },
            { top: "30%", left: "75%" },
          ][i % 4];
          return (
            <Link
              key={p.id}
              to="/plants/$id"
              params={{ id: p.id }}
              style={pos}
              className="absolute -translate-x-1/2 -translate-y-full"
            >
              <div className="relative">
                <div className={cn("grid h-9 w-9 place-items-center rounded-full text-white shadow-lg ring-2 ring-white", meta.dot)}>
                  <MapPin className="h-4 w-4 fill-white" />
                </div>
                <div className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-white shadow" />
              </div>
            </Link>
          );
        })}

        {/* controls */}
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-xl bg-white text-foreground shadow-lg"><Layers className="h-5 w-5" /></button>
          <button className="grid h-10 w-10 place-items-center rounded-xl bg-white text-foreground shadow-lg"><Filter className="h-5 w-5" /></button>
        </div>

        {/* stats overlay */}
        <div className="absolute inset-x-4 top-4 rounded-2xl bg-white/95 p-3 shadow-lg backdrop-blur">
          <p className="font-display text-base font-semibold">Bengaluru South</p>
          <div className="mt-2 flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-success" />134 thriving</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-warning" />28 check</span>
            <span className="flex items-center gap-1"><span className="h-2 w-2 rounded-full bg-destructive" />12 lost</span>
          </div>
        </div>

        {/* bottom card */}
        <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white p-4 shadow-xl">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Tap any marker</p>
          <p className="font-display text-base font-semibold">174 plantings near you</p>
          <p className="text-xs text-muted-foreground">Survival rate in this region: <span className="font-semibold text-success">79%</span></p>
        </div>
      </div>
    </div>
  );
}
