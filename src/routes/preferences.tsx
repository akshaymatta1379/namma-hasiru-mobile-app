import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Settings } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/preferences")({ component: PreferencesPage });

type Prefs = { theme: "system" | "light" | "dark"; units: "metric" | "imperial"; language: "en" | "kn" | "hi" };
const DEFAULT: Prefs = { theme: "system", units: "metric", language: "en" };

function loadPrefs(): Prefs {
  if (typeof window === "undefined") return DEFAULT;
  try { return { ...DEFAULT, ...JSON.parse(localStorage.getItem("nh:prefs") || "{}") }; } catch { return DEFAULT; }
}

function PreferencesPage() {
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT);
  useEffect(() => { setPrefs(loadPrefs()); }, []);

  const update = <K extends keyof Prefs>(k: K, v: Prefs[K]) => {
    const next = { ...prefs, [k]: v };
    setPrefs(next);
    localStorage.setItem("nh:prefs", JSON.stringify(next));
    if (k === "theme") {
      const root = document.documentElement;
      root.classList.remove("dark");
      if (v === "dark" || (v === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
        root.classList.add("dark");
      }
    }
    toast.success("Preference saved");
  };

  return (
    <div className="px-5 pt-4 pb-4">
      <div className="flex items-center gap-3">
        <Link to="/profile" className="grid h-9 w-9 place-items-center rounded-full border border-border"><ArrowLeft className="h-4 w-4" /></Link>
        <h1 className="font-display text-2xl font-bold flex items-center gap-2"><Settings className="h-6 w-6 text-primary" />App preferences</h1>
      </div>

      <Group label="Theme">
        {(["system", "light", "dark"] as const).map((t) => (
          <Choice key={t} active={prefs.theme === t} onClick={() => update("theme", t)} label={t} />
        ))}
      </Group>

      <Group label="Units">
        {(["metric", "imperial"] as const).map((t) => (
          <Choice key={t} active={prefs.units === t} onClick={() => update("units", t)} label={t} />
        ))}
      </Group>

      <Group label="Language">
        {([
          ["en", "English"],
          ["kn", "ಕನ್ನಡ"],
          ["hi", "हिन्दी"],
        ] as const).map(([v, l]) => (
          <Choice key={v} active={prefs.language === v} onClick={() => update("language", v)} label={l} />
        ))}
      </Group>
    </div>
  );
}

function Group({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section className="mt-6">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">{children}</div>
    </section>
  );
}

function Choice({ active, onClick, label }: { active: boolean; onClick: () => void; label: string }) {
  return (
    <button onClick={onClick} className={`rounded-full border px-4 py-2 text-sm font-medium capitalize ${active ? "border-primary bg-primary text-primary-foreground" : "border-border bg-card"}`}>
      {label}
    </button>
  );
}
