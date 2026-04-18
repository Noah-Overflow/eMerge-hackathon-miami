"use client";

import {
  ConvexProviderWithAuth,
  ConvexReactClient,
} from "convex/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const SESSION_KEY = "verity_convex_token";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
const convex = new ConvexReactClient(convexUrl);

type SessionApi = {
  setSessionToken: (token: string | null) => void;
};

const SessionContext = createContext<SessionApi | null>(null);

export function useVeritySession() {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error("useVeritySession must be used within AppProviders");
  }
  return ctx;
}

export function AppProviders({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let hadStoredSession = false;
    try {
      const stored = sessionStorage.getItem(SESSION_KEY);
      if (stored) {
        setToken(stored);
        hadStoredSession = true;
      }
    } catch {
      /* sessionStorage unavailable */
    }
    setReady(true);
    // #region agent log
    {
      let convexHost = "empty-url";
      try {
        if (convexUrl) convexHost = new URL(convexUrl).hostname;
      } catch {
        convexHost = "invalid-url";
      }
      fetch("http://127.0.0.1:7271/ingest/5e36ee2f-aa8f-4caf-a340-cf30625fa641", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Debug-Session-Id": "243e0c",
        },
        body: JSON.stringify({
          sessionId: "243e0c",
          hypothesisId: "H2",
          location: "app/providers.tsx:hydrate",
          message: "Convex client URL host after session hydrate",
          data: { convexHost, hadStoredSession },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
    }
    // #endregion
  }, []);

  const setSessionToken = useCallback((next: string | null) => {
    setToken(next);
    try {
      if (next) sessionStorage.setItem(SESSION_KEY, next);
      else sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* */
    }
  }, []);

  const useAuth = useCallback(
    () => ({
      isLoading: !ready,
      isAuthenticated: !!token,
      fetchAccessToken: async () => token,
    }),
    [ready, token],
  );

  const session = useMemo(
    () => ({ setSessionToken }),
    [setSessionToken],
  );

  return (
    <SessionContext.Provider value={session}>
      <ConvexProviderWithAuth client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithAuth>
    </SessionContext.Provider>
  );
}
