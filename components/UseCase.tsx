export function UseCase() {
  return (
    <section className="bg-surface-container-low py-14 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8">
        <div>
          <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
            Compliance escalation? Submit a Verity receipt.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-on-surface-variant sm:text-base">
            When audits happen, stop digging through mutable logs. Provide a
            cryptographically signed trust receipt that proves exactly what was
            asked and what was answered at a specific point in time.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-on-surface">
            <li className="flex gap-3">
              <span
                className="mt-0.5 shrink-0 text-secondary-container"
                aria-hidden
              >
                ◆
              </span>
              <div>
                <p className="font-semibold">Legal admissibility</p>
                <p className="mt-1 text-on-surface-variant">
                  Tamper-evident evidence for regulatory review.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span
                className="mt-0.5 shrink-0 text-secondary-container"
                aria-hidden
              >
                ◆
              </span>
              <div>
                <p className="font-semibold">Real-time verification</p>
                <p className="mt-1 text-on-surface-variant">
                  Check interaction status from the Verity console or API.
                </p>
              </div>
            </li>
          </ul>
        </div>
        <div className="rounded-lg border-l-4 border-secondary-container bg-surface-container-lowest p-6 shadow-ambient sm:p-8">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Trust receipt
            </p>
            <span className="rounded-full bg-secondary-container/35 px-3 py-1 text-xs font-semibold text-on-secondary-container">
              Verified interaction
            </span>
          </div>
          <dl className="mt-6 space-y-4 font-mono text-xs sm:text-sm">
            <div>
              <dt className="text-on-surface-variant">Receipt ID</dt>
              <dd className="mt-1 break-all text-on-surface">VRTY-8821-X90-AQ</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Sealed at (UTC)</dt>
              <dd className="mt-1 text-on-surface">2026-04-18 14:22:01</dd>
            </div>
            <div>
              <dt className="text-on-surface-variant">Document hash (SHA-256)</dt>
              <dd className="mt-1 break-all text-on-surface">
                e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
              </dd>
            </div>
          </dl>
          <p className="mt-6 flex items-center gap-2 text-xs font-medium text-on-secondary-container">
            <span aria-hidden>✓</span>
            Integrity verified · Tamper-evident
          </p>
        </div>
      </div>
    </section>
  );
}
