"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Doc, Id } from "@/convex/_generated/dataModel";
import type { UsageDailySnapshot } from "./dashboardUtils";
import {
  WorkspaceDashboardSidebar,
  type DashboardNavSection,
} from "./WorkspaceDashboardSidebar";
import { WorkspaceDashboardMain } from "./WorkspaceDashboardMain";

type Props = {
  receipts: Doc<"inferenceReceipts">[];
  docs: Doc<"documents">[];
  keys: Doc<"apiKeys">[];
  usageDaily: UsageDailySnapshot | undefined;
  newKeyName: string;
  setNewKeyName: (v: string) => void;
  plaintextKey: string | null;
  busy: string;
  onCreateKey: () => void;
  onRevoke: (id: Id<"apiKeys">) => void;
  onSeedDemo: () => void;
  onSignOut: () => void;
  convexConnected: boolean;
  sessionActive: boolean;
};

export function WorkspaceDashboard(props: Props) {
  const [active, setActive] = useState<DashboardNavSection>("overview");

  useEffect(() => {
    const raw = window.location.hash.replace("#", "");
    const allowed: DashboardNavSection[] = [
      "overview",
      "keys",
      "receipts",
      "usage",
      "docs",
    ];
    if (allowed.includes(raw as DashboardNavSection)) {
      setActive(raw as DashboardNavSection);
    }
  }, []);

  return (
    <div className="flex min-h-screen bg-surface text-on-surface">
      <WorkspaceDashboardSidebar
        active={active}
        onSelect={setActive}
        onSignOut={props.onSignOut}
      />
      <WorkspaceDashboardMain {...props} />
      <nav className="fixed bottom-0 left-0 z-50 flex w-full justify-around border-t border-outline-variant/15 bg-surface/90 px-2 py-2 pb-[max(0.75rem,env(safe-area-inset-bottom))] backdrop-blur-lg md:hidden">
        <Link
          href="/"
          className="flex flex-col items-center rounded-xl px-3 py-1 text-on-surface-variant"
        >
          <span className="material-symbols-outlined">home</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Home</span>
        </Link>
        <button
          type="button"
          className="flex flex-col items-center rounded-xl px-3 py-1 text-on-surface-variant"
          onClick={() => {
            setActive("keys");
            document.getElementById("keys")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="material-symbols-outlined">vpn_key</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Keys</span>
        </button>
        <button
          type="button"
          className="flex flex-col items-center rounded-xl px-3 py-1 text-on-surface-variant"
          onClick={() => {
            setActive("usage");
            document.getElementById("usage")?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          <span className="material-symbols-outlined">bar_chart</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Usage</span>
        </button>
        <Link href="/docs" className="flex flex-col items-center rounded-xl px-3 py-1 text-on-surface-variant">
          <span className="material-symbols-outlined">article</span>
          <span className="text-[10px] font-bold uppercase tracking-wider">Docs</span>
        </Link>
      </nav>
    </div>
  );
}
