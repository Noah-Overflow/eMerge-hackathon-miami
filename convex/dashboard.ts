import { query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

async function assertMember(
  ctx: { db: { query: (table: string) => unknown } },
  userId: Id<"users">,
  orgId: Id<"organizations">,
) {
  const db = ctx.db as {
    query: (t: "orgMembers") => {
      withIndex: (name: string, fn: (q: { eq: (f: string, v: unknown) => unknown }) => unknown) => {
        filter: (fn: (q: { eq: (a: unknown, b: unknown) => unknown; field: (f: string) => unknown }) => unknown) => {
          first: () => Promise<unknown>;
        };
      };
    };
  };
  const m = await db
    .query("orgMembers")
    .withIndex("by_org_and_user", (q) => q.eq("orgId", orgId))
    .filter((q) => q.eq(q.field("userId"), userId))
    .first();
  if (!m) throw new Error("Not a member of this organization");
}

export const listInferenceReceipts = query({
  args: {
    userId: v.id("users"),
    orgId: v.id("organizations"),
  },
  handler: async (ctx, { userId, orgId }) => {
    await assertMember(ctx as Parameters<typeof assertMember>[0], userId, orgId);
    return await ctx.db
      .query("inferenceReceipts")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(50);
  },
});

export const listDocuments = query({
  args: {
    userId: v.id("users"),
    orgId: v.id("organizations"),
  },
  handler: async (ctx, { userId, orgId }) => {
    await assertMember(ctx as Parameters<typeof assertMember>[0], userId, orgId);
    return await ctx.db
      .query("documents")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(50);
  },
});

const DAY_MS = 86_400_000;

function utcDayStart(ts: number): number {
  const d = new Date(ts);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}

function isoDayKey(dayStartMs: number): string {
  const d = new Date(dayStartMs);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Last N UTC days (oldest → newest): sealed receipts+docs per day; API keys created per day. */
export const getUsageDaily = query({
  args: {
    userId: v.id("users"),
    orgId: v.id("organizations"),
    days: v.optional(v.number()),
  },
  handler: async (ctx, { userId, orgId, days: daysArg }) => {
    await assertMember(ctx as Parameters<typeof assertMember>[0], userId, orgId);
    const numDays = Math.min(30, Math.max(3, daysArg ?? 7));
    const now = Date.now();
    const todayStart = utcDayStart(now);
    const firstDayStart = todayStart - (numDays - 1) * DAY_MS;

    const seals = new Array<number>(numDays).fill(0);
    const apiCreated = new Array<number>(numDays).fill(0);
    const dayKeys = new Array<string>(numDays);
    for (let i = 0; i < numDays; i++) {
      const start = firstDayStart + i * DAY_MS;
      dayKeys[i] = isoDayKey(start);
    }

    const dayIndex = (ts: number) => {
      const d0 = utcDayStart(ts);
      const idx = Math.round((d0 - firstDayStart) / DAY_MS);
      return idx >= 0 && idx < numDays ? idx : -1;
    };

    const receipts = await ctx.db
      .query("inferenceReceipts")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(500);
    for (const r of receipts) {
      if (r.status !== "sealed") continue;
      const ts = r.sealedAt ?? r.createdAt;
      const idx = dayIndex(ts);
      if (idx >= 0) seals[idx] += 1;
    }

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(500);
    for (const d of documents) {
      if (d.status !== "sealed") continue;
      const ts = d.sealedAt ?? d.createdAt;
      const idx = dayIndex(ts);
      if (idx >= 0) seals[idx] += 1;
    }

    const keys = await ctx.db
      .query("apiKeys")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(500);
    for (const k of keys) {
      const idx = dayIndex(k.createdAt);
      if (idx >= 0) apiCreated[idx] += 1;
    }

    return { dayKeys, seals, apiCreated };
  },
});
