"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const navLinks = [
  { href: "/#product", label: "Product" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/docs", label: "Docs" },
  { href: "/verify", label: "Verify" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/#pricing", label: "Pricing" },
] as const;

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [menuOpen]);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-transparent transition-colors ${
        scrolled
          ? "border-outline-variant/15 bg-surface/80 backdrop-blur-md"
          : "bg-surface"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-2 px-4 py-3 sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <Link
          href="/"
          className="min-w-0 shrink font-display text-base font-semibold tracking-tight text-on-surface sm:text-lg"
          onClick={() => setMenuOpen(false)}
        >
          Verity
        </Link>

        <nav
          className="hidden flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-1 text-sm font-medium text-on-surface-variant md:flex lg:gap-8"
          aria-label="Primary"
        >
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-primary-container">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="/sign-in"
            className="hidden rounded border border-outline-variant/40 px-2 py-2 text-xs font-medium text-on-surface hover:bg-surface-container-low sm:inline-flex sm:px-3 sm:text-sm"
          >
            Sign in
          </Link>
          <Link
            href="/#how-it-works"
            className="hidden items-center gap-1 rounded px-2 py-2 text-xs font-medium text-primary-container hover:bg-surface-container-low md:inline-flex md:px-3 md:text-sm"
          >
            See how it works
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="/dashboard"
            className="hidden rounded bg-gradient-to-r from-primary to-primary-container px-3 py-2 text-sm font-semibold text-on-primary shadow-ambient sm:inline-flex sm:px-4"
          >
            Dashboard
          </Link>
          <button
            type="button"
            className="inline-flex h-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-lg border border-outline-variant/40 text-on-surface md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <span className="text-lg" aria-hidden>
                ×
              </span>
            ) : (
              <span className="flex flex-col gap-1.5 px-0.5" aria-hidden>
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current" />
              </span>
            )}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden" id="mobile-nav">
          <button
            type="button"
            className="absolute inset-0 bg-on-surface/40"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <nav
            className="absolute right-0 top-0 flex h-full w-[min(100%,20rem)] flex-col gap-1 border-l border-outline-variant/20 bg-surface px-4 pb-8 pt-16 shadow-xl"
            aria-label="Mobile primary"
          >
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg px-3 py-3 text-base font-medium text-on-surface hover:bg-surface-container-low"
                onClick={() => setMenuOpen(false)}
              >
                {l.label}
              </Link>
            ))}
            <hr className="my-2 border-outline-variant/20" />
            <Link
              href="/sign-in"
              className="rounded-lg px-3 py-3 text-base font-medium text-on-surface hover:bg-surface-container-low"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
            <Link
              href="/dashboard"
              className="mx-3 mt-2 rounded-lg bg-gradient-to-r from-primary to-primary-container py-3 text-center text-base font-semibold text-on-primary shadow-ambient"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
