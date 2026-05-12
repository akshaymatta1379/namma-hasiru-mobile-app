import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, MapPin, Calendar, Ruler, Camera, Share2, Sprout } from "lucide-react";
import { mockPlants, statusMeta } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/plants/$id")({
  component: PlantDetailPage,
  loader: ({ params }) => {
    const plant = mockPlants.find((p) => p.id === params.id);
    if (!plant) throw notFound();
    return { plant };
  },
  notFoundComponent: () => <div className="p-8 text-center">Plant not found.</div>,
});

function PlantDetailPage() {
  const { plant } = Route.useLoaderData();
  const meta = statusMeta[plant.status as keyof typeof statusMeta];
  return (
    <div>
      <div className="relative h-72">
        <img src={plant.photo} alt={plant.species} className="h-full w-full object-cover" />
        <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-gradient-to-b from-black/50 to-transparent p-4">
          <Link to="/plants" className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-foreground"><ArrowLeft className="h-5 w-5" /></Link>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-white/95 text-foreground"><Share2 className="h-5 w-5" /></button>
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-5 text-white">
          <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium", meta.color)}>
            <span className={cn("h-1.5 w-1.5 rounded-full", meta.dot)} /> {meta.label}
          </span>
          <h1 className="mt-2 font-display text-3xl font-bold">{plant.species}</h1>
          <p className="text-sm italic opacity-80">{plant.scientificName}</p>
        </div>
      </div>

      <div className="space-y-5 px-5 py-5">
        {plant.needsCheckup && (
          <div className="rounded-2xl border border-sunset/40 bg-sunset/10 p-4">
            <p className="font-display font-semibold text-[oklch(0.45_0.17_65)]">90-day check-up due</p>
            <p className="mt-1 text-xs text-muted-foreground">Take a fresh photo and update the growth status.</p>
            <Link to="/plants/$id/update" params={{ id: plant.id }} className="mt-3 inline-flex items-center gap-2 rounded-full bg-sunset px-4 py-2 text-sm font-semibold text-white">
              <Camera className="h-4 w-4" /> Update now
            </Link>
          </div>
        )}

        <section className="grid grid-cols-2 gap-3">
          <InfoTile icon={Calendar} label="Planted" value={new Date(plant.plantedAt).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" })} />
          <InfoTile icon={Sprout} label="Type" value={plant.type === "seed" ? "Seed ball" : "Sapling"} />
          <InfoTile icon={MapPin} label="Location" value={plant.location} />
          <InfoTile icon={Ruler} label="Age" value={`${plant.daysOld} days`} />
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Growth timeline</h2>
          <div className="mt-3 space-y-3">
            {[
              { date: plant.plantedAt, label: "Planted", note: `${plant.type === "seed" ? "Seed ball" : "Sapling"} placed at ${plant.location.split(",")[0]}` },
              ...(plant.lastUpdate ? [{ date: plant.lastUpdate, label: meta.label, note: "Status updated with new photo" }] : []),
            ].map((e, i) => (
              <div key={i} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-3 w-3 rounded-full bg-primary" />
                  {i === 0 && <div className="w-px flex-1 bg-border" />}
                </div>
                <div className="flex-1 pb-3">
                  <p className="font-display text-sm font-semibold">{e.label}</p>
                  <p className="text-xs text-muted-foreground">{new Date(e.date).toLocaleDateString()}</p>
                  <p className="mt-1 text-sm">{e.note}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="font-display text-lg font-semibold">Location</h2>
          <div className="mt-3 grid h-40 place-items-center overflow-hidden rounded-2xl border border-border bg-[radial-gradient(circle_at_50%_50%,oklch(0.92_0.1_142),oklch(0.85_0.04_120))]">
            <div className="text-center">
              <MapPin className="mx-auto h-7 w-7 text-primary" />
              <p className="mt-1 font-mono text-xs text-foreground">{plant.lat.toFixed(4)}, {plant.lng.toFixed(4)}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }: { icon: typeof Sprout; label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <Icon className="h-4 w-4" />
        <p className="text-[11px] uppercase tracking-wider">{label}</p>
      </div>
      <p className="mt-1 font-display text-sm font-semibold">{value}</p>
    </div>
  );
}
