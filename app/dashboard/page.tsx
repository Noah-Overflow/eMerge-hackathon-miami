"use client";

import { useConvexAuth, useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useVeritySession } from "../providers";

export default function DashboardPage() {
  const { isAuthenticated, isLoading } = useConvexAuth();
  const { setSessionToken } = useVeritySession();
  const docs = useQuery(
    api.dashboard.listDocuments,
    isAuthenticated ? {} : "skip",
  );
  const receipts = useQuery(
    api.dashboard.listInferenceReceipts,
    isAuthenticated ? {} : "skip",
  );
  const keys = useQuery(api.apiKeys.listApiKeys, isAuthenticated ? {} : "skip");
  const createKey = useMutation(api.apiKeys.createApiKey);
  const revokeKey = useMutation(api.apiKeys.revokeApiKey);
  const seedDemo = useMutation(api.receipts.createDemoInferenceReceipt);
  const [newKeyName, setNewKeyName] = useState("Default");
  const [plaintextKey, setPlaintextKey] = useState<string | null>(null);
  const [busy, setBusy] = useState("");

  async function onCreateKey() {
    setBusy("Creating key…");
    try {
      const { key } = await createKey({ name: newKeyName.trim() || "Unnamed" });
      setPlaintextKey(key);
    } finally {
      setBusy("");
    }
  }

  async function onRevoke(id: Id<"apiKeys">) {
    if (!confirm("Revoke this API key?")) return;
    await revokeKey({ apiKeyId: id });
  }

  async function onSeedDemo() {
    setBusy("Creating demo receipt…");
    try {
      await seedDemo({});
    } finally {
      setBusy("");
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-4xl px-4 py-16 text-center text-sm text-on-surface-variant sm:px-6">
          Loading session…
        </main>
        <Footer />
      </>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-md px-4 py-16 text-center sm:px-6">
          <h1 className="font-display text-xl font-bold text-on-surface">
            Sign in required
          </h1>
          <p className="mt-2 text-sm text-on-surface-variant">
            Use a passkey to access your workspace, documents, and API keys.
          </p>
          <Link
            href="/sign-in"
            className="mt-6 inline-block rounded-lg bg-gradient-to-r from-primary to-primary-container px-4 py-3 text-sm font-semibold text-on-primary shadow-ambient"
          >
            Go to sign in
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl space-y-10 px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-2xl font-bold text-on-surface">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-on-surface-variant">
              Documents, inference receipts, and API keys for your org.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setSessionToken(null)}
            className="self-start rounded-lg border border-outline-variant/40 px-3 py-2 text-xs font-semibold text-on-surface hover:bg-surface-container-low"
          >
            Sign out
          </button>
        </div>

        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-4 sm:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <h2 className="font-display text-lg font-semibold text-on-surface">
              API keys
            </h2>
            <div className="flex flex-wrap gap-2">
              <input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                className="min-w-[8rem] flex-1 rounded-lg border border-outline-variant/40 bg-surface px-3 py-2 text-sm"
                placeholder="Key name"
              />
              <button
                type="button"
                disabled={!!busy}
                onClick={() => void onCreateKey()}
                className="rounded-lg bg-primary-container px-3 py-2 text-sm font-semibold text-on-primary-container disabled:opacity-50"
              >
                Create key
              </button>
            </div>
          </div>
          {plaintextKey ? (
            <p className="mt-3 break-all rounded-lg bg-primary/10 px-3 py-2 text-xs text-on-surface">
              Copy once: <span className="font-mono">{plaintextKey}</span>
            </p>
          ) : null}
          <ul className="mt-4 space-y-2 text-sm">
            {(keys ?? []).map((k) => (
              <li
                key={k._id}
                className="flex flex-col gap-2 rounded-lg border border-outline-variant/15 bg-surface px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="font-medium text-on-surface">{k.name}</p>
                  <p className="font-mono text-xs text-on-surface-variant">
                    {k.prefix}… {k.revokedAt ? "(revoked)" : ""}
                  </p>
                </div>
                {!k.revokedAt ? (
                  <button
                    type="button"
                    onClick={() => void onRevoke(k._id)}
                    className="text-xs font-semibold text-error hover:underline"
                  >
                    Revoke
                  </button>
                ) : null}
              </li>
            ))}
            {keys?.length === 0 ? (
              <li className="text-on-surface-variant">No keys yet.</li>
            ) : null}
          </ul>
        </section>

        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-4 sm:p-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="font-display text-lg font-semibold text-on-surface">
              Inference receipts
            </h2>
            <button
              type="button"
              disabled={!!busy}
              onClick={() => void onSeedDemo()}
              className="rounded-lg border border-outline-variant/40 px-3 py-2 text-xs font-semibold text-on-surface disabled:opacity-50"
            >
              Add demo public receipt
            </button>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {(receipts ?? []).map((r) => (
              <li key={r._id} className="rounded-lg border border-outline-variant/15 bg-surface px-3 py-2">
                <Link
                  href={`/verify?id=${encodeURIComponent(r.receiptId)}`}
                  className="font-mono text-primary-container hover:underline"
                >
                  {r.receiptId}
                </Link>
                <span className="ml-2 text-on-surface-variant">· {r.status}</span>
              </li>
            ))}
            {receipts?.length === 0 ? (
              <li className="text-on-surface-variant">No receipts yet.</li>
            ) : null}
          </ul>
        </section>

        <section className="rounded-xl border border-outline-variant/20 bg-surface-container-low/40 p-4 sm:p-6">
          <h2 className="font-display text-lg font-semibold text-on-surface">
            Documents
          </h2>
          <ul className="mt-4 space-y-2 text-sm">
            {(docs ?? []).map((d) => (
              <li key={d._id} className="rounded-lg border border-outline-variant/15 bg-surface px-3 py-2">
                <span className="font-medium text-on-surface">{d.label}</span>
                <span className="ml-2 text-on-surface-variant">
                  · {d.status} · {d.verityDocId}
                </span>
              </li>
            ))}
            {docs?.length === 0 ? (
              <li className="text-on-surface-variant">No documents yet.</li>
            ) : null}
          </ul>
        </section>
      </main>
      <Footer />
    </>
  );
}
