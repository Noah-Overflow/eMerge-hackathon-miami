import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

async function hashKey(key: string): Promise<string> {
  const buf = new TextEncoder().encode(key);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

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

export const listApiKeys = query({
  args: {
    userId: v.id("users"),
    orgId: v.id("organizations"),
  },
  handler: async (ctx, { userId, orgId }) => {
    await assertMember(ctx as Parameters<typeof assertMember>[0], userId, orgId);
    return await ctx.db
      .query("apiKeys")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
  },
});

export const createApiKey = mutation({
  args: {
    name: v.string(),
    userId: v.id("users"),
    orgId: v.id("organizations"),
  },
  handler: async (ctx, { name, userId, orgId }) => {
    await assertMember(ctx as Parameters<typeof assertMember>[0], userId, orgId);
    const raw = `sk_verity_${crypto.randomUUID().replace(/-/g, "")}`;
    const hash = await hashKey(raw);
    const prefix = raw.slice(0, 18);
    await ctx.db.insert("apiKeys", {
      orgId,
      prefix,
      hash,
      name,
      createdByUserId: userId,
      createdAt: Date.now(),
    });
    return { key: raw, prefix };
  },
});

export const revokeApiKey = mutation({
  args: {
    apiKeyId: v.id("apiKeys"),
    userId: v.id("users"),
    orgId: v.id("organizations"),
  },
  handler: async (ctx, { apiKeyId, userId, orgId }) => {
    await assertMember(ctx as Parameters<typeof assertMember>[0], userId, orgId);
    const row = await ctx.db.get(apiKeyId);
    if (!row || row.orgId !== orgId) {
      throw new Error("Not found");
    }
    await ctx.db.patch(apiKeyId, { revokedAt: Date.now() });
  },
});
