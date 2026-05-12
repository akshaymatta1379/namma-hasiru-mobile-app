import { createFileRoute, Link } from "@tanstack/react-router";
import { Bell, CheckCheck, AlertCircle, Award, Users } from "lucide-react";

export const Route = createFileRoute("/notifications")({ component: NotificationsPage });

const notifs = [
  { id: "n1", icon: AlertCircle, color: "text-sunset bg-sunset/15", title: "Time to check on Banyan", body: "Your sapling at Lalbagh is 90 days old.", time: "2h", unread: true },
  { id: "n2", icon: Award, color: "text-primary bg-accent", title: "Forest Guardian unlocked!", body: "10 trees thriving past 90 days.", time: "1d", unread: true },
  { id: "n3", icon: Users, color: "text-earth bg-earth/15", title: "Community goal at 68%", body: "Monsoon Challenge — 1,598 trees to go.", time: "2d" },
  { id: "n4", icon: Bell, color: "text-muted-foreground bg-muted", title: "Weekly digest", body: "3 plants thriving, 1 needs attention.", time: "5d" },
];

function NotificationsPage() {
  return (
    <div className="px-5 pt-4">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Notifications</h1>
        <button className="flex items-center gap-1 text-xs font-semibold text-primary"><CheckCheck className="h-4 w-4" /> Mark all</button>
      </div>

      <div className="mt-4 space-y-2">
        {notifs.map((n) => (
          <Link to="/" key={n.id} className={`flex gap-3 rounded-2xl border p-3 ${n.unread ? "border-primary/30 bg-accent/40" : "border-border bg-card"}`}>
            <div className={`grid h-10 w-10 flex-shrink-0 place-items-center rounded-xl ${n.color}`}>
              <n.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-2">
                <p className="font-display text-sm font-semibold">{n.title}</p>
                <span className="text-[10px] text-muted-foreground">{n.time}</span>
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{n.body}</p>
            </div>
            {n.unread && <span className="mt-1 h-2 w-2 rounded-full bg-primary" />}
          </Link>
        ))}
      </div>
    </div>
  );
}
