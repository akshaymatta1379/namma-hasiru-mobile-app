import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Award, Settings, Bell, LogOut, ChevronRight, TreeDeciduous, Target, Calendar, KeyRound } from "lucide-react";
import { toast } from "sonner";
import { userStats } from "@/lib/mock-data";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/profile")({ component: ProfilePage });

const badges = [
  { icon: "🌱", label: "First Seed" },
  { icon: "🌳", label: "10 Trees" },
  { icon: "🛡️", label: "Forest Guardian" },
  { icon: "🔥", label: "30-day Streak" },
  { icon: "🏆", label: "Top 50" },
  { icon: "💧", label: "Rainmaker" },
];

function ProfilePage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const displayName =
    (user?.user_metadata?.display_name as string | undefined) ||
    (user?.user_metadata?.full_name as string | undefined) ||
    user?.email?.split("@")[0] ||
    userStats.name;

  const handleSignOut = async () => {
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/auth" });
  };

  return (
    <div className="px-5 pt-4 pb-4">
      <div className="flex items-center gap-4">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-[var(--gradient-forest)] font-display text-2xl font-bold text-primary-foreground">
          {displayName[0]?.toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-xl font-bold">{displayName}</h1>
          <p className="text-xs text-muted-foreground">{user?.email ?? userStats.community} · Rank #{userStats.rank}</p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        <Stat icon={TreeDeciduous} value={userStats.treesPlanted} label="Planted" />
        <Stat icon={Target} value={`${userStats.survivalRate}%`} label="Survival" />
        <Stat icon={Calendar} value={userStats.daysActive} label="Days" />
      </div>

      <section className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><Award className="h-5 w-5 text-sunset" /> Achievements</h2>
          <Link to="/achievements" className="text-xs font-semibold text-primary">See all</Link>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {badges.map((b, i) => (
            <Link to="/achievements" key={i} className="flex flex-col items-center gap-1 rounded-2xl border border-border bg-card p-3 transition active:scale-95">
              <span className="text-2xl">{b.icon}</span>
              <span className="text-center text-[10px] font-medium text-muted-foreground">{b.label}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 space-y-1 rounded-2xl border border-border bg-card p-2">
        <Row icon={Bell} label="Notification settings" to="/notification-settings" />
        <Row icon={Settings} label="App preferences" to="/preferences" />
        <Row icon={KeyRound} label="Change password" to="/forgot-password" />
        <Row icon={LogOut} label="Sign out" danger onClick={handleSignOut} />
      </section>

      <p className="mt-6 text-center text-[10px] text-muted-foreground">Namma Hasiru · v0.1 · Made with 🌿 in Bengaluru</p>
    </div>
  );
}

function Stat({ icon: Icon, value, label }: { icon: typeof Award; value: string | number; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-3 text-center">
      <Icon className="mx-auto h-4 w-4 text-primary" />
      <p className="mt-1 font-display text-xl font-bold">{value}</p>
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{label}</p>
    </div>
  );
}

function Row({ icon: Icon, label, danger, onClick, to }: { icon: typeof Award; label: string; danger?: boolean; onClick?: () => void; to?: string }) {
  const cls = `flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium ${danger ? "text-destructive" : "text-foreground"}`;
  const inner = (
    <>
      <Icon className="h-5 w-5" />
      <span className="flex-1">{label}</span>
      <ChevronRight className="h-4 w-4 text-muted-foreground" />
    </>
  );
  if (to) return <Link to={to} className={cls}>{inner}</Link>;
  return <button onClick={onClick} className={cls}>{inner}</button>;
}
