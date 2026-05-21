import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Camera, Ruler } from "lucide-react";
import { mockPlants, PlantStatus, statusMeta } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/plants/$id/update")({ component: UpdatePage });

const statuses: PlantStatus[] = ["thriving", "growing", "struggling", "dead"];

function UpdatePage() {
  const { id } = Route.useParams();
  const plant = mockPlants.find((p) => p.id === id);
  const navigate = useNavigate();
  const [status, setStatus] = useState<PlantStatus>("growing");
  const [height, setHeight] = useState("");
  const [newPhoto, setNewPhoto] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const onPick = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { toast.error("Please select an image"); return; }
    if (f.size > 10 * 1024 * 1024) { toast.error("Image too large (max 10MB)"); return; }
    const r = new FileReader();
    r.onload = () => setNewPhoto(r.result as string);
    r.readAsDataURL(f);
  };

  if (!plant) return <div className="p-8">Not found</div>;

  return (
    <div className="min-h-screen pb-12">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Link to="/plants/$id" params={{ id }} className="grid h-10 w-10 place-items-center rounded-full border border-border"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <p className="font-display text-base font-semibold">Update status</p>
          <p className="text-xs text-muted-foreground">{plant.species}</p>
        </div>
      </header>

      <div className="space-y-5 px-5 pt-4">
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Then vs now</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="overflow-hidden rounded-2xl">
              <img src={plant.photo} alt="Before" className="aspect-square w-full object-cover" />
              <p className="bg-muted py-1 text-center text-[11px] font-medium">{plant.daysOld}d ago</p>
            </div>
            <button className="grid aspect-square w-full place-items-center rounded-2xl border-2 border-dashed border-primary/40 bg-accent text-center">
              <div>
                <Camera className="mx-auto h-7 w-7 text-primary" />
                <p className="mt-2 text-xs font-semibold text-primary">Capture now</p>
              </div>
            </button>
          </div>
        </section>

        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current status</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border-2 p-3 text-left transition",
                  status === s ? "border-primary bg-accent" : "border-border bg-card",
                )}
              >
                <span className={cn("h-2.5 w-2.5 rounded-full", statusMeta[s].dot)} />
                <span className="font-display text-sm font-semibold">{statusMeta[s].label}</span>
              </button>
            ))}
          </div>
        </section>

        <section>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Height (cm)</label>
          <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3">
            <Ruler className="h-4 w-4 text-muted-foreground" />
            <input value={height} onChange={(e) => setHeight(e.target.value)} type="number" placeholder="e.g. 45" className="flex-1 bg-transparent text-sm outline-none" />
          </div>
        </section>

        <section>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes</label>
          <textarea rows={3} placeholder="Soil dry, applied mulch…" className="mt-2 w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary" />
        </section>

        <button
          onClick={() => { toast.success("Status updated! 🌿"); navigate({ to: "/plants/$id", params: { id } }); }}
          className="w-full rounded-full bg-[var(--gradient-forest)] py-3.5 font-display text-base font-semibold text-primary-foreground shadow-[var(--shadow-soft)]"
        >
          Save update
        </button>
      </div>
    </div>
  );
}
