import Link from "next/link";

const links = [
  { label: "Product", href: "/#product" },
  { label: "How it works", href: "/#how-it-works" },
  { label: "Docs", href: "/docs" },
  { label: "Pricing", href: "/#pricing" },
];

export function Footer() {
  return (
    <footer className="border-t border-outline-variant/15 bg-surface py-10 sm:py-12">
      <div className="mx-auto flex min-w-0 max-w-6xl flex-col items-stretch justify-between gap-8 px-4 sm:flex-row sm:items-center sm:gap-6 sm:px-6 lg:px-8">
        <div className="text-center sm:max-w-xs sm:text-left">
          <p className="font-display text-lg font-semibold text-on-surface">Verity</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Enterprise AI trust & governance
          </p>
        </div>
        <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-on-surface-variant sm:justify-end">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="inline-flex min-h-[44px] items-center px-2 py-2 hover:text-primary-container"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/verify"
            className="inline-flex min-h-[44px] items-center px-2 py-2 hover:text-primary-container"
          >
            Verify
          </Link>
          <Link
            href="/sign-in"
            className="inline-flex min-h-[44px] items-center px-2 py-2 hover:text-primary-container"
          >
            Sign in
          </Link>
        </nav>
        <p className="text-center text-xs text-on-surface-variant sm:text-right">
          © {new Date().getFullYear()} Verity. Hackathon demo.
        </p>
      </div>
    </footer>
  );
}
