import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { VerifyReceiptClient } from "@/components/verify/VerifyReceiptClient";

export default function VerifyPage() {
  return (
    <>
      <Navbar />
      <Suspense
        fallback={
          <main className="min-h-[calc(100dvh-8rem)] bg-surface px-4 py-12 text-center text-sm text-on-surface-variant sm:px-6">
            <span className="material-symbols-outlined mb-2 inline-block animate-pulse text-3xl text-outline">
              hourglass_empty
            </span>
            <p>Loading verifier…</p>
          </main>
        }
      >
        <VerifyReceiptClient />
      </Suspense>
      <Footer />
    </>
  );
}
