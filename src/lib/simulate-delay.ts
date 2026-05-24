export async function withSimulatedDelay<T>(fn: () => Promise<T>): Promise<T> {
  const delay = Number(process.env.NEXT_PUBLIC_SIMULATE_DELAY ?? 0);

  if (delay > 0) {
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return fn();
}
