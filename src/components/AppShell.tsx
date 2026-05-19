import { Link, Outlet, useLocation, useRouter } from "@tanstack/react-router";
import { Home, Trees, MapPin, Leaf, User, Plus, Bell, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs: { to: string; label: string; icon: typeof Home; exact?: boolean }[] = [
  { to: "/", label: "Home", icon: Home, exact: true },
  { to: "/plants", label: "Plants", icon: Trees },
  { to: "/map", label: "Map", icon: MapPin },
  { to: "/species", label: "Species", icon: Leaf },
  { to: "/profile", label: "Profile", icon: User },
];

export function AppShell() {
  const { pathname } = useLocation();
  const hideChrome = pathname.startsWith("/plant/new") || pathname.includes("/update") || pathname === "/auth";

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col bg-background">
      {!hideChrome && (
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border/60 bg-background/90 px-5 py-3 backdrop-blur">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-[var(--gradient-forest)] text-primary-foreground shadow-[var(--shadow-soft)]">
              <Leaf className="h-5 w-5" />
            </div>
            <div className="leading-tight">
              <p className="font-display text-base font-bold text-foreground">Namma Hasiru</p>
              <p className="text-[10px] uppercase tracking-widest text-muted-foreground">Plant. Track. Grow.</p>
            </div>
          </Link>
          <Link
            to="/notifications"
            className="relative grid h-10 w-10 place-items-center rounded-full border border-border bg-card text-foreground"
            aria-label="Notifications"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-sunset" />
          </Link>
        </header>
      )}

      <main className={cn("flex-1", !hideChrome && "pb-28")}>
        <Outlet />
      </main>

      {!hideChrome && (
        <>
          <Link
            to="/plant/new"
            aria-label="Plant a new tree"
            className="fixed bottom-24 left-1/2 z-40 grid h-16 w-16 -translate-x-1/2 place-items-center rounded-full bg-[var(--gradient-forest)] text-primary-foreground shadow-[0_12px_32px_-8px_oklch(0.55_0.18_142_/_0.55)] ring-4 ring-background transition active:scale-95"
          >
            <Plus className="h-7 w-7" strokeWidth={2.5} />
          </Link>

          <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t border-border/60 bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] pt-2 backdrop-blur">
            <ul className="grid grid-cols-5">
              {tabs.map(({ to, label, icon: Icon, exact }) => {
                const active = exact ? pathname === to : pathname.startsWith(to);
                return (
                  <li key={to} className="flex justify-center">
                    <Link
                      to={to as "/"}
                      className={cn(
                        "flex flex-col items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-medium transition",
                        active ? "text-primary" : "text-muted-foreground",
                      )}
                    >
                      <Icon className={cn("h-5 w-5", active && "stroke-[2.4]")} />
                      <span>{label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        </>
      )}
    </div>
  );
}
