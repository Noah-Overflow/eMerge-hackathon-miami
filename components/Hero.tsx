import Link from "next/link";

export function Hero() {
  return (
    <section
      id="product"
      className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6 sm:pb-20 sm:pt-14 lg:px-8"
    >
      <div className="grid min-w-0 gap-8 sm:gap-10 lg:grid-cols-2 lg:items-center lg:gap-12">
        <div className="min-w-0">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
            Enterprise AI · Trust & Governance
          </p>
          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-on-surface sm:text-4xl sm:leading-tight md:text-5xl lg:text-[3.25rem]">
            Make enterprise AI provable.
          </h1>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-on-surface-variant sm:text-base sm:leading-relaxed md:text-lg">
            Verity cryptographically seals every AI decision, prompt, and output
            to an immutable audit record — so governance teams can verify what
            happened, when, and with which context.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/sign-in"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded bg-gradient-to-r from-primary to-primary-container px-5 py-3 text-sm font-semibold text-on-primary shadow-ambient"
            >
              Get API Key
              <span aria-hidden>→</span>
            </Link>
            <Link
              href="#how-it-works"
              className="inline-flex min-h-[44px] items-center justify-center rounded px-5 py-3 text-sm font-semibold text-primary-container hover:bg-surface-container-low"
            >
              See how it works
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-on-surface-variant">
            <li className="flex items-center gap-2">
              <span className="text-secondary-container" aria-hidden>
                ✓
              </span>
              No wallet required
            </li>
            <li className="flex items-center gap-2">
              <span className="text-secondary-container" aria-hidden>
                ✓
              </span>
              Passkey login
            </li>
            <li className="flex items-center gap-2">
              <span className="text-secondary-container" aria-hidden>
                ✓
              </span>
              SOC 2 ready
            </li>
          </ul>
        </div>
        <div className="min-w-0 rounded-lg bg-code-bg p-4 shadow-ambient sm:p-6">
          <p className="font-mono text-xs font-medium text-outline-variant">
            POST /v1/anchor/inference
          </p>
          <pre className="mt-3 max-w-full overflow-x-auto font-mono text-[10px] leading-relaxed text-surface-container-high sm:text-xs">
            <code>
              <span className="text-secondary-container">curl</span>
              {` -X POST https://api.verity.app/v1/anchor \\\n`}
              <span className="text-outline-variant">{`-H `}</span>
              <span className="text-primary-container/90">{`"Authorization: Bearer VT_..."`}</span>
              {` \\\n`}
              <span className="text-outline-variant">{`-d '`}</span>
              {"{\n"}
              {`  "model": "gpt-4-turbo",\n`}
              {`  "prompt": "Execute risk assessment...",\n`}
              {`  "output": "Assessment complete. Low risk.",\n`}
              {`  "metadata": { "compliance_id": "8821" }\n`}
              {"}'"}
            </code>
          </pre>
          <p className="mt-4 font-mono text-xs text-outline-variant">
            {"// Response"}
          </p>
          <pre className="mt-1 font-mono text-[11px] leading-relaxed text-surface-container-high sm:text-xs">
            <code>
              {"{\n"}
              {`  "status": "sealed",\n`}
              {`  "receipt_id": "rec_9d4e…f2a1",\n`}
              {`  "sealed_at": "2026-04-18T14:22:01Z"\n`}
              {"}"}
            </code>
          </pre>
        </div>
      </div>
    </section>
  );
}
