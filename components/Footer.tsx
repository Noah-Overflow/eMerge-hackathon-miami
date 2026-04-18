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
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
        <div className="text-center sm:text-left">
          <p className="font-display text-lg font-semibold text-on-surface">Verity</p>
          <p className="mt-1 text-sm text-on-surface-variant">
            Enterprise AI trust & governance
          </p>
        </div>
        <nav className="flex flex-wrap justify-center gap-6 text-sm font-medium text-on-surface-variant">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-primary-container">
              {l.label}
            </Link>
          ))}
        </nav>
        <p className="text-center text-xs text-on-surface-variant sm:text-right">
          © {new Date().getFullYear()} Verity. Hackathon demo.
        </p>
      </div>
    </footer>
  );
}
