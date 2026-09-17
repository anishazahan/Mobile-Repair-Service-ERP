import type { MLCEngine } from "@mlc-ai/web-llm";
import { create } from "zustand";
import { createEngine, generateReply, isWebGpuSupported, type ChatMessage } from "./api";

export interface DisplayMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
}

export type EngineStatus = "idle" | "unsupported" | "loading" | "ready" | "error";

interface ChatState {
  isOpen: boolean;
  status: EngineStatus;
  progress: number;
  progressText: string;
  engine: MLCEngine | null;
  messages: DisplayMessage[];
  isSending: boolean;
  toggle: () => void;
  close: () => void;
  initEngine: () => Promise<void>;
  sendMessage: (text: string, systemPrompt: string) => Promise<void>;
}

let idCounter = 0;
function nextId() {
  idCounter += 1;
  return `msg-${idCounter}`;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  isOpen: false,
  status: "idle",
  progress: 0,
  progressText: "",
  engine: null,
  messages: [],
  isSending: false,

  toggle: () => set((s) => ({ isOpen: !s.isOpen })),
  close: () => set({ isOpen: false }),

  initEngine: async () => {
    const current = get().status;
    if (current === "loading" || current === "ready") return;

    if (!(await isWebGpuSupported())) {
      set({ status: "unsupported" });
      return;
    }

    set({ status: "loading", progress: 0, progressText: "Starting…" });
    try {
      const engine = await Promise.race([
        createEngine((report) => {
          set({ progress: report.progress, progressText: report.text });
        }),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error("This is taking longer than expected. Check your connection and try again.")), 300_000),
        ),
      ]);
      set({ engine, status: "ready" });
    } catch (err) {
      set({
        status: "error",
        progressText: err instanceof Error ? err.message : "Failed to load the on-device assistant.",
      });
    }
  },

  sendMessage: async (text, systemPrompt) => {
    const trimmed = text.trim();
    const { engine, isSending, status } = get();
    if (!trimmed || isSending || status !== "ready" || !engine) return;

    const userMessage: DisplayMessage = { id: nextId(), role: "user", content: trimmed };
    set((s) => ({ messages: [...s.messages, userMessage], isSending: true }));

    const history: ChatMessage[] = [
      { role: "system", content: systemPrompt },
      ...get()
        .messages.filter((m) => !m.isError)
        .map((m): ChatMessage => ({ role: m.role, content: m.content })),
    ];

    try {
      const reply = await generateReply(engine, history);
      set((s) => ({
        messages: [...s.messages, { id: nextId(), role: "assistant", content: reply }],
        isSending: false,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      set((s) => ({
        messages: [...s.messages, { id: nextId(), role: "assistant", content: message, isError: true }],
        isSending: false,
      }));
    }
  },
}));
