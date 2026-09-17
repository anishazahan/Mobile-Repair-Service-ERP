import type { InitProgressReport, MLCEngine } from "@mlc-ai/web-llm";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/** Smallest instruct model in WebLLM's prebuilt library (~200MB, cached after first load) — prioritizes first-load speed over quality. */
export const MODEL_ID = "SmolLM2-360M-Instruct-q4f16_1-MLC";

/** `"gpu" in navigator` alone is not reliable — some browsers expose the API with no usable adapter. */
export async function isWebGpuSupported(): Promise<boolean> {
  if (typeof navigator === "undefined" || !("gpu" in navigator)) return false;
  try {
    const timeout = new Promise<null>((resolve) => setTimeout(() => resolve(null), 5000));
    const adapter = await Promise.race([navigator.gpu.requestAdapter(), timeout]);
    return adapter !== null;
  } catch {
    return false;
  }
}

/** Dynamically imported — the web-llm runtime is multiple MB and should never sit in the main site bundle. */
export async function createEngine(onProgress: (report: InitProgressReport) => void): Promise<MLCEngine> {
  const { CreateMLCEngine } = await import("@mlc-ai/web-llm");
  return CreateMLCEngine(MODEL_ID, { initProgressCallback: onProgress });
}

export async function generateReply(engine: MLCEngine, messages: ChatMessage[]): Promise<string> {
  const completion = await engine.chat.completions.create({
    messages,
    temperature: 0.7,
    max_tokens: 300,
  });
  const reply = completion.choices[0]?.message?.content;
  if (!reply) throw new Error("The assistant returned an empty response.");
  return reply.trim();
}
