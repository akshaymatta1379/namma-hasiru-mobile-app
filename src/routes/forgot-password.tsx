import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, Mail, Loader2, Leaf } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/forgot-password")({ component: ForgotPasswordPage });

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
      toast.success("Reset link sent — check your inbox");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send reset link");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center bg-background px-6 py-10">
      <Link to="/auth" className="mb-6 flex items-center gap-2 text-sm text-muted-foreground"><ArrowLeft className="h-4 w-4" /> Back to sign in</Link>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-[var(--gradient-forest)] text-primary-foreground"><Leaf className="h-7 w-7" /></div>
        <h1 className="font-display text-3xl font-bold">Reset password</h1>
        <p className="mt-1 text-sm text-muted-foreground">We'll email you a secure link to set a new password.</p>
      </div>

      {sent ? (
        <div className="rounded-2xl border border-primary/30 bg-accent/40 p-5 text-center text-sm">
          <p>Check <span className="font-semibold">{email}</span> for the reset link.</p>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-3">
          <label className="flex items-center gap-2 rounded-xl border border-border bg-card px-3 py-2.5 focus-within:border-primary">
            <Mail className="h-4 w-4 text-muted-foreground" />
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-transparent text-sm outline-none" />
          </label>
          <button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[var(--gradient-forest)] py-3 font-display text-sm font-semibold text-primary-foreground disabled:opacity-60">
            {busy && <Loader2 className="h-4 w-4 animate-spin" />} Send reset link
          </button>
        </form>
      )}
    </div>
  );
}
