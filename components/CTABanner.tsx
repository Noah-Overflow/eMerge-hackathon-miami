import Link from "next/link";

export function CTABanner() {
  return (
    <section
      id="api-key"
      className="bg-surface-container-low py-14 sm:py-16"
    >
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
          Your AI pipeline is live. Is it defensible?
        </h2>
        <p className="mt-3 text-sm text-on-surface-variant sm:text-base">
          Join teams building trust into every model interaction with Verity.
        </p>
        <Link
          href="/sign-in"
          className="mt-8 inline-flex min-h-[44px] items-center justify-center rounded bg-gradient-to-r from-primary to-primary-container px-6 py-3 text-sm font-semibold text-on-primary shadow-ambient"
        >
          Get API key
        </Link>
      </div>
    </section>
  );
}
