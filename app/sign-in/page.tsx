"use client";

import { startAuthentication, startRegistration } from "@simplewebauthn/browser";
import { useAction } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";
import { api } from "@/convex/_generated/api";
import { withConvexActionTimeout } from "@/lib/convexActionTimeout";
import { useVeritySession } from "../providers";

const ACTION_TIMEOUT_MS = 14_000;

export default function SignInPage() {
  const router = useRouter();
  const { setSessionToken } = useVeritySession();
  const startReg = useAction(api.passkey.startRegistration);
  const finishReg = useAction(api.passkey.finishRegistration);
  const startAuth = useAction(api.passkey.startAuthentication);
  const finishAuth = useAction(api.passkey.finishAuthentication);
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
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "243e0c",
        },
        body: JSON.stringify({
          sessionId: "243e0c",
          hypothesisId: "H1",
          location: "app/sign-in/page.tsx:register:start",
          message: "Passkey register flow started (before Convex startRegistration)",
          data: {},
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      const { options, challengeId } = await withConvexActionTimeout(
        startReg({
          displayName: displayName.trim() || undefined,
        }),
        ACTION_TIMEOUT_MS,
      );
      // #region agent log
      fetch("http://127.0.0.1:7271/ingest/5e36ee2f-aa8f-4caf-a340-cf30625fa641", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "243e0c",
        },
        body: JSON.stringify({
          sessionId: "243e0c",
          hypothesisId: "H3",
          location: "app/sign-in/page.tsx:register:afterStartReg",
          message: "Convex startRegistration action resolved",
          data: { hasChallengeId: !!challengeId },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
      const response = await startRegistration({ optionsJSON: options });
      const { token } = await withConvexActionTimeout(
        finishReg({
          challengeId,
          response,
          displayName: displayName.trim() || undefined,
        }),
        ACTION_TIMEOUT_MS,
      );
      setSessionToken(token);
      router.push("/dashboard");
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Registration failed";
      // #region agent log
      fetch("http://127.0.0.1:7271/ingest/5e36ee2f-aa8f-4caf-a340-cf30625fa641", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "243e0c",
        },
        body: JSON.stringify({
          sessionId: "243e0c",
          hypothesisId: "H1-H4",
          location: "app/sign-in/page.tsx:register:catch",
          message: "Passkey register flow failed",
          data: {
            errorName: e instanceof Error ? e.name : "unknown",
            errorMessagePrefix: msg.slice(0, 120),
          },
          timestamp: Date.now(),
        }),
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
      const { options, challengeId } = await withConvexActionTimeout(
        startAuth({}),
        ACTION_TIMEOUT_MS,
      );
      const response = await startAuthentication({ optionsJSON: options });
      const { token } = await withConvexActionTimeout(
        finishAuth({ challengeId, response }),
        ACTION_TIMEOUT_MS,
      );
      setSessionToken(token);
      router.push("/dashboard");
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Sign-in failed");
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
        <p className="mt-4 rounded-lg border border-outline-variant/30 bg-surface-container-low/80 px-3 py-2 text-xs leading-relaxed text-on-surface-variant">
          <strong className="font-medium text-on-surface">Local dev:</strong> run{" "}
          <code className="whitespace-nowrap rounded bg-surface-container-high px-1 py-0.5 font-mono text-[11px] text-on-surface">
            npx convex dev
          </code>{" "}
          in a second terminal so the app can reach your Convex backend (passkeys
          use Convex actions).
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
