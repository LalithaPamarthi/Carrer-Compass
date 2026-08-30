import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Copy, RefreshCw, SendHorizonal } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Logo } from "./Logo";
import { Markdown } from "./Markdown";
import { useAnalysisStore } from "@/lib/analysis-store";
import { buildCoachContext } from "@/lib/coach-context";
import type { CoachMessage } from "@/lib/types";
import { cn } from "@/lib/utils";

const SUGGESTED = [
  "Explain my score",
  "Biggest weaknesses",
  "What should I fix first?",
  "Am I job-ready?",
  "Improve my resume",
  "Improve my portfolio",
];

const uid = () => `m-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export function CoachChat({ variant = "page" }: { variant?: "page" | "panel" }) {
  const { analysis, messages, setMessages } = useAnalysisStore();
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    if (!busy) inputRef.current?.focus();
  }, [busy]);

  const send = useCallback(
    async (text: string, history?: CoachMessage[]) => {
      const trimmed = text.trim();
      if (!trimmed || busy) return;
      const base = history ?? messages;
      const userMessage: CoachMessage = { id: uid(), role: "user", content: trimmed, createdAt: new Date().toISOString() };
      const next = [...base, userMessage];
      setMessages(next);
      setInput("");
      setBusy(true);
      try {
        const res = await fetch("/api/coach", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: next.slice(-20).map((m) => ({ role: m.role, content: m.content })),
            context: buildCoachContext(analysis),
            isDemo: analysis?.isDemo ?? false,
          }),
        });
        const data = (await res.json()) as { content?: string; error?: string };
        if (!res.ok || !data.content) {
          toast.error(data.error ?? "The coach couldn't respond. Please try again.");
          setMessages(base);
          setInput(trimmed);
          return;
        }
        setMessages([...next, { id: uid(), role: "assistant", content: data.content, createdAt: new Date().toISOString() }]);
      } catch {
        toast.error("Network problem — your message wasn't sent. Please try again.");
        setMessages(base);
        setInput(trimmed);
      } finally {
        setBusy(false);
      }
    },
    [analysis, busy, messages, setMessages],
  );

  const regenerate = useCallback(() => {
    const lastUserIndex = [...messages].reverse().findIndex((m) => m.role === "user");
    if (lastUserIndex === -1) return;
    const idx = messages.length - 1 - lastUserIndex;
    const target = messages[idx];
    if (!target) return;
    void send(target.content, messages.slice(0, idx));
  }, [messages, send]);

  const copy = useCallback(async (message: CoachMessage) => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopiedId(message.id);
      toast.success("Response copied");
      window.setTimeout(() => setCopiedId(null), 1500);
    } catch {
      toast.error("Couldn't copy to clipboard");
    }
  }, []);

  return (
    <div className={cn("flex min-h-0 flex-col", variant === "panel" ? "h-full" : "h-[calc(100dvh-11rem)] min-h-[520px]")}>
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <div className="flex min-w-0 items-center gap-2">
          <Logo withWordmark={false} />
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">CareerLens Coach</p>
            <p className="truncate text-xs text-muted-foreground">
              {analysis ? (analysis.isDemo ? "Answering from the sample analysis" : "Answering from your analysis") : "No analysis loaded yet"}
            </p>
          </div>
        </div>
        {messages.length > 0 ? (
          <Button variant="ghost" size="sm" onClick={() => setMessages([])} disabled={busy}>
            New chat
          </Button>
        ) : null}
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4">
        {messages.length === 0 ? (
          <div className="space-y-4">
            <div className="rounded-xl bg-accent/60 p-4">
              <p className="text-sm font-medium text-accent-foreground">Hi — I'm your CareerLens Coach.</p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                I answer using only the analysis on your dashboard. I'll tell you when something can't be determined from it, and
                I'll flag whether an answer is a fact, an inference or a recommendation.
              </p>
            </div>
            <div>
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">Suggested prompts</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => void send(prompt)}
                    className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition-colors hover:border-primary/40 hover:bg-accent"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          messages.map((message) =>
            message.role === "user" ? (
              <div key={message.id} className="flex justify-end">
                <div className="max-w-[85%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm text-primary-foreground">
                  {message.content}
                </div>
              </div>
            ) : (
              <div key={message.id} className="space-y-2">
                <Markdown content={message.content} />
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={() => void copy(message)}>
                    {copiedId === message.id ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    <span className="ml-1">Copy</span>
                  </Button>
                  <Button variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={regenerate} disabled={busy}>
                    <RefreshCw className="size-3.5" />
                    <span className="ml-1">Regenerate</span>
                  </Button>
                </div>
              </div>
            ),
          )
        )}

        {busy ? (
          <div className="flex items-center gap-1.5 text-sm text-muted-foreground" role="status" aria-live="polite">
            <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.2s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.1s]" />
            <span className="size-1.5 animate-bounce rounded-full bg-primary" />
            <span className="ml-1">Coach is thinking…</span>
          </div>
        ) : null}
      </div>

      <form
        className="border-t border-border p-3"
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
      >
        <div className="flex items-end gap-2">
          <label htmlFor="coach-input" className="sr-only">
            Ask the CareerLens Coach
          </label>
          <Textarea
            id="coach-input"
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={2}
            placeholder="Ask anything about your profile…"
            className="max-h-32 min-h-[44px] resize-none"
          />
          <Button type="submit" size="icon" disabled={busy || !input.trim()} aria-label="Send message">
            <SendHorizonal className="size-4" />
          </Button>
        </div>
        <p className="mt-2 text-[11px] text-muted-foreground">
          AI responses can be imperfect. Treat them as recommendations, not guarantees.
        </p>
      </form>
    </div>
  );
}
