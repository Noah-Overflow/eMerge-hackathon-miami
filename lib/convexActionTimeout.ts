/** Rejects if Convex HTTP/WebSocket path does not respond in time (e.g. `npx convex dev` not running). */
export function withConvexActionTimeout<T>(
  promise: Promise<T>,
  ms: number,
): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => {
      reject(
        new Error(
          "Cannot reach the Convex backend. In the project folder, run `npx convex dev` in a separate terminal, wait until it says it is listening, then refresh this page and try again.",
        ),
      );
    }, ms);
    promise.then(
      (v) => {
        clearTimeout(t);
        resolve(v);
      },
      (e) => {
        clearTimeout(t);
        reject(e);
      },
    );
  });
}
