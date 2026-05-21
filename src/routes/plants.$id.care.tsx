import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Send, Sparkles, Trash2 } from "lucide-react";
import { mockPlants } from "@/lib/mock-data";
import { askCareAssistant } from "@/lib/care-chat.functions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/plants/$id/care")({
  component: CareChatPage,
  loader: ({ params }) => {
    const plant = mockPlants.find((p) => p.id === params.id);
    if (!plant) throw notFound();
    return { plant };
  },
  notFoundComponent: () => <div className="p-8 text-center">Plant not found.</div>,
});

type ChatMsg = { role: "user" | "assistant"; content: string };

const QUICK = [
  "How often should I water it?",
  "Is the soil right for this tree?",
  "How do I spot pests early?",
];

function CareChatPage() {
  const { plant } = Route.useLoaderData();
  const askFn = useServerFn(askCareAssistant);
  const storageKey = `nh:care:${plant.id}`;
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [pending, setPending] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // load history
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setMessages(JSON.parse(raw));
    } catch {}
    inputRef.current?.focus();
  }, [storageKey]);

  // persist + autoscroll
  useEffect(() => {
    if (typeof window === "undefined") return;
    try { localStorage.setItem(storageKey, JSON.stringify(messages)); } catch {}
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, storageKey]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || pending) return;
    const next: ChatMsg[] = [...messages, { role: "user", content: trimmed }];
    setMessages(next);
    setInput("");
    setPending(true);
    try {
      const res = await askFn({
        data: {
          species: plant.species,
          scientificName: plant.scientificName,
          location: plant.location,
          daysOld: plant.daysOld,
          messages: next,
        },
      });
      if (res.error || !res.reply) {
        toast.error(res.error ?? "No response");
        setMessages(next); // keep user msg, no assistant
      } else {
        setMessages([...next, { role: "assistant", content: res.reply }]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong.");
    } finally {
      setPending(false);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  };

  const clear = () => {
    setMessages([]);
    try { localStorage.removeItem(storageKey); } catch {}
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <header className="flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur">
        <Link to="/plants/$id" params={{ id: plant.id }} className="grid h-10 w-10 place-items-center rounded-full border border-border">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="flex flex-1 items-center gap-3">
          <img src={plant.photo} alt={plant.species} className="h-10 w-10 rounded-xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-sm font-semibold">Care Assistant · {plant.species}</p>
            <p className="truncate text-[11px] text-muted-foreground">{plant.scientificName}</p>
          </div>
        </div>
        {messages.length > 0 && (
          <button onClick={clear} aria-label="Clear chat" className="grid h-10 w-10 place-items-center rounded-full border border-border text-muted-foreground">
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5">
        {messages.length === 0 ? (
          <div className="mx-auto max-w-md py-8 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[var(--gradient-forest)] text-primary-foreground shadow-[var(--shadow-soft)]">
              <Sparkles className="h-6 w-6" />
            </div>
            <h2 className="mt-4 font-display text-xl font-semibold">Ask anything about your {plant.species}</h2>
            <p className="mt-1 text-sm text-muted-foreground">Watering, soil, sunlight, pests — get personalised tips.</p>
            <div className="mt-5 space-y-2">
              {QUICK.map((q) => (
                <button key={q} onClick={() => send(q)} className="block w-full rounded-2xl border border-border bg-card p-3 text-left text-sm hover:border-primary">
                  {q}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-2xl flex-col gap-4">
            {messages.map((m, i) => (
              <Bubble key={i} role={m.role} content={m.content} />
            ))}
            {pending && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
                <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
                <span className="inline-block h-2 w-2 animate-bounce rounded-full bg-primary" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-t border-border bg-background px-4 py-3">
        <form
          onSubmit={(e) => { e.preventDefault(); send(input); }}
          className="mx-auto flex max-w-2xl items-end gap-2 rounded-2xl border border-border bg-card p-2"
        >
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(input); } }}
            placeholder={`Ask about ${plant.species}…`}
            rows={1}
            className="max-h-32 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
            disabled={pending}
          />
          <button
            type="submit"
            disabled={pending || !input.trim()}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-[var(--gradient-forest)] text-primary-foreground shadow-[var(--shadow-soft)] disabled:opacity-50"
            aria-label="Send"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
}

function Bubble({ role, content }: { role: "user" | "assistant"; content: string }) {
  const isUser = role === "user";
  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm leading-relaxed",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-card text-foreground border border-border",
        )}
      >
        {content}
      </div>
    </div>
  );
}
