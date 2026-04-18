"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const SESSION_KEY = "verity_session";
const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL ?? "";
const convex = convexUrl ? new ConvexReactClient(convexUrl) : new ConvexReactClient("https://placeholder.convex.cloud");

type Session = { userId: string; orgId: string };

type SessionApi = {
  userId: string | null;
  orgId: string | null;
  setSession: (s: Session) => void;
  clearSession: () => void;
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
  const [session, setSessionState] = useState<Session | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Session;
        if (parsed.userId && parsed.orgId) {
          setSessionState(parsed);
          // #region agent log
          fetch("http://127.0.0.1:7271/ingest/5e36ee2f-aa8f-4caf-a340-cf30625fa641", {
            method: "POST",
            headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "243e0c" },
            body: JSON.stringify({ sessionId: "243e0c", hypothesisId: "NEW-FLOW", location: "app/providers.tsx:hydrate", message: "Session restored from localStorage", data: { hasUserId: !!parsed.userId, hasOrgId: !!parsed.orgId }, timestamp: Date.now() }),
          }).catch(() => {});
          // #endregion
        }
      }
    } catch { /* localStorage unavailable */ }
  }, []);

  const setSession = useCallback((s: Session) => {
    setSessionState(s);
    try { localStorage.setItem(SESSION_KEY, JSON.stringify(s)); } catch { /* */ }
    // #region agent log
    fetch("http://127.0.0.1:7271/ingest/5e36ee2f-aa8f-4caf-a340-cf30625fa641", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Debug-Session-Id": "243e0c" },
      body: JSON.stringify({ sessionId: "243e0c", hypothesisId: "NEW-FLOW", location: "app/providers.tsx:setSession", message: "Session set after passkey", data: { hasUserId: !!s.userId, hasOrgId: !!s.orgId }, timestamp: Date.now() }),
    }).catch(() => {});
    // #endregion
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
    try { localStorage.removeItem(SESSION_KEY); } catch { /* */ }
  }, []);

  const api = useMemo(
    () => ({
      userId: session?.userId ?? null,
      orgId: session?.orgId ?? null,
      setSession,
      clearSession,
    }),
    [session, setSession, clearSession],
  );

  return (
    <SessionContext.Provider value={api}>
      <ConvexProvider client={convex}>
        {children}
      </ConvexProvider>
    </SessionContext.Provider>
  );
}
