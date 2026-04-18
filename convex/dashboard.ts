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
