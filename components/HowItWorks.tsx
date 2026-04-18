const steps = [
  {
    n: "1",
    title: "Integrate",
    body: "Add two lines of code to your existing inference pipeline.",
  },
  {
    n: "2",
    title: "Anchor",
    body: "Verity hashes your payload and seals it to a tamper-evident record.",
  },
  {
    n: "3",
    title: "Verify",
    body: "Generate compliance-ready receipts for every model interaction.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8"
    >
      <h2 className="font-display text-center text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
        Immutable provenance in seconds.
      </h2>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm text-on-surface-variant sm:text-base">
        Verity abstracts integrity checks so your teams get enterprise-grade trust
        without changing how they ship.
      </p>
      <div className="relative mt-12 lg:mt-16">
        <div
          className="absolute left-0 right-0 top-8 hidden h-px border-t border-dashed border-outline-variant/40 lg:block"
          aria-hidden
        />
        <ol className="grid gap-10 lg:grid-cols-3 lg:gap-8">
          {steps.map((s, i) => (
            <li key={s.n} className="relative text-center lg:pt-2">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-surface-container-high font-display text-xl font-bold text-primary-container shadow-ambient">
                {s.n}
              </div>
              <h3 className="font-display mt-5 text-lg font-semibold text-on-surface">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
                {s.body}
              </p>
              {i < steps.length - 1 && (
                <div
                  className="mx-auto my-6 h-8 w-px border-l border-dashed border-outline-variant/50 lg:hidden"
                  aria-hidden
                />
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
