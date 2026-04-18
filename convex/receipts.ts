import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";

export const getReceiptById = query({
  args: { receiptId: v.string(), orgId: v.optional(v.id("organizations")) },
  handler: async (ctx, { receiptId, orgId }) => {
    const row = await ctx.db
      .query("inferenceReceipts")
      .withIndex("by_receiptId", (q) => q.eq("receiptId", receiptId))
      .unique();
    if (!row) {
      return { found: false as const };
    }
    if (row.visibility === "public") {
      return {
        found: true as const,
        receiptId: row.receiptId,
        outputHash: row.outputHash,
        inputDocIds: row.inputDocIds,
        modelFingerprint: row.modelFingerprint,
        status: row.status,
        sealedAt: row.sealedAt,
        flowTxId: row.flowTxId,
        chainNetwork: row.chainNetwork,
        createdAt: row.createdAt,
      };
    }
    // Private receipts are not accessible without an orgId — return not-found
    if (row.orgId !== orgId) {
      return { found: false as const };
    }
    return {
      found: true as const,
      receiptId: row.receiptId,
      outputHash: row.outputHash,
      inputDocIds: row.inputDocIds,
      modelFingerprint: row.modelFingerprint,
      status: row.status,
      sealedAt: row.sealedAt,
      flowTxId: row.flowTxId,
      chainNetwork: row.chainNetwork,
      createdAt: row.createdAt,
    };
  },
});

export const createDemoInferenceReceipt = mutation({
  args: {
    orgId: v.id("organizations"),
  },
  handler: async (ctx, { orgId }) => {
    const receiptId = `rec_${crypto.randomUUID().replace(/-/g, "").slice(0, 16)}`;
    await ctx.db.insert("inferenceReceipts", {
      orgId,
      receiptId,
      outputHash: "sha256:demo",
      inputDocIds: ["doc_demo"],
      modelFingerprint: "demo-model",
      status: "sealed",
      sealedAt: Date.now(),
      flowTxId: "0xdemo",
      chainNetwork: "flow-testnet",
      visibility: "public",
      createdAt: Date.now(),
    });
    return { receiptId };
  },
});

export const recordVerificationEvent = mutation({
  args: {
    receiptId: v.string(),
    outcome: v.union(
      v.literal("valid"),
      v.literal("invalid"),
      v.literal("not_found"),
    ),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("verificationEvents", {
      receiptId: args.receiptId,
      outcome: args.outcome,
      at: Date.now(),
    });
  },
});
