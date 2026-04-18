"use client";

import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import { WorkspaceDashboard } from "@/components/dashboard/WorkspaceDashboard";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { useVeritySession } from "../providers";

export default function DashboardPage() {
  const { userId, orgId, clearSession } = useVeritySession();
  const isAuthenticated = !!(userId && orgId);

  const typedUserId = userId as Id<"users"> | null;
  const typedOrgId = orgId as Id<"organizations"> | null;
  const authArgs = typedUserId && typedOrgId
    ? { userId: typedUserId, orgId: typedOrgId }
    : "skip" as const;

  const docs = useQuery(api.dashboard.listDocuments, authArgs);
  const receipts = useQuery(api.dashboard.listInferenceReceipts, authArgs);
  const keys = useQuery(api.apiKeys.listApiKeys, authArgs);
  const createKey = useMutation(api.apiKeys.createApiKey);
  const revokeKey = useMutation(api.apiKeys.revokeApiKey);
  const seedDemo = useMutation(api.receipts.createDemoInferenceReceipt);
  const [newKeyName, setNewKeyName] = useState("Default");
  const [plaintextKey, setPlaintextKey] = useState<string | null>(null);
  const [busy, setBusy] = useState("");

  async function onCreateKey() {
    if (!typedUserId || !typedOrgId) return;
    setBusy("Creating key…");
    try {
      const { key } = await createKey({
        name: newKeyName.trim() || "Unnamed",
        userId: typedUserId,
        orgId: typedOrgId,
      });
      setPlaintextKey(key);
    } finally {
      setBusy("");
    }
  }

  async function onRevoke(id: Id<"apiKeys">) {
    if (!typedUserId || !typedOrgId) return;
    if (!confirm("Revoke this API key?")) return;
    await revokeKey({ apiKeyId: id, userId: typedUserId, orgId: typedOrgId });
  }

  async function onSeedDemo() {
    if (!typedOrgId) return;
    setBusy("Creating demo receipt…");
    try {
      await seedDemo({ orgId: typedOrgId });
    } finally {
      setBusy("");
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-surface px-4">
        <h1 className="font-display text-xl font-bold text-on-surface">Sign in required</h1>
        <p className="max-w-sm text-center text-sm text-on-surface-variant">
          Use a passkey to open your Verity workspace dashboard.
        </p>
        <Link
          href="/sign-in"
          className="rounded-lg bg-gradient-to-r from-primary to-primary-container px-5 py-3 text-sm font-semibold text-on-primary shadow-ambient"
        >
          Go to sign in
        </Link>
      </div>
    );
  }

  return (
    <WorkspaceDashboard
      receipts={receipts ?? []}
      docs={docs ?? []}
      keys={keys ?? []}
      newKeyName={newKeyName}
      setNewKeyName={setNewKeyName}
      plaintextKey={plaintextKey}
      busy={busy}
      onCreateKey={onCreateKey}
      onRevoke={onRevoke}
      onSeedDemo={onSeedDemo}
      onSignOut={clearSession}
      convexConnected={isAuthenticated}
      sessionActive={isAuthenticated}
    />
  );
}
