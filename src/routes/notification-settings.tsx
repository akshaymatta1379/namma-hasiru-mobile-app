import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Bell } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/notification-settings")({ component: NotificationSettingsPage });

type NotifPrefs = {
  checkup90: boolean;
  achievements: boolean;
  community: boolean;
  weeklyDigest: boolean;
  weather: boolean;
};
const DEFAULT: NotifPrefs = { checkup90: true, achievements: true, community: true, weeklyDigest: true, weather: false };

function load(): NotifPrefs {
  if (typeof window === "undefined") return DEFAULT;
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem("nh:notifs") || "{}") }; } catch { return DEFAULT; }
}

function NotificationSettingsPage() {
  const [prefs, setPrefs] = useState<NotifPrefs>(DEFAULT);
  useEffect(() => { setPrefs(load()); }, []);

  const toggle = (k: keyof NotifPrefs) => {
    const next = { ...prefs, [k]: !prefs[k] };
    setPrefs(next);
    localStorage.setItem("nh:notifs", JSON.stringify(next));
    toast.success(next[k] ? "Enabled" : "Disabled");
  };

  const items: { key: keyof NotifPrefs; title: string; desc: string }[] = [
    { key: "checkup90", title: "90-day check-up reminders", desc: "Alert when a sapling reaches 90 days" },
    { key: "achievements", title: "Achievement unlocks", desc: "Notify when you earn a new badge" },
    { key: "community", title: "Community activity", desc: "Updates from your local community" },
    { key: "weeklyDigest", title: "Weekly digest", desc: "Summary of your trees every Sunday" },
    { key: "weather", title: "Weather alerts", desc: "Heatwaves and heavy rain near your plants" },
  ];

  return (
    <div className="px-5 pt-4 pb-4">
      <div className="flex items-center gap-3">
        <Link to="/profile" className="grid h-9 w-9 place-items-center rounded-full border border-border"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Bell className="h-6 w-6 text-primary" />Notifications</h1>
      </div>

      <div className="mt-5 space-y-2">
        {items.map((it) => (
          <button key={it.key} onClick={() => toggle(it.key)} className="flex w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-4 text-left">
            <div className="flex-1">
              <p className="font-display text-sm font-semibold">{it.title}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{it.desc}</p>
            </div>
            <span className={`relative h-6 w-11 rounded-full transition ${prefs[it.key] ? "bg-primary" : "bg-muted"}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${prefs[it.key] ? "left-[22px]" : "left-0.5"}`} />
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
