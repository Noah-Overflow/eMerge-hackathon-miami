"use client";

import Link from "next/link";
import { type ReactNode } from "react";
import { fmt, statusPill } from "@/components/dashboard/dashboardUtils";

export type VerifyLookupStatus = "idle" | "loading" | "not_found" | "org_only" | "found";

export type FoundReceiptFields = {
  receiptId: string;
  outputHash: string;
  inputDocIds: string[];
  modelFingerprint: string;
  status: string;
  sealedAt?: number;
  flowTxId?: string;
  chainNetwork: string;
  createdAt: number;
};

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low/50 px-4 py-3 sm:px-5">
      <p className="text-[10px] font-bold uppercase tracking-widest text-outline">{label}</p>
      <div className="mt-1.5 text-sm text-on-surface">{children}</div>
    </div>
  );
}

type Props = {
  submitted: boolean;
  statusLabel: VerifyLookupStatus;
  found: FoundReceiptFields | null;
};

export function VerifyReceiptResultPanel({ submitted, statusLabel, found }: Props) {
  return (
    <div className="mt-8">
      {!submitted ? (
        <div className="rounded-2xl border border-dashed border-outline-variant/25 bg-surface-container-low/30 px-5 py-10 text-center">
          <span className="material-symbols-outlined text-4xl text-outline/80">shield_lock</span>
          <p className="mt-3 text-sm text-on-surface-variant">
            Enter a receipt ID above to verify seals, model fingerprint, and Flow anchor (when present).
          </p>
        </div>
      ) : null}

      {submitted && statusLabel === "loading" ? (
        <div className="space-y-3 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-6">
          <div className="h-4 w-1/3 animate-pulse rounded bg-surface-container-high" />
          <div className="h-4 w-full animate-pulse rounded bg-surface-container-high/70" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-surface-container-high/50" />
          <p className="pt-2 text-center text-xs text-on-surface-variant">Checking receipt…</p>
        </div>
      ) : null}

      {statusLabel === "not_found" ? (
        <div
          role="status"
          className="rounded-2xl border border-outline-variant/20 bg-surface-container-low px-5 py-6 sm:px-8"
        >
          <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:text-left">
            <span className="material-symbols-outlined text-4xl text-outline">search_off</span>
            <div>
              <p className="font-display text-lg font-bold text-on-surface">No receipt found</p>
              <p className="mt-1 text-sm text-on-surface-variant">
                Double-check the ID — it may be mistyped, revoked, or not yet indexed.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      {statusLabel === "org_only" ? (
        <div
          role="status"
          className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.06] px-5 py-6 sm:px-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex gap-3">
              <span className="material-symbols-outlined shrink-0 text-3xl text-amber-700 dark:text-amber-400">
                lock
              </span>
              <div>
                <p className="font-display text-lg font-bold text-on-surface">Workspace-only receipt</p>
                <p className="mt-1 text-sm text-on-surface-variant">
                  This receipt is not public. Sign in with a passkey from the issuing workspace to view details.
                </p>
              </div>
            </div>
            <Link
              href="/sign-in"
              className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-xl bg-on-surface px-5 text-sm font-bold text-surface hover:opacity-90"
            >
              Sign in
            </Link>
          </div>
        </div>
      ) : null}

      {statusLabel === "found" && found ? (
        <div className="overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-lowest shadow-sm">
          <div className="flex flex-col gap-3 border-b border-outline-variant/10 bg-gradient-to-r from-primary/10 to-transparent px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary-container">check_circle</span>
              <span className="font-display text-lg font-bold text-on-surface">Receipt verified</span>
            </div>
            {statusPill(found.status)}
          </div>
          <div className="grid gap-3 p-4 sm:grid-cols-2 sm:gap-4 sm:p-6">
            <Field label="Receipt ID">
              <span className="break-all font-mono text-xs sm:text-sm">{found.receiptId}</span>
            </Field>
            <Field label="Model fingerprint">
              <span className="break-words text-xs sm:text-sm">{found.modelFingerprint}</span>
            </Field>
            <Field label="Output hash">
              <span className="break-all font-mono text-[11px] leading-relaxed sm:text-xs">{found.outputHash}</span>
            </Field>
            <Field label="Chain">
              <span className="rounded-full bg-secondary-container/40 px-2 py-0.5 text-xs font-semibold text-on-secondary-container">
                {found.chainNetwork}
              </span>
            </Field>
            {found.sealedAt != null ? (
              <Field label="Sealed at">
                <span className="text-xs sm:text-sm">{fmt(found.sealedAt)}</span>
              </Field>
            ) : null}
            <Field label="Created">
              <span className="text-xs sm:text-sm">{fmt(found.createdAt)}</span>
            </Field>
            <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low/50 px-4 py-3 sm:col-span-2 sm:px-5">
              <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Input documents</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {found.inputDocIds.map((id) => (
                  <span
                    key={id}
                    className="rounded-lg bg-surface-container-high px-2.5 py-1 font-mono text-[11px] text-on-surface"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
            <div className="sm:col-span-2">
              {found.flowTxId ? (
                <Field label="Flow transaction">
                  <span className="break-all font-mono text-[11px] sm:text-xs">{found.flowTxId}</span>
                </Field>
              ) : (
                <div className="rounded-xl border border-outline-variant/10 bg-surface-container-low/40 px-4 py-3 sm:px-5">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Flow anchor</p>
                  <p className="mt-1 text-sm text-on-surface-variant">Not anchored on-chain yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
