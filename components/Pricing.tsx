import Link from "next/link";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/month",
    features: [
      "10,000 seals / mo",
      "Shared infrastructure",
      "Standard dashboard",
    ],
    cta: "Start sealing",
    href: "#api-key",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$499",
    period: "/month",
    features: [
      "500,000 seals / mo",
      "Dedicated API endpoint",
      "Compliance export (PDF)",
      "24h support",
    ],
    cta: "Go premium",
    href: "#api-key",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    features: [
      "Unlimited sealing",
      "Dedicated signing infrastructure",
      "SSO & RBAC",
      "White-label receipts",
    ],
    cta: "Contact sales",
    href: "#api-key",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
      <h2 className="font-display text-center text-2xl font-bold tracking-tight text-on-surface sm:text-3xl">
        Pricing built for scale.
      </h2>
      <p className="mx-auto mt-3 max-w-xl text-center text-sm text-on-surface-variant">
        Simple, usage-based sealing with enterprise-ready controls.
      </p>
      <div className="mt-10 grid gap-6 lg:grid-cols-3">
        {tiers.map((tier) => (
          <article
            key={tier.name}
            className={`relative flex flex-col rounded-lg p-6 sm:p-8 ${
              tier.highlight
                ? "bg-gradient-to-br from-primary to-primary-container text-on-primary ring-2 ring-primary-container shadow-ambient"
                : "bg-surface-container-lowest shadow-ambient"
            }`}
          >
            {tier.highlight && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-secondary-container px-3 py-0.5 text-xs font-bold text-on-secondary-container">
                Most popular
              </span>
            )}
            <h3
              className={`font-display text-lg font-semibold ${
                tier.highlight ? "text-on-primary" : "text-on-surface"
              }`}
            >
              {tier.name}
            </h3>
            <p className="mt-4 flex items-baseline gap-1">
              <span
                className={`font-display text-3xl font-bold ${
                  tier.highlight ? "text-on-primary" : "text-on-surface"
                }`}
              >
                {tier.price}
              </span>
              <span
                className={`text-sm ${
                  tier.highlight ? "text-on-primary/80" : "text-on-surface-variant"
                }`}
              >
                {tier.period}
              </span>
            </p>
            <ul className="mt-6 flex-1 space-y-3 text-sm">
              {tier.features.map((f) => (
                <li key={f} className="flex gap-2">
                  <span
                    className={
                      tier.highlight ? "text-secondary-container" : "text-secondary"
                    }
                    aria-hidden
                  >
                    ✓
                  </span>
                  <span
                    className={
                      tier.highlight ? "text-on-primary/90" : "text-on-surface-variant"
                    }
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href={tier.href}
              className={`mt-8 inline-flex justify-center rounded px-4 py-3 text-center text-sm font-semibold ${
                tier.highlight
                  ? "bg-on-primary text-primary-container hover:bg-surface-container-high"
                  : "bg-gradient-to-r from-primary to-primary-container text-on-primary shadow-ambient"
              }`}
            >
              {tier.cta}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
