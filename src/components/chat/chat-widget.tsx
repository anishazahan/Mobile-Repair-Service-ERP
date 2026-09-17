import { useEffect, useMemo, useRef, useState } from "react";
import { MessageCircle, SendHorizontal, Sparkles, TriangleAlert, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/features/chatbot/store";
import { useServiceCatalogRows, useShopSettings } from "@/features/settings/hooks";
import { cn, formatCurrency } from "@/lib/utils";

const SUGGESTIONS = [
  "What are your shop hours?",
  "How much does a screen repair cost?",
  "How long does a typical repair take?",
];

function buildSystemPrompt(
  shop: { shopName: string; phone: string; email: string; address: string } | undefined,
  services: { name: string; basePrice: number; estDurationMinutes: number }[] | undefined,
) {
  const shopLine = shop
    ? `Shop: ${shop.shopName}. Address: ${shop.address}. Phone: ${shop.phone}. Email: ${shop.email}.`
    : "Shop details are currently unavailable.";

  const serviceLines =
    services && services.length > 0
      ? services
          .slice(0, 10)
          .map((s) => `- ${s.name}: ${s.basePrice === 0 ? "Free" : formatCurrency(s.basePrice)}, ~${s.estDurationMinutes} min`)
          .join("\n")
      : "No service pricing is loaded right now.";

  return [
    "You are the GadgetFIX Assistant, a friendly, concise virtual assistant for a mobile & gadget repair shop.",
    shopLine,
    "Current repair services and prices:",
    serviceLines,
    "Answer customer questions about repair services, pricing, and how the shop works. Keep replies short (2-4 sentences), warm, and in plain text with no markdown formatting.",
    "If a customer asks something you don't have exact info for, suggest they call the shop's phone number above. If asked something unrelated to device repair, politely steer the conversation back to how you can help with their device.",
  ].join("\n\n");
}

export function ChatWidget() {
  const { isOpen, status, progress, progressText, messages, isSending, toggle, initEngine, sendMessage } =
    useChatStore();
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: shop } = useShopSettings();
  const { data: services } = useServiceCatalogRows({ status: "active" });
  const systemPrompt = useMemo(() => buildSystemPrompt(shop, services), [shop, services]);

  useEffect(() => {
    if (isOpen && status === "idle") {
      void initEngine();
    }
  }, [isOpen, status, initEngine]);

  // WebLLM stays silent for a while before its first real progress update — a local ticker keeps the UI feeling alive.
  const [loadingElapsed, setLoadingElapsed] = useState(0);
  useEffect(() => {
    if (status !== "loading") {
      setLoadingElapsed(0);
      return;
    }
    const start = Date.now();
    const id = setInterval(() => setLoadingElapsed(Math.floor((Date.now() - start) / 1000)), 1000);
    return () => clearInterval(id);
  }, [status]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!draft.trim() || isSending) return;
    void sendMessage(draft, systemPrompt);
    setDraft("");
  }

  function handleSuggestion(text: string) {
    if (isSending) return;
    void sendMessage(text, systemPrompt);
  }

  const isChatReady = status === "ready";

  return (
    <>
      <button
        onClick={toggle}
        aria-label={isOpen ? "Close chat assistant" : "Open chat assistant"}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-4 z-50 flex h-[min(70dvh,560px)] w-[min(calc(100vw-2rem),380px)] flex-col overflow-hidden rounded-lg border border-border bg-background shadow-2xl">
          <div className="flex items-center gap-2.5 bg-primary px-4 py-3 text-primary-foreground">
            <Sparkles className="h-4.5 w-4.5 shrink-0" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">GadgetFIX Assistant</p>
              <p className="truncate text-[11px] text-primary-foreground/80">
                {isChatReady ? "Ask about repairs, pricing & hours" : "On-device AI — runs in your browser"}
              </p>
            </div>
          </div>

          {status === "unsupported" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <TriangleAlert className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm font-medium text-foreground">Your browser can't run the in-device assistant</p>
              <p className="text-xs text-muted-foreground">
                This assistant runs entirely on your device using WebGPU, so there's no server and no API key. Please
                try the latest Chrome or Edge on desktop.
              </p>
            </div>
          )}

          {status === "loading" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <p className="text-sm font-medium text-foreground">Loading the on-device assistant…</p>
              <div className="h-1.5 w-full max-w-[220px] overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${Math.max(4, Math.round(progress * 100))}%` }}
                />
              </div>
              <p className="line-clamp-2 text-[11px] text-muted-foreground">
                {progressText || "Preparing model…"}
                {progress === 0 && loadingElapsed > 0 && ` (${loadingElapsed}s elapsed)`}
              </p>
              <p className="text-[10.5px] text-muted-foreground/70">
                One-time download (~275MB), cached in your browser for next time.
              </p>
            </div>
          )}

          {status === "error" && (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
              <TriangleAlert className="h-8 w-8 text-destructive" />
              <p className="text-sm font-medium text-foreground">Couldn't load the assistant</p>
              <p className="text-xs text-muted-foreground">{progressText}</p>
              <Button size="sm" onClick={() => void initEngine()}>
                Retry
              </Button>
            </div>
          )}

          {(status === "ready" || status === "idle") && (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto p-4">
                {messages.length === 0 && (
                  <div className="space-y-3">
                    <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-sm text-foreground">
                      Hi! I'm the GadgetFIX assistant. Ask me about our repair services, pricing, or shop hours.
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {SUGGESTIONS.map((s) => (
                        <button
                          key={s}
                          onClick={() => handleSuggestion(s)}
                          className="rounded-full border border-border px-2.5 py-1 text-[11.5px] text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={cn(
                      "max-w-[85%] rounded-lg px-3 py-2 text-sm",
                      m.role === "user"
                        ? "ml-auto bg-primary text-primary-foreground"
                        : m.isError
                          ? "border border-destructive/40 bg-destructive/10 text-destructive"
                          : "bg-muted text-foreground",
                    )}
                  >
                    {m.content}
                  </div>
                ))}

                {isSending && (
                  <div className="flex w-fit items-center gap-1 rounded-lg bg-muted px-3 py-2.5">
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.3s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:-0.15s]" />
                    <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-muted-foreground/60" />
                  </div>
                )}
                <div ref={scrollRef} />
              </div>

              <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-border p-3">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Type your question..."
                  className="h-9 text-sm"
                  disabled={!isChatReady || isSending}
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-9 w-9 shrink-0"
                  disabled={!isChatReady || isSending || !draft.trim()}
                >
                  <SendHorizontal className="h-4 w-4" />
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
}
