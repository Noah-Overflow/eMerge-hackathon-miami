"use client";

import type { Doc, Id } from "@/convex/_generated/dataModel";

type Props = {
  keys: Doc<"apiKeys">[];
  newKeyName: string;
  setNewKeyName: (v: string) => void;
  plaintextKey: string | null;
  busy: string;
  onCreateKey: () => void;
  onRevoke: (id: Id<"apiKeys">) => void;
  onSeedDemo: () => void;
};

export function WorkspaceDashboardKeysPanel({
  keys,
  newKeyName,
  setNewKeyName,
  plaintextKey,
  busy,
  onCreateKey,
  onRevoke,
  onSeedDemo,
}: Props) {
  return (
    <section
      id="keys"
      className="scroll-mt-28 space-y-4 rounded-xl border border-outline-variant/10 bg-surface-container-low/40 p-4 sm:p-6"
    >
      <h2 className="font-display text-xl font-bold">API keys</h2>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <input
          value={newKeyName}
          onChange={(e) => setNewKeyName(e.target.value)}
          className="min-w-0 flex-1 rounded-lg border border-outline-variant/40 bg-surface px-3 py-2 text-sm"
          placeholder="Key name"
        />
        <button
          type="button"
          disabled={!!busy}
          onClick={() => void onCreateKey()}
          className="rounded-lg bg-primary-container px-4 py-2 text-sm font-semibold text-on-primary-container disabled:opacity-50"
        >
          Create key
        </button>
        <button
          type="button"
          disabled={!!busy}
          onClick={() => void onSeedDemo()}
          className="rounded-lg border border-outline-variant/40 px-4 py-2 text-xs font-semibold text-on-surface disabled:opacity-50"
        >
          Demo receipt
        </button>
      </div>
      {plaintextKey ? (
        <p className="break-all rounded-lg bg-primary/10 px-3 py-2 text-xs text-on-surface">
          Copy once: <span className="font-mono">{plaintextKey}</span>
        </p>
      ) : null}
      <ul className="space-y-2 text-sm">
        {keys.map((k) => (
          <li
            key={k._id}
            className="flex flex-col gap-2 rounded-lg border border-outline-variant/15 bg-surface px-3 py-2 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-medium">{k.name}</p>
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
      </ul>
    </section>
  );
}
