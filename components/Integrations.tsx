const brands = [
  "OpenAI",
  "Anthropic",
  "LangChain",
  "AWS Bedrock",
  "Azure AI",
  "Vertex AI",
];

export function Integrations() {
  return (
    <section className="border-y border-outline-variant/15 bg-surface py-12 sm:py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
          Universal integration layer
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {brands.map((name) => (
            <span
              key={name}
              className="rounded-full bg-surface-container-low px-4 py-2 text-sm font-medium text-on-surface-variant"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
