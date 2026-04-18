"use client";

import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { ConvexHttpClient } from "convex/browser";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { api } from "@/convex/_generated/api";
import { useVeritySession } from "../providers";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";

export default function SignInPage() {
  const router = useRouter();
  const { setSession } = useVeritySession();
  const [displayName, setDisplayName] = useState("");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState<string | null>(null);

  async function register() {
    setErr(null);
    setBusy("Passkey registration…");
    try {
      // #region agent log
      fetch("http://127.0.0.1:7271/ingest/5e36ee2f-aa8f-4caf-a340-cf30625fa641", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "243e0c" },
        body: JSON.stringify({ sessionId: "243e0c", hypothesisId: "NEW-FLOW", location: "sign-in:register:start", message: "HTTP register start", data: {}, timestamp: Date.now() }),
      }).catch(() => {});
      // #endregion
      const client = new ConvexHttpClient(convexUrl);
      const { options, challengeId } = await client.action(
        api.passkey.startRegistration,
        { displayName: displayName.trim() || undefined },
      );
      const response = await startRegistration({ optionsJSON: options });
      const { userId, orgId } = await client.action(
        api.passkey.finishRegistration,
        { challengeId, response, displayName: displayName.trim() || undefined },
      );
      // #region agent log
      fetch("http://127.0.0.1:7271/ingest/5e36ee2f-aa8f-4caf-a340-cf30625fa641", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "243e0c" },
        body: JSON.stringify({ sessionId: "243e0c", hypothesisId: "NEW-FLOW", location: "sign-in:register:done", message: "HTTP register success", data: { hasUserId: !!userId, hasOrgId: !!orgId }, timestamp: Date.now() }),
      }).catch(() => {});
      // #endregion
      setSession({ userId, orgId });
      router.push("/dashboard");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Registration failed";
      // #region agent log
      fetch("http://127.0.0.1:7271/ingest/5e36ee2f-aa8f-4caf-a340-cf30625fa641", {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "243e0c" },
        body: JSON.stringify({ sessionId: "243e0c", hypothesisId: "NEW-FLOW", location: "sign-in:register:error", message: msg.slice(0, 120), data: {}, timestamp: Date.now() }),
      }).catch(() => {});
      // #endregion
      setErr(msg);
    } finally {
      setBusy("");
    }
  }

  async function login() {
    setErr(null);
    setBusy("Passkey sign-in…");
    try {
      const client = new ConvexHttpClient(convexUrl);
      const { options, challengeId } = await client.action(
        api.passkey.startAuthentication,
        {},
      );
      const response = await startAuthentication({ optionsJSON: options });
      const { userId, orgId } = await client.action(
        api.passkey.finishAuthentication,
        { challengeId, response },
      );
      setSession({ userId, orgId });
      router.push("/dashboard");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Sign-in failed";
      // No account found for this passkey — automatically register instead
      if (msg.includes("Unknown credential")) {
        setBusy("No account found — creating one…");
        try {
          const client = new ConvexHttpClient(convexUrl);
          const { options, challengeId } = await client.action(
            api.passkey.startRegistration,
            { displayName: displayName.trim() || undefined },
          );
          const response = await startRegistration({ optionsJSON: options });
          const { userId, orgId } = await client.action(
            api.passkey.finishRegistration,
            { challengeId, response, displayName: displayName.trim() || undefined },
          );
          setSession({ userId, orgId });
          router.push("/dashboard");
          return;
        } catch (regErr) {
          setErr(regErr instanceof Error ? regErr.message : "Account creation failed");
          return;
        } finally {
          setBusy("");
        }
      }
      setErr(msg);
    } finally {
      setBusy("");
    }
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <h1 className="font-display text-2xl font-bold text-on-surface">
          Sign in with a passkey
        </h1>
        <p className="mt-2 text-sm text-on-surface-variant">
          No email or password. Your first visit creates a workspace automatically.
        </p>
        {err ? (
          <p className="mt-4 rounded-lg border border-error/40 bg-error/10 px-3 py-2 text-sm text-error">
            {err}
          </p>
        ) : null}
        <label className="mt-8 block text-left text-xs font-medium text-on-surface-variant">
          Display name (optional, first-time only)
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="mt-1 w-full rounded-lg border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-sm text-on-surface"
            placeholder="e.g. Legal Ops"
            autoComplete="nickname"
          />
        </label>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => void register()}
            disabled={!!busy}
            className="flex-1 rounded-lg bg-gradient-to-r from-primary to-primary-container px-4 py-3 text-sm font-semibold text-on-primary shadow-ambient disabled:opacity-50"
          >
            {busy === "Passkey registration…" ? busy : "Create account"}
          </button>
          <button
            type="button"
            onClick={() => void login()}
            disabled={!!busy}
            className="flex-1 rounded-lg border border-outline-variant/40 px-4 py-3 text-sm font-semibold text-on-surface disabled:opacity-50"
          >
            {busy === "Passkey sign-in…" ? busy : "Sign in"}
          </button>
        </div>
        <p className="mt-8 text-center text-sm text-on-surface-variant">
          After signing in, open the{" "}
          <Link href="/dashboard" className="font-semibold text-primary-container hover:underline">
            dashboard
          </Link>
          .
        </p>
      </main>
      <Footer />
    </>
  );
}
