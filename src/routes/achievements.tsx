import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Award, Lock } from "lucide-react";
import { userStats } from "@/lib/mock-data";

export const Route = createFileRoute("/achievements")({ component: AchievementsPage });

const all = [
  { icon: "🌱", label: "First Seed", desc: "Plant your first sapling", earned: true },
  { icon: "🌳", label: "10 Trees", desc: "Plant 10 saplings", earned: true },
  { icon: "🛡️", label: "Forest Guardian", desc: "Keep 10 trees alive past 90 days", earned: true },
  { icon: "🔥", label: "30-day Streak", desc: "Check on plants 30 days in a row", earned: true },
  { icon: "🏆", label: "Top 50", desc: "Rank in your community top 50", earned: true },
  { icon: "💧", label: "Rainmaker", desc: "Log 20 watering sessions", earned: true },
  { icon: "🌲", label: "Centurion", desc: "Plant 100 trees", earned: false },
  { icon: "🦋", label: "Pollinator", desc: "Plant 5 flowering species", earned: false },
  { icon: "🌍", label: "Earth Keeper", desc: "1 year on Namma Hasiru", earned: false },
];

function AchievementsPage() {
  return (
    <div className="px-5 pt-4 pb-4">
      <div className="flex items-center gap-3">
        <Link to="/profile" className="grid h-9 w-9 place-items-center rounded-full border border-border"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Award className="h-6 w-6 text-sunset" />Achievements</h1>
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{userStats.achievements} of {all.length} earned</p>

      <div className="mt-5 grid grid-cols-2 gap-3">
        {all.map((b, i) => (
          <div key={i} className={`flex flex-col items-center gap-2 rounded-2xl border p-4 text-center ${b.earned ? "border-primary/30 bg-accent/40" : "border-border bg-card opacity-60"}`}>
            <span className="text-3xl">{b.earned ? b.icon : <Lock className="h-7 w-7 text-muted-foreground" />}</span>
            <p className="font-display text-sm font-semibold">{b.label}</p>
            <p className="text-[11px] text-muted-foreground">{b.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
