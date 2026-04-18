const LOST = "Connection lost while action was in flight";

/** One retry when Convex drops the websocket mid-action (common during `convex dev` reloads). */
export async function withConvexActionReconnect<T>(label: string, fn: () => Promise<T>): Promise<T> {
  try {
    return await fn();
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    if (msg.includes(LOST)) {
      // #region agent log
      fetch("http://127.0.0.1:7271/ingest/5e36ee2f-aa8f-4caf-a340-cf30625fa641", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "243e0c",
        },
        body: JSON.stringify({
          sessionId: "243e0c",
          hypothesisId: "H1",
          location: "lib/convexActionRetry.ts:retry",
          message: "Convex connection lost mid-action; retrying once",
          data: { label, online: typeof navigator !== "undefined" ? navigator.onLine : null },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      return await fn();
    }
    throw e;
  }
}
