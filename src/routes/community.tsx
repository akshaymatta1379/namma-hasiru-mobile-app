import { createFileRoute } from "@tanstack/react-router";
import { Trophy, Users, Target, Flame } from "lucide-react";
import { communityFeed } from "@/lib/mock-data";

export const Route = createFileRoute("/community")({ component: CommunityPage });

const leaderboard = [
  { rank: 1, name: "Priya M.", trees: 87, area: "JP Nagar" },
  { rank: 2, name: "Ravi K.", trees: 64, area: "Whitefield" },
  { rank: 3, name: "Meera S.", trees: 52, area: "Indiranagar" },
  { rank: 12, name: "You", trees: 24, area: "Bengaluru South", you: true },
];

function CommunityPage() {
  return (
    <div className="px-5 pt-4 pb-4">
      <h1 className="font-display text-2xl font-bold">Community</h1>
      <p className="text-sm text-muted-foreground">Bengaluru South · 1,284 active stewards</p>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <Card icon={Target} value="3,402" label="Trees this month" tone="primary" />
        <Card icon={Flame} value="79%" label="Survival rate" tone="sunset" />
      </div>

      <section className="mt-6 rounded-2xl border border-sunset/30 bg-sunset/10 p-4">
        <div className="flex items-center gap-2 text-[oklch(0.45_0.17_65)]">
          <Trophy className="h-4 w-4" />
          <span className="text-xs font-semibold uppercase tracking-wider">Monsoon Challenge</span>
        </div>
        <p className="mt-1 font-display text-base font-semibold">Plant 5,000 native trees by July 30</p>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-sunset" style={{ width: "68%" }} />
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground">3,402 / 5,000 · 19 days left</p>
      </section>

      <section className="mt-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><Trophy className="h-5 w-5 text-sunset" /> Leaderboard</h2>
        <div className="mt-3 space-y-2">
          {leaderboard.map((l) => (
            <div key={l.rank} className={`flex items-center gap-3 rounded-2xl border p-3 ${l.you ? "border-primary bg-accent" : "border-border bg-card"}`}>
              <div className={`grid h-9 w-9 place-items-center rounded-full font-display text-sm font-bold ${l.rank === 1 ? "bg-sunset text-white" : l.rank === 2 ? "bg-muted-foreground text-white" : l.rank === 3 ? "bg-earth text-earth-foreground" : "bg-muted text-foreground"}`}>
                {l.rank}
              </div>
              <div className="flex-1">
                <p className="font-display text-sm font-semibold">{l.name}</p>
                <p className="text-[11px] text-muted-foreground">{l.area}</p>
              </div>
              <p className="font-display text-base font-bold text-primary">{l.trees}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><Users className="h-5 w-5 text-primary" /> Activity</h2>
        <div className="mt-3 space-y-2 rounded-2xl border border-border bg-card p-3">
          {communityFeed.map((a) => (
            <div key={a.id} className="flex items-start gap-3 border-b border-border/50 py-2 last:border-0">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-leaf font-display text-sm font-bold text-leaf-foreground">{a.user[0]}</div>
              <div className="flex-1 text-sm">
                <p><span className="font-semibold">{a.user}</span> {a.action}</p>
                <p className="text-[11px] text-muted-foreground">{a.area} · {a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Card({ icon: Icon, value, label, tone }: { icon: typeof Trophy; value: string; label: string; tone: "primary" | "sunset" }) {
  return (
    <div className={`rounded-2xl p-4 ${tone === "primary" ? "bg-[var(--gradient-forest)] text-primary-foreground" : "border border-border bg-card"}`}>
      <Icon className="h-5 w-5" />
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      <p className={`text-[11px] ${tone === "primary" ? "opacity-80" : "text-muted-foreground"}`}>{label}</p>
    </div>
  );
}
