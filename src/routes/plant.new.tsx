import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import { ArrowLeft, Camera, MapPin, Sparkles, Sprout, TreeDeciduous, X } from "lucide-react";
import { mockSpecies } from "@/lib/mock-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/plant/new")({ component: NewPlantPage });

function NewPlantPage() {
  const navigate = useNavigate();
  const [type, setType] = useState<"seed" | "sapling">("sapling");
  const [species, setSpecies] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState("");
  const [coords, setCoords] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const onPick = (f: File | undefined) => {
    if (!f) return;
    if (!f.type.startsWith("image/")) { toast.error("Please select an image"); return; }
    if (f.size > 10 * 1024 * 1024) { toast.error("Image too large (max 10MB)"); return; }
    const reader = new FileReader();
    reader.onload = () => setPhoto(reader.result as string);
    reader.readAsDataURL(f);
  };

  return (
    <div className="min-h-screen pb-12">
      <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Link to="/" className="grid h-10 w-10 place-items-center rounded-full border border-border"><ArrowLeft className="h-5 w-5" /></Link>
        <div>
          <p className="font-display text-base font-semibold">Plant a new tree</p>
          <p className="text-xs text-muted-foreground">Step 1 of 1 · Geo-tagged</p>
        </div>
      </header>

      <div className="space-y-5 px-5 pt-4">
        {/* Camera */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => onPick(e.target.files?.[0])}
        />
        {photo ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-border">
            <img src={photo} alt="Captured sapling" className="h-full w-full object-cover" />
            <button
              onClick={() => setPhoto(null)}
              className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-black/60 text-white"
              aria-label="Remove photo"
            >
              <X className="h-4 w-4" />
            </button>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-semibold text-foreground"
            >
              Retake
            </button>
          </div>
        ) : (
          <button
            onClick={() => fileRef.current?.click()}
            className="grid aspect-[4/3] w-full place-items-center rounded-3xl border-2 border-dashed border-primary/40 bg-[var(--gradient-earth)]"
          >
            <div className="text-center">
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)]">
                <Camera className="h-7 w-7" />
              </div>
              <p className="mt-3 font-display text-base font-semibold">Take a photo</p>
              <p className="text-xs text-muted-foreground">Capture sapling + surroundings</p>
            </div>
          </button>
        )}

        {/* GPS */}
        <div className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-leaf text-leaf-foreground">
            <MapPin className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-display text-sm font-semibold">Location locked</p>
            <p className="font-mono text-[11px] text-muted-foreground">12.9763, 77.5929 · ±4m</p>
          </div>
          <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">GPS</span>
        </div>

        {/* Type */}
        <section>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">What did you plant?</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {([
              { id: "seed", label: "Seed ball", icon: Sprout },
              { id: "sapling", label: "Sapling", icon: TreeDeciduous },
            ] as const).map((opt) => (
              <button
                key={opt.id}
                onClick={() => setType(opt.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl border-2 p-4 transition",
                  type === opt.id ? "border-primary bg-accent" : "border-border bg-card",
                )}
              >
                <opt.icon className={cn("h-6 w-6", type === opt.id ? "text-primary" : "text-muted-foreground")} />
                <span className="font-display text-sm font-semibold">{opt.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* AI Species */}
        <section>
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Species</p>
            <span className="flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[10px] font-medium text-primary">
              <Sparkles className="h-3 w-3" /> AI suggested
            </span>
          </div>
          <div className="mt-2 space-y-2">
            {mockSpecies.slice(0, 3).map((s) => (
              <button
                key={s.id}
                onClick={() => setSpecies(s.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl border-2 p-3 text-left transition",
                  species === s.id ? "border-primary bg-accent" : "border-border bg-card",
                )}
              >
                <img src={s.image} alt={s.name} className="h-12 w-12 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="font-display text-sm font-semibold">{s.name}</p>
                  <p className="text-[11px] italic text-muted-foreground">{s.scientificName}</p>
                </div>
                <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">{s.successRate}%</span>
              </button>
            ))}
          </div>
        </section>

        {/* Notes */}
        <section>
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Notes (optional)</label>
          <textarea rows={2} placeholder="Soil type, mulch, watering plan…" className="mt-2 w-full rounded-xl border border-border bg-card p-3 text-sm outline-none focus:border-primary" />
        </section>

        <button
          onClick={() => { toast.success("Tree registered! Reminder set for 90 days. 🌳"); navigate({ to: "/plants" }); }}
          className="w-full rounded-full bg-[var(--gradient-forest)] py-3.5 font-display text-base font-semibold text-primary-foreground shadow-[var(--shadow-soft)]"
        >
          Register plant
        </button>
      </div>
    </div>
  );
}
