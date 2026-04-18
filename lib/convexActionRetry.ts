const LOST = "Connection lost while action was in flight";

/** One retry when Convex drops the websocket mid-action (common during `convex dev` reloads). */
export async function withConvexActionReconnect<T>(label: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes(LOST)) {
      return await fn();
    }
    throw e;
  }
}
