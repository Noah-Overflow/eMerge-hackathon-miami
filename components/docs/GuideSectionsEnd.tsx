import Link from "next/link";
import { CodeBlock } from "@/components/docs/CodeBlock";

export function GuideSectionsEnd() {
  return (
    <>
      <section id="step-inference" className="scroll-mt-28">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high font-display text-sm font-bold text-primary-container">
            4
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold text-on-surface sm:text-2xl">
              Record an AI output
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant sm:text-base">
              After your model returns, anchor the output hash and the document
              ids it relied on. That preserves an immutable audit record of what
              was produced and when.
            </p>
            <div className="mt-6 rounded-lg border border-tertiary-container/25 bg-surface-container-low p-4 text-sm text-on-surface">
              <p className="font-semibold text-tertiary">Architecture note</p>
              <p className="mt-2 text-on-surface-variant">
                Seal the inference <strong>before</strong> persisting the answer in
                your primary database to avoid verification races.
              </p>
            </div>
            <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              POST /anchor/inference
            </p>
            <CodeBlock
              code={`curl -X POST https://api.verity.app/anchor/inference \\
  -H "Authorization: Bearer $VERITY_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "output_hash": "sha256:…",
    "input_doc_ids": ["doc_123"],
    "model_fingerprint": "gpt-4o-2024-11-20"
  }'`}
            />
            <p className="mt-4 text-xs text-on-surface-variant">
              Behind the scenes, Verity co-signs a Flow transaction so the receipt
              is independently verifiable (testnet or mainnet).
            </p>
          </div>
        </div>
      </section>

      <section id="step-verify" className="scroll-mt-28">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high font-display text-sm font-bold text-primary-container">
            5
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold text-on-surface sm:text-2xl">
              Share and verify
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant sm:text-base">
              Share a receipt id with legal or compliance. They can verify
              integrity without an account.
            </p>
            <Link
              href="/verify"
              className="mt-6 inline-flex items-center gap-2 rounded bg-gradient-to-r from-primary to-primary-container px-5 py-3 text-sm font-semibold text-on-primary shadow-ambient"
            >
              Open live verifier
              <span aria-hidden>→</span>
            </Link>
            <div className="mt-8 rounded-lg border-l-4 border-secondary-container bg-surface-container-lowest p-5 shadow-ambient">
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase text-on-surface-variant">
                  Audit certificate
                </p>
                <span className="rounded-full bg-secondary-container/35 px-2 py-0.5 text-xs font-semibold text-on-secondary-container">
                  Verified
                </span>
              </div>
              <p className="mt-3 font-mono text-xs text-on-surface sm:text-sm">
                RECEIPT: rec_inf_5501B…7F2E
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="next-steps" className="scroll-mt-28">
        <h2 className="font-display text-xl font-bold text-on-surface sm:text-2xl">
          What to do next
        </h2>
        <ul className="mt-6 grid gap-4 sm:grid-cols-3">
          {[
            {
              t: "Record human approvals",
              d: "Anchor a human-in-the-loop decision tied to a receipt id.",
            },
            {
              t: "Export audit logs",
              d: "Download sealed receipt history for regulators or internal QA.",
            },
            {
              t: "Set up tamper alerts",
              d: "Webhook when verification fails or a hash mismatch is detected.",
            },
          ].map((x) => (
            <li
              key={x.t}
              className="rounded-lg bg-surface-container-low p-5 text-sm shadow-ambient"
            >
              <p className="font-semibold text-on-surface">{x.t}</p>
              <p className="mt-2 text-on-surface-variant">{x.d}</p>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
