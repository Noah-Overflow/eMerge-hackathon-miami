"use client";

import Link from "next/link";
import type { Doc } from "@/convex/_generated/dataModel";
import { fmt, type UsageDailySnapshot } from "./dashboardUtils";
import { WorkspaceDashboardUsageSection } from "./WorkspaceDashboardUsageSection";

type Props = {
  receipts: Doc<"inferenceReceipts">[];
  docs: Doc<"documents">[];
  keys: Doc<"apiKeys">[];
  usageDaily: UsageDailySnapshot | undefined;
  convexConnected: boolean;
  sessionActive: boolean;
};

export function WorkspaceDashboardOverviewPanels({
  receipts,
  docs,
  keys,
  usageDaily,
  convexConnected,
  sessionActive,
}: Props) {
  const now = Date.now();
  const day = 86400000;
  const sealed24 = receipts.filter(
    (r) => r.status === "sealed" && r.sealedAt && r.sealedAt > now - day,
  ).length;
  const failures =
    receipts.filter((r) => r.status === "failed").length +
    docs.filter((d) => d.status === "failed").length;
  const primary = keys.find((k) => !k.revokedAt) ?? keys[0];

  return (
    <>
      <section id="overview" className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
            Workspace overview
          </h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-secondary-container px-2 py-0.5 text-[10px] font-bold uppercase tracking-tighter text-on-secondary-container">
              Live data
            </span>
            <span className="text-sm text-on-surface-variant">
              Passkey session · Convex-backed
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/verify"
            className="rounded-lg bg-surface-container-high px-5 py-2.5 text-sm font-bold text-primary-container hover:bg-surface-container-highest"
          >
            Verify receipt
          </Link>
          <button
            type="button"
            onClick={() =>
              document.getElementById("keys")?.scrollIntoView({ behavior: "smooth" })
            }
            className="rounded-lg bg-gradient-to-r from-primary to-primary-container px-5 py-2.5 text-sm font-bold text-on-primary shadow-[0_8px_20px_rgba(79,70,229,0.2)] transition hover:scale-[1.02] active:scale-[0.98]"
          >
            Create API key
          </button>
        </div>
      </section>
      <section className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-full border border-outline-variant/10 bg-surface-container-low px-3 py-1.5">
          <div
            className={`h-2 w-2 rounded-full shadow-[0_0_8px_rgba(98,250,227,0.8)] ${convexConnected ? "bg-secondary-fixed" : "bg-outline"}`}
          />
          <span className="font-label text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            Convex: {convexConnected ? "Connected" : "Waiting"}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-outline-variant/10 bg-surface-container-low px-3 py-1.5">
          <div
            className={`h-2 w-2 rounded-full shadow-[0_0_8px_rgba(98,250,227,0.8)] ${sessionActive ? "bg-secondary-fixed" : "bg-outline"}`}
          />
          <span className="font-label text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            WebAuthn: {sessionActive ? "Active session" : "Idle"}
          </span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-outline-variant/10 bg-surface-container-low px-3 py-1.5">
          <div className="h-2 w-2 rounded-full bg-secondary-fixed shadow-[0_0_8px_rgba(98,250,227,0.8)]" />
          <span className="font-label text-xs font-medium uppercase tracking-wider text-on-surface-variant">
            Flow: anchor via signer
          </span>
        </div>
      </section>
      <section id="usage" className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <WorkspaceDashboardUsageSection
          usageDaily={usageDaily}
          sealed24={sealed24}
          failures={failures}
        />
        <div className="relative overflow-hidden rounded-xl bg-primary p-6 text-on-primary md:col-span-3">
          <div className="relative z-10">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-primary-fixed/60">
              Active API key
            </p>
            {primary ? (
              <>
                <h4 className="mb-1 font-display text-sm font-bold">{primary.name}</h4>
                <code className="mb-4 block truncate rounded bg-on-primary/10 p-2 font-mono text-[10px] text-white/90">
                  {primary.prefix}…
                </code>
                <div className="space-y-2 text-[11px]">
                  <div className="flex justify-between">
                    <span className="opacity-60">Created</span>
                    <span>{fmt(primary.createdAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="opacity-60">Scopes</span>
                    <span className="rounded bg-white/20 px-1.5">full-access</span>
                  </div>
                </div>
              </>
            ) : (
              <p className="text-sm opacity-80">No keys yet — create one below.</p>
            )}
          </div>
          <span className="material-symbols-outlined pointer-events-none absolute -bottom-4 -right-4 text-[120px] opacity-10">
            key
          </span>
        </div>
      </section>
    </>
  );
}
