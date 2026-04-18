"use client";

import type { Doc, Id } from "@/convex/_generated/dataModel";
import { buildActivityRows } from "./dashboardUtils";
import { WorkspaceDashboardActivityPanel } from "./WorkspaceDashboardActivityPanel";
import { WorkspaceDashboardKeysPanel } from "./WorkspaceDashboardKeysPanel";
import { WorkspaceDashboardOverviewPanels } from "./WorkspaceDashboardOverviewPanels";

type Props = {
  receipts: Doc<"inferenceReceipts">[];
  docs: Doc<"documents">[];
  keys: Doc<"apiKeys">[];
  newKeyName: string;
  setNewKeyName: (v: string) => void;
  plaintextKey: string | null;
  busy: string;
  onCreateKey: () => void;
  onRevoke: (id: Id<"apiKeys">) => void;
  onSeedDemo: () => void;
  convexConnected: boolean;
  sessionActive: boolean;
};

export function WorkspaceDashboardMain(props: Props) {
  const rows = buildActivityRows(props.receipts, props.docs, props.keys);

  return (
    <main className="min-w-0 flex-1 overflow-y-auto">
      <header className="fixed top-0 z-40 w-full border-b border-outline-variant/10 bg-surface/80 backdrop-blur-xl md:left-64 md:w-[calc(100%-16rem)]">
        <div className="flex h-16 w-full items-center justify-between px-4 sm:px-8">
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-outline">search</span>
            <span className="hidden font-display text-sm sm:inline">Search workspace…</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined cursor-pointer text-outline hover:text-primary-container">
              notifications
            </span>
            <span className="material-symbols-outlined text-outline">passkey</span>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-7xl space-y-8 px-4 pb-24 pt-24 sm:px-8 md:pb-16">
        <WorkspaceDashboardOverviewPanels
          receipts={props.receipts}
          docs={props.docs}
          keys={props.keys}
          convexConnected={props.convexConnected}
          sessionActive={props.sessionActive}
        />
        <WorkspaceDashboardKeysPanel
          keys={props.keys}
          newKeyName={props.newKeyName}
          setNewKeyName={props.setNewKeyName}
          plaintextKey={props.plaintextKey}
          busy={props.busy}
          onCreateKey={props.onCreateKey}
          onRevoke={props.onRevoke}
          onSeedDemo={props.onSeedDemo}
        />
        <WorkspaceDashboardActivityPanel rows={rows} />
      </div>
    </main>
  );
}
