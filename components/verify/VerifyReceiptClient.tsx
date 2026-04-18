"use client";

import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { useVeritySession } from "@/app/providers";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import {
  VerifyReceiptResultPanel,
  type FoundReceiptFields,
  type VerifyLookupStatus,
} from "./VerifyReceiptResultPanel";

export function VerifyReceiptClient() {
  const search = useSearchParams();
  const initial = search.get("id") ?? "";
  const [receiptId, setReceiptId] = useState(initial);
  const [submitted, setSubmitted] = useState(initial.trim());
  const { orgId } = useVeritySession();
  const typedOrgId = orgId ? (orgId as Id<"organizations">) : undefined;

  const queryArgs = useMemo(() => {
    if (!submitted) return "skip" as const;
    return typedOrgId
      ? { receiptId: submitted, orgId: typedOrgId }
      : { receiptId: submitted };
  }, [submitted, typedOrgId]);

  const result = useQuery(api.receipts.getReceiptById, queryArgs);
  const recordEvent = useMutation(api.receipts.recordVerificationEvent);
  const lastLogged = useRef<string | null>(null);

  const statusLabel = useMemo((): VerifyLookupStatus => {
    if (!submitted) return "idle";
    if (result === undefined) return "loading";
    if (!result.found) {
      if ("reason" in result && result.reason === "org_only") return "org_only";
      return "not_found";
    }
    return "found";
  }, [result, submitted]);

  const foundPayload = useMemo((): FoundReceiptFields | null => {
    if (!result || !result.found) return null;
    return {
      receiptId: result.receiptId,
      outputHash: result.outputHash,
      inputDocIds: result.inputDocIds,
      modelFingerprint: result.modelFingerprint,
      status: result.status,
      sealedAt: result.sealedAt,
      flowTxId: result.flowTxId,
      chainNetwork: result.chainNetwork,
      createdAt: result.createdAt,
    };
  }, [result]);

  useEffect(() => {
    setReceiptId(initial);
    if (initial.trim()) setSubmitted(initial.trim());
  }, [initial]);

  useEffect(() => {
    if (statusLabel !== "found" && statusLabel !== "not_found") return;
    const key = `${submitted}:${statusLabel}`;
    if (lastLogged.current === key) return;
    lastLogged.current = key;
    void recordEvent({
      receiptId: submitted,
      outcome: statusLabel === "found" ? "valid" : "not_found",
    });
  }, [recordEvent, statusLabel, submitted]);

  return (
    <main className="min-h-[calc(100dvh-8rem)] bg-surface px-4 pb-16 pt-8 sm:px-6 sm:pb-20 sm:pt-12">
      <div className="mx-auto max-w-xl">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-outline-variant/20 bg-surface-container-low px-3 py-1.5">
          <span className="material-symbols-outlined text-lg text-primary-container">verified_user</span>
          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">
            Public verifier
          </span>
        </div>

        <h1 className="font-display text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
          Verify a receipt
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-relaxed text-on-surface-variant sm:text-base">
          Paste a receipt ID to inspect integrity metadata.{" "}
          <span className="text-on-surface">Public</span> receipts are visible to anyone;{" "}
          <span className="text-on-surface">workspace-only</span> receipts unlock when you are signed in with the
          issuing org.
        </p>

        <form
          className="mt-8 rounded-2xl border border-outline-variant/15 bg-surface-container-lowest/80 p-4 shadow-sm sm:p-6"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitted(receiptId.trim());
          }}
        >
          <label htmlFor="verity-receipt-id" className="sr-only">
            Receipt ID
          </label>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
            <div className="relative min-w-0 flex-1">
              <span
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant material-symbols-outlined text-[20px]"
                aria-hidden
              >
                tag
              </span>
              <input
                id="verity-receipt-id"
                value={receiptId}
                onChange={(e) => setReceiptId(e.target.value)}
                className="min-h-[48px] w-full rounded-xl border border-outline-variant/30 bg-surface py-3 pl-11 pr-3 font-mono text-sm text-on-surface outline-none ring-primary-container/30 placeholder:text-on-surface-variant/60 focus:border-primary-container/50 focus:ring-2"
                placeholder="rec_…"
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>
            <button
              type="submit"
              className="inline-flex min-h-[48px] shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-primary-container px-6 text-sm font-bold text-on-primary shadow-ambient active:scale-[0.98] sm:min-w-[8.5rem]"
            >
              <span className="material-symbols-outlined text-[20px]" aria-hidden>
                fact_check
              </span>
              Verify
            </button>
          </div>
          <p className="mt-3 text-xs text-on-surface-variant">
            Tip: open{" "}
            <code className="rounded bg-surface-container-high px-1 py-0.5 font-mono text-[11px]">/verify?id=…</code>{" "}
            to prefill from your integration.
          </p>
        </form>

        <VerifyReceiptResultPanel
          submitted={!!submitted}
          statusLabel={statusLabel}
          found={foundPayload}
        />

        <Link
          href="/docs#step-verify"
          className="mt-10 inline-flex min-h-[44px] items-center gap-2 text-sm font-bold text-primary-container hover:underline"
        >
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Back to integration guide
        </Link>
      </div>
    </main>
  );
}
