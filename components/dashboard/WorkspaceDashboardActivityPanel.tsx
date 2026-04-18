"use client";

import Link from "next/link";
import { buildActivityRows, fmt, statusPill } from "./dashboardUtils";

type Props = { rows: ReturnType<typeof buildActivityRows> };

export function WorkspaceDashboardActivityPanel({ rows }: Props) {
  return (
    <>
      <section id="receipts" className="scroll-mt-28 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Recent activity</h2>
          <Link
            href="/verify"
            className="text-xs font-bold uppercase tracking-wider text-primary hover:underline"
          >
            Open verifier
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-outline-variant/5 bg-surface-container-lowest">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-surface-container-low/50">
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-outline sm:px-6 sm:py-4">
                    Operation
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-outline sm:px-6 sm:py-4">
                    Entity ID
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-outline sm:px-6 sm:py-4">
                    Status
                  </th>
                  <th className="px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-outline sm:px-6 sm:py-4">
                    Chain
                  </th>
                  <th className="px-4 py-3 text-right text-[10px] font-bold uppercase tracking-widest text-outline sm:px-6 sm:py-4">
                    Timestamp
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/5">
                {rows.slice(0, 20).map((r, i) => (
                  <tr key={`${r.entity}-${i}`} className="hover:bg-surface-container-low">
                    <td className="px-4 py-3 text-sm font-medium sm:px-6 sm:py-4">{r.op}</td>
                    <td className="px-4 py-3 font-mono text-xs text-outline sm:px-6 sm:py-4">
                      {r.entity}
                    </td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">{statusPill(r.status)}</td>
                    <td className="px-4 py-3 sm:px-6 sm:py-4">
                      {r.flowTxId && r.flowTxId !== "0xdemo" && !r.flowTxId.startsWith("[") && !r.flowTxId.startsWith("{") ? (
                        <a
                          href={`https://www.flowscan.io/tx/${r.flowTxId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 font-mono text-[10px] font-bold text-primary hover:bg-primary/20"
                        >
                          Flowscan ↗
                        </a>
                      ) : (
                        <span className="text-[10px] text-outline">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right font-mono text-xs text-outline sm:px-6 sm:py-4">
                      {fmt(r.at)}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-on-surface-variant">
                      No activity yet. Create a demo receipt or seal from your pipeline.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </section>
      <section className="flex flex-col items-center justify-between gap-4 rounded-xl border border-outline-variant/10 bg-surface-container-high/40 p-4 md:flex-row">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-highest">
            <span className="material-symbols-outlined text-primary">terminal</span>
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-outline">Base API URL</p>
            <code className="font-mono text-sm text-on-surface">https://api.verity.app/v1</code>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-6">
          <Link
            href="/docs"
            className="group flex items-center gap-1 text-sm font-bold text-primary hover:underline"
          >
            View API docs
            <span className="material-symbols-outlined text-sm transition-transform group-hover:translate-x-1">
              arrow_forward
            </span>
          </Link>
          <Link
            href="/verify"
            className="flex items-center gap-1 text-sm font-bold text-on-surface-variant"
          >
            Verify receipt
            <span className="material-symbols-outlined text-sm">verified</span>
          </Link>
        </div>
      </section>
    </>
  );
}
