"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 border-b border-transparent transition-colors ${
        scrolled
          ? "border-outline-variant/15 bg-surface/80 backdrop-blur-md"
          : "bg-surface"
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:flex-nowrap sm:gap-4 sm:px-6 sm:py-4 lg:px-8">
        <Link
          href="/"
          className="font-display text-lg font-semibold tracking-tight text-on-surface"
        >
          Verity
        </Link>
        <nav className="flex flex-1 flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs font-medium text-on-surface-variant sm:text-sm md:gap-8">
          <Link href="#product" className="hover:text-primary-container">
            Product
          </Link>
          <Link href="#how-it-works" className="hover:text-primary-container">
            How it works
          </Link>
          <Link href="#pricing" className="hover:text-primary-container">
            Pricing
          </Link>
        </nav>
        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link
            href="#how-it-works"
            className="hidden items-center gap-1 rounded px-2 py-2 text-xs font-medium text-primary-container hover:bg-surface-container-low sm:inline-flex sm:px-3 sm:text-sm"
          >
            See how it works
            <span aria-hidden>→</span>
          </Link>
          <Link
            href="#api-key"
            className="rounded bg-gradient-to-r from-primary to-primary-container px-3 py-2 text-sm font-semibold text-on-primary shadow-ambient sm:px-4"
          >
            Get API Key
          </Link>
        </div>
      </div>
    </header>
  );
}
