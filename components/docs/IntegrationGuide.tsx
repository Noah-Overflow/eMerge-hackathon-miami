import { DocsSidebar } from "@/components/docs/DocsSidebar";
import { GuideSections } from "@/components/docs/GuideSections";
import Link from "next/link";

const steps = ["Connect", "Auth", "Anchor", "Record", "Verify"];

export function IntegrationGuide() {
  return (
    <div className="min-h-[60vh] bg-surface pb-20 pt-6 sm:pt-10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-on-surface-variant sm:text-sm" aria-label="Breadcrumb">
          <ol className="flex flex-wrap items-center gap-1">
            <li>
              <Link href="/" className="hover:text-primary-container">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <span className="text-on-surface">Integration guide</span>
            </li>
          </ol>
        </nav>
        <h1 className="mt-4 font-display text-3xl font-bold tracking-tight text-on-surface sm:text-4xl">
          Enterprise integration guide
        </h1>
        <p className="mt-3 max-w-2xl text-sm text-on-surface-variant sm:text-base">
          Set up Verity in your AI pipeline in under 30 minutes. REST only — no
          client-side blockchain work required.
        </p>
        <ol className="mt-8 flex gap-2 overflow-x-auto pb-2 lg:hidden">
          {steps.map((label, i) => (
            <li
              key={label}
              className="shrink-0 rounded-full bg-surface-container-low px-3 py-1 text-xs font-medium text-on-surface-variant"
            >
              {i + 1}. {label}
            </li>
          ))}
        </ol>
        <div className="mt-10 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-12">
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              <DocsSidebar />
            </div>
          </aside>
          <GuideSections />
        </div>
        <div className="mt-10 lg:hidden">
          <DocsSidebar />
        </div>
      </div>
    </div>
  );
}
