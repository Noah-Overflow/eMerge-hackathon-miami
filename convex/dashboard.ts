import { query } from "./_generated/server";
import { orgIdFromIdentity } from "./org";

export const listInferenceReceipts = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const orgId = orgIdFromIdentity(identity);
    const rows = await ctx.db
      .query("inferenceReceipts")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(50);
    return rows;
  },
});

export const listDocuments = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];
    const orgId = orgIdFromIdentity(identity);
    const rows = await ctx.db
      .query("documents")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(50);
    return rows;
  },
});
