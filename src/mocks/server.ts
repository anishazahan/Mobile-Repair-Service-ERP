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
