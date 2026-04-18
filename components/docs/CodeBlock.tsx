export function CodeBlock({ code }: { code: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg bg-code-bg p-4 font-mono text-[11px] leading-relaxed text-surface-container-high shadow-ambient sm:text-xs">
      <code>{code}</code>
    </pre>
  );
}
