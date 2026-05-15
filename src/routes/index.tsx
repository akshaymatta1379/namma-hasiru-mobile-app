import { createFileRoute, Link } from "@tanstack/react-router";
import { TrendingUp, Sprout, CalendarCheck, Award, ChevronRight, CloudSun, Trees, Bell } from "lucide-react";
import { mockPlants, userStats, communityFeed } from "@/lib/mock-data";
import { PlantCard } from "@/components/PlantCard";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/")({ component: HomePage });

function HomePage() {
  const { user } = useAuth();
  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ||
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    userStats.name;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : hour < 21 ? "Good evening" : "Namaste";
  const firstName = displayName.split(/[\s.@]/)[0];
  const checkupCount = mockPlants.filter((p) => p.needsCheckup).length;
  const ninetyDayPlants = mockPlants.filter((p) => p.daysOld >= 85 && p.daysOld <= 100);
  return (
    <div className="space-y-6 px-5 pt-4">
      {/* Welcome */}
      <section>
        <p className="text-sm text-muted-foreground">{greeting},</p>
        <h1 className="font-display text-3xl font-bold leading-tight capitalize">
          {firstName} <span className="text-primary">🌱</span>
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          You've kept <span className="font-semibold text-foreground">{userStats.treesPlanted} trees</span> alive across {userStats.daysActive} days.
        </p>
      </section>

      {/* Hero stat card */}
      <section className="overflow-hidden rounded-3xl bg-[var(--gradient-forest)] p-5 text-primary-foreground shadow-[var(--shadow-soft)]">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest opacity-80">Survival rate</p>
            <p className="mt-1 font-display text-5xl font-bold">{userStats.survivalRate}%</p>
            <p className="mt-1 text-xs opacity-80">+4% from last month</p>
          </div>
          <TrendingUp className="h-8 w-8 opacity-80" />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <Stat icon={Sprout} value={userStats.treesPlanted} label="Planted" />
          <Stat icon={CalendarCheck} value={checkupCount} label="To check" />
          <Stat icon={Award} value={userStats.achievements} label="Badges" />
        </div>
      </section>

      {/* 90-day reminder */}
      {ninetyDayPlants.length > 0 && (
        <Link to="/notifications" className="flex items-start gap-3 rounded-2xl border border-sunset/40 bg-sunset/10 p-4">
          <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl bg-sunset/20 text-sunset">
            <Bell className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-display text-sm font-semibold">{ninetyDayPlants.length} sapling{ninetyDayPlants.length > 1 ? "s" : ""} hitting the 90-day mark</p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {ninetyDayPlants.map((p) => p.species).join(", ")} — log a check-up to confirm survival.
            </p>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      )}

      {/* Weather */}
      <section className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
        <div className="grid h-12 w-12 place-items-center rounded-xl bg-sky/30 text-foreground">
          <CloudSun className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="font-display text-base font-semibold">28°C, light showers</p>
          <p className="text-xs text-muted-foreground">Great day to plant — soil moisture is ideal.</p>
        </div>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-2 gap-3">
        <Link to="/plant/new" className="rounded-2xl border border-primary/30 bg-accent p-4">
          <Sprout className="h-6 w-6 text-primary" />
          <p className="mt-2 font-display font-semibold">Plant new</p>
          <p className="text-xs text-muted-foreground">Geo-tag a sapling</p>
        </Link>
        <Link to="/plants" className="rounded-2xl border border-border bg-card p-4">
          <CalendarCheck className="h-6 w-6 text-sunset" />
          <p className="mt-2 font-display font-semibold">{checkupCount} updates due</p>
          <p className="text-xs text-muted-foreground">90-day check-ups</p>
        </Link>
      </section>

      {/* Recent plants */}
      <section>
        <SectionHeader title="Your recent plantings" to="/plants" />
        <div className="mt-3 space-y-2">
          {mockPlants.slice(0, 3).map((p) => <PlantCard key={p.id} plant={p} />)}
        </div>
      </section>

      {/* Community */}
      <section>
        <SectionHeader title="Community pulse" to="/community" icon={Trees} />
        <div className="mt-3 space-y-2 rounded-2xl border border-border bg-card p-3">
          {communityFeed.map((a) => (
            <div key={a.id} className="flex items-start gap-3 border-b border-border/50 py-2 last:border-0">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-leaf text-leaf-foreground font-display text-sm font-bold">
                {a.user[0]}
              </div>
              <div className="flex-1 text-sm">
                <p className="leading-tight"><span className="font-semibold">{a.user}</span> {a.action}</p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">{a.area} · {a.time}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: typeof Sprout; value: number; label: string }) {
  return (
    <div className="rounded-xl bg-white/15 px-2 py-3 backdrop-blur">
      <Icon className="mx-auto h-4 w-4 opacity-90" />
      <p className="mt-1 font-display text-xl font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider opacity-80">{label}</p>
    </div>
  );
}

function SectionHeader({ title, to, icon: Icon }: { title: string; to: "/plants" | "/community"; icon?: typeof Trees }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="flex items-center gap-2 font-display text-lg font-semibold">
        {Icon && <Icon className="h-5 w-5 text-primary" />}{title}
      </h2>
      <Link to={to} className="flex items-center gap-0.5 text-xs font-medium text-primary">
        See all <ChevronRight className="h-3 w-3" />
      </Link>
    </div>
  );
}
