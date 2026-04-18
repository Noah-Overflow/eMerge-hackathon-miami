"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { api } from "@/convex/_generated/api";

function VerifyContent() {
  const search = useSearchParams();
  const initial = search.get("id") ?? "";
  const [receiptId, setReceiptId] = useState(initial);
  const [submitted, setSubmitted] = useState(initial.trim());
  const { isAuthenticated } = useConvexAuth();
  const result = useQuery(
    api.receipts.getReceiptById,
    submitted ? { receiptId: submitted } : "skip",
  );
  const recordEvent = useMutation(api.receipts.recordVerificationEvent);
  const lastLogged = useRef<string | null>(null);

  const statusLabel = useMemo(() => {
    if (!submitted) return "idle";
    if (result === undefined) return "loading";
    if (!result.found) {
      return "private" in result && result.private ? "private" : "not_found";
    }
    return "found";
  }, [result, submitted]);

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
    <main className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <h1 className="font-display text-2xl font-bold text-on-surface">
        Public verifier
      </h1>
      <p className="mt-3 text-sm text-on-surface-variant">
        Look up a receipt by ID. Public receipts are visible to everyone; org-only
        receipts require you to be signed in to the same workspace.
      </p>
      <form
        className="mt-8 flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          setSubmitted(receiptId.trim());
        }}
      >
        <input
          value={receiptId}
          onChange={(e) => setReceiptId(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-2 font-mono text-sm text-on-surface"
          placeholder="rec_…"
          spellCheck={false}
        />
        <button
          type="submit"
          className="rounded-lg bg-gradient-to-r from-primary to-primary-container px-4 py-2 text-sm font-semibold text-on-primary shadow-ambient"
        >
          Verify
        </button>
      </form>

      <div className="mt-8 rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-4 text-left text-sm">
        {!submitted ? (
          <p className="text-on-surface-variant">Enter a receipt ID to continue.</p>
        ) : null}
        {submitted && result === undefined ? (
          <p className="text-on-surface-variant">Checking receipt…</p>
        ) : null}
        {result && !result.found ? (
          <p className="text-on-surface-variant">
            {"private" in result && result.private
              ? "This receipt exists but is not public. Sign in with a passkey from the issuing org, then try again."
              : "No receipt found for that ID."}
            {!isAuthenticated && "private" in result && result.private ? (
              <Link
                href="/sign-in"
                className="mt-3 block font-semibold text-primary-container hover:underline"
              >
                Sign in
              </Link>
            ) : null}
          </p>
        ) : null}
        {result && result.found ? (
          <dl className="space-y-2 text-on-surface">
            <div>
              <dt className="text-xs text-on-surface-variant">Receipt</dt>
              <dd className="font-mono text-sm">{result.receiptId}</dd>
            </div>
            <div>
              <dt className="text-xs text-on-surface-variant">Output hash</dt>
              <dd className="break-all font-mono text-xs">{result.outputHash}</dd>
            </div>
            <div>
              <dt className="text-xs text-on-surface-variant">Model</dt>
              <dd>{result.modelFingerprint}</dd>
            </div>
            <div>
              <dt className="text-xs text-on-surface-variant">Status</dt>
              <dd>{result.status}</dd>
            </div>
            {result.flowTxId ? (
              <div>
                <dt className="text-xs text-on-surface-variant">Flow tx</dt>
                <dd className="break-all font-mono text-xs">{result.flowTxId}</dd>
              </div>
            ) : null}
          </dl>
        ) : null}
      </div>

      <Link
        href="/docs#step-verify"
        className="mt-8 inline-block text-sm font-semibold text-primary-container hover:underline"
      >
        ← Back to integration guide
      </Link>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <main className="mx-auto max-w-lg px-4 py-12 text-center text-sm text-on-surface-variant sm:px-6">
            Loading verifier…
          </main>
        }
      >
        <VerifyContent />
      </Suspense>
      <Footer />
    </>
  );
}
