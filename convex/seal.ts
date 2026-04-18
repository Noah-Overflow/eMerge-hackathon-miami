import { internalMutation } from "./_generated/server";
import { v } from "convex/values";
export const finalizeSeal = internalMutation({
  args: {
    orgId: v.id("organizations"),
    kind: v.union(v.literal("document"), v.literal("inference")),
    verityDocId: v.optional(v.string()),
    receiptId: v.optional(v.string()),
    flowTxId: v.string(),
    status: v.union(v.literal("sealed"), v.literal("failed")),
    error: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    if (args.kind === "document") {
      if (!args.verityDocId) throw new Error("verityDocId required");
      const doc = await ctx.db
        .query("documents")
        .withIndex("by_verityDocId", (q) =>
          q.eq("verityDocId", args.verityDocId!),
        )
        .unique();
      if (!doc || doc.orgId !== args.orgId) {
        throw new Error("Document not found");
      }
      await ctx.db.patch(doc._id, {
        status: args.status,
        flowTxId: args.flowTxId,
        sealedAt: args.status === "sealed" ? now : undefined,
        error: args.error,
      });
      return { ok: true as const };
    }
    if (!args.receiptId) throw new Error("receiptId required");
    const rec = await ctx.db
      .query("inferenceReceipts")
      .withIndex("by_receiptId", (q) => q.eq("receiptId", args.receiptId!))
      .unique();
    if (!rec || rec.orgId !== args.orgId) {
      throw new Error("Receipt not found");
    }
    await ctx.db.patch(rec._id, {
      status: args.status,
      flowTxId: args.flowTxId,
      sealedAt: args.status === "sealed" ? now : undefined,
      error: args.error,
    });
    return { ok: true as const };
  },
});

export const createPendingDocument = internalMutation({
  args: {
    orgId: v.id("organizations"),
    verityDocId: v.string(),
    label: v.string(),
    contentHash: v.string(),
    storageUri: v.optional(v.string()),
    chainNetwork: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documents", {
      orgId: args.orgId,
      verityDocId: args.verityDocId,
      label: args.label,
      contentHash: args.contentHash,
      storageUri: args.storageUri,
      status: "pending",
      chainNetwork: args.chainNetwork,
      createdAt: Date.now(),
    });
  },
});

export const createPendingInference = internalMutation({
  args: {
    orgId: v.id("organizations"),
    receiptId: v.string(),
    outputHash: v.string(),
    inputDocIds: v.array(v.string()),
    modelFingerprint: v.string(),
    chainNetwork: v.string(),
    visibility: v.union(v.literal("org"), v.literal("public")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("inferenceReceipts", {
      orgId: args.orgId,
      receiptId: args.receiptId,
      outputHash: args.outputHash,
      inputDocIds: args.inputDocIds,
      modelFingerprint: args.modelFingerprint,
      status: "pending",
      chainNetwork: args.chainNetwork,
      visibility: args.visibility,
      createdAt: Date.now(),
    });
  },
});
