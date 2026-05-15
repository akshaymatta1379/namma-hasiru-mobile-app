import { createRootRouteWithContext, Outlet, HeadContent, Scripts, useLocation, useNavigate } from "@tanstack/react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect } from "react";
import { AppShell } from "@/components/AppShell";
import { AuthProvider, useAuth } from "@/hooks/use-auth";
import { Toaster } from "@/components/ui/sonner";
import appCss from "../styles.css?url";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#228B22" },
      { title: "Namma Hasiru — Plant. Track. Grow." },
      { name: "description", content: "Geo-tag every sapling, track its survival, and grow a greener community." },
      { property: "og:title", content: "Namma Hasiru — Plant. Track. Grow." },
      { name: "twitter:title", content: "Namma Hasiru — Plant. Track. Grow." },
      { property: "og:description", content: "Geo-tag every sapling, track its survival, and grow a greener community." },
      { name: "twitter:description", content: "Geo-tag every sapling, track its survival, and grow a greener community." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/bea29297-6813-4dbc-afa5-306c2073aff0" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/bea29297-6813-4dbc-afa5-306c2073aff0" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: () => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-5xl font-bold text-primary">404</h1>
        <p className="mt-2 text-muted-foreground">This trail leads nowhere.</p>
        <a href="/" className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">Go home</a>
      </div>
    </div>
  ),
  errorComponent: ({ error }) => (
    <div className="grid min-h-screen place-items-center p-6 text-center">
      <div>
        <h1 className="font-display text-2xl font-semibold">Something wilted</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
      </div>
    </div>
  ),
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body><div id="root-app">{children}</div><Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
      <Toaster position="top-center" />
    </QueryClientProvider>
  );
}

function AuthGate() {
  const { user, loading } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    const publicPaths = ["/auth", "/forgot-password", "/reset-password"];
    if (!user && !publicPaths.includes(pathname)) navigate({ to: "/auth" });
    if (user && pathname === "/auth") navigate({ to: "/" });
  }, [user, loading, pathname, navigate]);

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="h-10 w-10 animate-pulse rounded-full bg-[var(--gradient-forest)]" />
      </div>
    );
  }
  const publicPaths = ["/auth", "/forgot-password", "/reset-password"];
  if (!user && !publicPaths.includes(pathname)) return null;
  return <AppShell />;
}
