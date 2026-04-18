import { internalMutation, internalQuery } from "./_generated/server";
import { v } from "convex/values";

export const getChallenge = internalQuery({
  args: { challengeId: v.string() },
  handler: async (ctx, { challengeId }) => {
    return await ctx.db
      .query("authChallenges")
      .withIndex("by_challengeId", (q) => q.eq("challengeId", challengeId))
      .unique();
  },
});

export const saveChallenge = internalMutation({
  args: {
    kind: v.union(v.literal("registration"), v.literal("authentication")),
    challengeId: v.string(),
    challenge: v.string(),
    userId: v.optional(v.id("users")),
    expiresAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("authChallenges", {
      ...args,
      createdAt: Date.now(),
    });
  },
});

export const deleteChallenge = internalMutation({
  args: { id: v.id("authChallenges") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});

export const registerUserWithPasskey = internalMutation({
  args: {
    credentialId: v.string(),
    publicKey: v.string(),
    counter: v.number(),
    transports: v.optional(v.array(v.string())),
    displayName: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const userId = await ctx.db.insert("users", {
      displayName: args.displayName,
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.insert("passkeyCredentials", {
      userId,
      credentialId: args.credentialId,
      publicKey: args.publicKey,
      counter: args.counter,
      transports: args.transports,
      createdAt: now,
      lastUsedAt: now,
    });
    const slug = `org-${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
    const orgId = await ctx.db.insert("organizations", {
      name: args.displayName ? `${args.displayName}'s workspace` : "My workspace",
      slug,
      plan: "starter",
      createdAt: now,
    });
    await ctx.db.insert("orgMembers", {
      orgId,
      userId,
      role: "owner",
      createdAt: now,
    });
    return { userId, orgId } as const;
  },
});

export const linkPasskeyToUser = internalMutation({
  args: {
    userId: v.id("users"),
    credentialId: v.string(),
    publicKey: v.string(),
    counter: v.number(),
    transports: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    await ctx.db.patch(args.userId, { updatedAt: now });
    await ctx.db.insert("passkeyCredentials", {
      userId: args.userId,
      credentialId: args.credentialId,
      publicKey: args.publicKey,
      counter: args.counter,
      transports: args.transports,
      createdAt: now,
      lastUsedAt: now,
    });
  },
});

export const updateCredentialCounter = internalMutation({
  args: {
    credentialDbId: v.id("passkeyCredentials"),
    counter: v.number(),
  },
  handler: async (ctx, { credentialDbId, counter }) => {
    await ctx.db.patch(credentialDbId, {
      counter,
      lastUsedAt: Date.now(),
    });
  },
});

export const getCredentialByCredentialId = internalQuery({
  args: { credentialId: v.string() },
  handler: async (ctx, { credentialId }) => {
    return await ctx.db
      .query("passkeyCredentials")
      .withIndex("by_credentialId", (q) => q.eq("credentialId", credentialId))
      .unique();
  },
});

export const getPrimaryOrgForUser = internalQuery({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const m = await ctx.db
      .query("orgMembers")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .first();
    return m?.orgId ?? null;
  },
});
