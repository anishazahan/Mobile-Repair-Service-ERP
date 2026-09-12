// Fake network layer — simulates the latency and occasional failures of a
// real API so TanStack Query's loading/error/retry behavior is exercised
// exactly as it would be against a real backend. No actual network call
// happens; this only adds artificial delay (and, optionally, induced
// failures) around in-memory mock-data reads/writes.

export class MockApiError extends Error {
  constructor(message = "Something went wrong. Please try again.") {
    super(message);
    this.name = "MockApiError";
  }
}

/** Resolve after `ms` milliseconds (randomized within a small range by default). */
export function delay(ms?: number): Promise<void> {
  const duration = ms ?? 350 + Math.random() * 450;
  return new Promise((resolve) => setTimeout(resolve, duration));
}

/**
 * Wrap a synchronous mock-data operation to behave like a real API call:
 * adds latency, and — when `failRate` is set above 0 — randomly rejects to
 * exercise error states in the UI.
 */
export async function simulateRequest<T>(
  operation: () => T,
  options?: { failRate?: number; delayMs?: number },
): Promise<T> {
  await delay(options?.delayMs);
  if (options?.failRate && Math.random() < options.failRate) {
    throw new MockApiError();
  }
  return operation();
}
