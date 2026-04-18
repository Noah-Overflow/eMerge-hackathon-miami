"use client";

import { useMemo } from "react";
import {
  sealBarPercents,
  shortDayLabel,
  sliceLast,
  type UsageDailySnapshot,
} from "./dashboardUtils";

type Props = {
  usageDaily: UsageDailySnapshot | undefined;
  sealed24: number;
  failures: number;
};

export function WorkspaceDashboardUsageSection({
  usageDaily,
  sealed24,
  failures,
}: Props) {
  const spark = useMemo(() => {
    if (!usageDaily) return { counts: [0, 0, 0, 0, 0, 0], loading: true as const };
    const counts = sliceLast(usageDaily.seals, 6);
    while (counts.length < 6) counts.unshift(0);
    return { counts, loading: false as const };
  }, [usageDaily]);

  const sparkPct = useMemo(() => {
    if (spark.loading) return [14, 18, 12, 20, 16, 22];
    return sealBarPercents(spark.counts, 10);
  }, [spark]);

  const traffic = useMemo(() => {
    if (!usageDaily) {
      return {
        labels: ["", "", "", "", "", "", ""],
        sealPct: [0, 0, 0, 0, 0, 0, 0],
        apiPct: [0, 0, 0, 0, 0, 0, 0],
        loading: true as const,
      };
    }
    const { dayKeys, seals, apiCreated } = usageDaily;
    const maxY = Math.max(1, ...seals, ...apiCreated);
    const sealPct = seals.map((c) => (c === 0 ? 0 : Math.max(8, (c / maxY) * 100)));
    const apiPct = apiCreated.map((c) => (c === 0 ? 0 : Math.max(8, (c / maxY) * 100)));
    const labels = dayKeys.map(shortDayLabel);
    return { labels, sealPct, apiPct, loading: false as const };
  }, [usageDaily]);

  return (
    <>
      <div className="group flex flex-col justify-between rounded-xl bg-surface-container-low p-6 transition-colors hover:bg-surface-container-high md:col-span-4">
        <div>
          <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-outline">
            Usage at a glance
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-display text-3xl font-bold text-primary">{sealed24}</h3>
              <p className="text-sm text-outline">Seals (24h)</p>
            </div>
            <div className="flex items-end justify-between gap-3">
              <div>
                <h3 className="font-display text-xl font-bold">{failures}</h3>
                <p className="text-xs text-outline">Failures</p>
              </div>
              <div
                className={`flex h-8 min-w-[5.5rem] items-end gap-1 ${traffic.loading ? "animate-pulse opacity-60" : ""}`}
                title="Seals per day (last 6 UTC days)"
              >
                {sparkPct.map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-primary/40"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">—</h3>
              <p className="text-xs text-outline">Avg seal time</p>
            </div>
          </div>
        </div>
      </div>
      <div className="rounded-xl border border-outline-variant/5 bg-surface-container-lowest p-6 shadow-sm md:col-span-5">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
              Traffic volume
            </p>
            <p className="text-[10px] text-on-surface-variant">Last 7 UTC days</p>
          </div>
          <div className="flex gap-3">
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-[10px] text-outline">Seals</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-secondary-fixed" />
              <span className="text-[10px] text-outline">API keys</span>
            </div>
          </div>
        </div>
        <div
          className={`relative flex h-40 items-end gap-1 sm:gap-2 ${traffic.loading ? "animate-pulse opacity-70" : ""}`}
        >
          <div className="pointer-events-none absolute inset-0 border-b border-l border-outline-variant/10" />
          {traffic.sealPct.map((h, i) => (
            <div
              key={traffic.labels[i] ?? i}
              className="relative flex h-full min-w-0 flex-1 flex-col items-center justify-end px-0.5 sm:px-1"
            >
              <div className="relative flex h-full w-full max-w-[2.25rem] items-end justify-center gap-0.5">
                <div
                  className="z-10 w-1 rounded-full bg-primary sm:w-1.5"
                  style={{ height: h > 0 ? `${h}%` : "2px", maxHeight: "100%" }}
                  title={`Seals: ${usageDaily?.seals[i] ?? 0}`}
                />
                <div
                  className="z-10 w-1 rounded-full bg-secondary sm:w-1.5"
                  style={{
                    height: traffic.apiPct[i] > 0 ? `${traffic.apiPct[i]}%` : "2px",
                    maxHeight: "100%",
                  }}
                  title={`API keys created: ${usageDaily?.apiCreated[i] ?? 0}`}
                />
              </div>
              <span className="mt-1 truncate text-[9px] font-medium text-outline sm:text-[10px]">
                {traffic.labels[i]}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
