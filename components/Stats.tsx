const items = [
  {
    icon: "⚠",
    stat: "73%",
    label:
      "AI-driven security incidents involve unverified internal model outputs.",
  },
  {
    icon: "⏱",
    stat: "4.2 Days",
    label:
      "Average time legal teams spend investigating a single non-compliant AI prompt.",
  },
  {
    icon: "◎",
    stat: "$2.3M",
    label:
      "Median cost of governance failure in production AI environments.",
  },
];

export function Stats() {
  return (
    <section className="bg-surface-container-low py-14 sm:py-16">
      <div className="mx-auto grid max-w-6xl gap-6 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-3 lg:gap-8 lg:px-8">
        {items.map((item) => (
          <article
            key={item.stat}
            className="rounded-lg bg-surface-container-lowest p-6 shadow-ambient sm:p-8"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container/30 text-lg text-on-secondary-container"
              aria-hidden
            >
              {item.icon}
            </span>
            <p className="font-display mt-4 text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
              {item.stat}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant">
              {item.label}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
