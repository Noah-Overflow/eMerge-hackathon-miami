import Link from "next/link";

const items = [
  { href: "#step-account", label: "Create account" },
  { href: "#step-api-key", label: "API key" },
  { href: "#step-document", label: "Register document" },
  { href: "#step-inference", label: "Record output" },
  { href: "#step-verify", label: "Share & verify" },
  { href: "#next-steps", label: "What's next" },
];

export function DocsSidebar() {
  return (
    <nav
      aria-label="On this page"
      className="rounded-lg bg-surface-container-low p-4 shadow-ambient"
    >
      <p className="font-display text-xs font-semibold uppercase tracking-wider text-on-surface-variant">
        On this page
      </p>
      <ul className="mt-3 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="block rounded px-2 py-1.5 text-on-surface-variant hover:bg-surface-container-lowest hover:text-primary-container"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
