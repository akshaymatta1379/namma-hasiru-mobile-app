import { useEffect, useState } from "react";
import { Leaf } from "lucide-react";

export function SplashScreen({ children }: { children: React.ReactNode }) {
  const [show, setShow] = useState(() => {
    if (typeof window === "undefined") return false;
    return !sessionStorage.getItem("nh:splash-seen");
  });

  useEffect(() => {
    if (!show) return;
    const t = setTimeout(() => {
      sessionStorage.setItem("nh:splash-seen", "1");
      setShow(false);
    }, 1800);
    return () => clearTimeout(t);
  }, [show]);

  return (
    <>
      {children}
      {show && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-[var(--gradient-forest)] animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-5 text-primary-foreground">
            <div className="grid h-24 w-24 place-items-center rounded-3xl bg-white/15 backdrop-blur-sm shadow-[0_20px_60px_-10px_rgba(0,0,0,0.4)] ring-1 ring-white/20 animate-in zoom-in-50 duration-700">
              <Leaf className="h-12 w-12 animate-pulse" strokeWidth={2.2} />
            </div>
            <div className="text-center animate-in fade-in slide-in-from-bottom-2 duration-700 delay-200 fill-mode-both">
              <p className="font-display text-3xl font-bold tracking-tight">Namma Hasiru</p>
              <p className="mt-1 text-[11px] uppercase tracking-[0.3em] opacity-80">Plant · Track · Grow</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
