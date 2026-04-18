import type { Doc } from "@/convex/_generated/dataModel";

export function fmt(ts: number) {
  return new Date(ts).toLocaleString();
}

export function statusPill(status: string) {
  const good =
    status === "sealed" || status === "active" || status === "verified";
  const pending = status === "pending";
  const revoked = status === "revoked";
  const cls = good
    ? "inline-flex items-center gap-1.5 rounded-full bg-secondary-container/30 px-2 py-0.5 text-[10px] font-bold text-on-secondary-container"
    : pending
      ? "inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-bold text-outline"
      : revoked
        ? "inline-flex items-center gap-1.5 rounded-full bg-surface-container-high px-2 py-0.5 text-[10px] font-bold text-on-surface-variant"
        : "inline-flex items-center gap-1.5 rounded-full bg-error-container/40 px-2 py-0.5 text-[10px] font-bold text-error";
  const dot =
    pending ? "bg-outline" : status === "failed" ? "bg-error" : good ? "bg-secondary" : "bg-outline";
  return (
    <span className={cls}>
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

export type ActivityRow = { op: string; entity: string; status: string; at: number };

export function buildActivityRows(
  receipts: Doc<"inferenceReceipts">[],
  docs: Doc<"documents">[],
  keys: Doc<"apiKeys">[],
): ActivityRow[] {
  const rows: ActivityRow[] = [];
  for (const r of receipts) {
    rows.push({
      op: "Inference receipt",
      entity: r.receiptId,
      status: r.status,
      at: r.createdAt,
    });
  }
  for (const d of docs) {
    rows.push({
      op: "Document",
      entity: d.verityDocId,
      status: d.status,
      at: d.createdAt,
    });
  }
  for (const k of keys) {
    rows.push({
      op: "API key",
      entity: k.prefix,
      status: k.revokedAt ? "revoked" : "active",
      at: k.createdAt,
    });
  }
  rows.sort((a, b) => b.at - a.at);
  return rows;
}

/** Matches `api.dashboard.getUsageDaily` return shape. */
export type UsageDailySnapshot = {
  dayKeys: string[];
  seals: number[];
  apiCreated: number[];
};

export function shortDayLabel(isoKey: string): string {
  const parts = isoKey.split("-").map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (!y || !m || !d || Number.isNaN(y)) return isoKey;
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** Bar height % for non-zero counts; zeros stay at 0. */
export function sealBarPercents(counts: number[], minPct = 12): number[] {
  const max = Math.max(1, ...counts);
  return counts.map((c) => (c === 0 ? 0 : Math.max(minPct, (c / max) * 100)));
}

export function sliceLast<T>(arr: T[], n: number): T[] {
  if (arr.length <= n) return [...arr];
  return arr.slice(arr.length - n);
}
