"use client";

import Link from "next/link";

const items = [
  { id: "overview", label: "Overview", icon: "dashboard", href: "/dashboard#overview" },
  { id: "keys", label: "API Keys", icon: "key", href: "/dashboard#keys" },
  { id: "receipts", label: "Receipts", icon: "description", href: "/dashboard#receipts" },
  { id: "usage", label: "Usage", icon: "analytics", href: "/dashboard#usage" },
  { id: "docs", label: "Docs", icon: "menu_book", href: "/docs" },
] as const;

export type DashboardNavSection =
  | (typeof items)[number]["id"]
  | "settings"
  | "support";

type Props = {
  active: DashboardNavSection;
  onSelect: (s: DashboardNavSection) => void;
  onSignOut: () => void;
};

export function WorkspaceDashboardSidebar({ active, onSelect, onSignOut }: Props) {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-outline-variant/15 bg-surface md:flex">
      <div className="flex h-full flex-col space-y-2 px-4 py-8">
        <div className="mb-10 px-4">
          <Link href="/" className="mb-1 flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded bg-primary">
              <span className="material-symbols-outlined text-sm text-on-primary">shield</span>
            </div>
            <span className="font-display text-lg font-bold text-primary-container">Verity</span>
          </Link>
          <p className="text-[10px] font-bold uppercase tracking-widest text-outline">
            Workspace
          </p>
        </div>
        <nav className="flex-1 space-y-1">
          {items.map((it) => {
            const isActive = active === it.id;
            const cls = isActive
              ? "flex items-center gap-3 border-r-4 border-primary-container bg-surface-container-low px-4 py-3 font-bold text-primary-container transition-all duration-300"
              : "flex items-center gap-3 px-4 py-3 text-on-surface-variant transition-all duration-300 hover:bg-surface-container-low/50 hover:pl-5";
            if (it.href.startsWith("/docs")) {
              return (
                <Link key={it.id} href={it.href} className={cls}>
                  <span className="material-symbols-outlined">{it.icon}</span>
                  <span className="font-display text-sm font-medium">{it.label}</span>
                </Link>
              );
            }
            return (
              <a
                key={it.id}
                href={it.href}
                className={cls}
                onClick={(e) => {
                  e.preventDefault();
                  onSelect(it.id);
                  const id = it.id === "overview" ? "overview" : it.id;
                  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span className="material-symbols-outlined">{it.icon}</span>
                <span className="font-display text-sm font-medium">{it.label}</span>
              </a>
            );
          })}
        </nav>
        <div className="mt-auto space-y-1 border-t border-outline-variant/10 pt-6">
          <button
            type="button"
            className="flex w-full items-center gap-3 px-4 py-3 text-left text-on-surface-variant transition-all hover:bg-surface-container-low/50"
            onClick={() => onSelect("settings")}
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-display text-sm font-medium">Settings</span>
          </button>
          <Link
            href="/docs#step-verify"
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:bg-surface-container-low/50"
          >
            <span className="material-symbols-outlined">help</span>
            <span className="font-display text-sm font-medium">Support</span>
          </Link>
          <button
            type="button"
            onClick={onSignOut}
            className="mt-2 w-full rounded-lg border border-outline-variant/30 px-4 py-2 text-left font-display text-xs font-semibold text-on-surface hover:bg-surface-container-low"
          >
            Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}
