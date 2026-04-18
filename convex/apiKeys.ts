import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { orgIdFromIdentity } from "./org";

async function hashKey(key: string): Promise<string> {
  const buf = new TextEncoder().encode(key);
  const digest = await crypto.subtle.digest("SHA-256", buf);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const listApiKeys = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const orgId = orgIdFromIdentity(identity);
    return await ctx.db
      .query("apiKeys")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .collect();
  },
});

export const createApiKey = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = orgIdFromIdentity(identity);
    const userId = identity.subject as Id<"users">;
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
  args: { apiKeyId: v.id("apiKeys") },
  handler: async (ctx, { apiKeyId }) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthenticated");
    const orgId = orgIdFromIdentity(identity);
    const row = await ctx.db.get(apiKeyId);
    if (!row || row.orgId !== orgId) {
      throw new Error("Not found");
    }
    await ctx.db.patch(apiKeyId, { revokedAt: Date.now() });
  },
});
