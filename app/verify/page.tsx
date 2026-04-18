import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import Link from "next/link";

export default function VerifyPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-4 py-16 text-center sm:px-6">
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Public verifier
        </h1>
        <p className="mt-3 text-sm text-on-surface-variant">
          Paste a receipt ID to verify integrity. Wire this to your API during the
          hackathon build.
        </p>
        <Link
          href="/docs#step-verify"
          className="mt-8 inline-block text-sm font-semibold text-primary-container hover:underline"
        >
          ← Back to integration guide
        </Link>
      </main>
      <Footer />
    </>
  );
}
