import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    displayName: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  passkeyCredentials: defineTable({
    userId: v.id("users"),
    credentialId: v.string(),
    publicKey: v.string(),
    counter: v.number(),
    transports: v.optional(v.array(v.string())),
    createdAt: v.number(),
    lastUsedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_credentialId", ["credentialId"]),

  authChallenges: defineTable({
    kind: v.union(v.literal("registration"), v.literal("authentication")),
    challengeId: v.string(),
    challenge: v.string(),
    userId: v.optional(v.id("users")),
    expiresAt: v.number(),
    createdAt: v.number(),
  })
    .index("by_challengeId", ["challengeId"])
    .index("by_expires", ["expiresAt"]),

  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    plan: v.union(
      v.literal("starter"),
      v.literal("growth"),
      v.literal("enterprise"),
    ),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),

  orgMembers: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
    role: v.union(
      v.literal("owner"),
      v.literal("admin"),
      v.literal("member"),
      v.literal("viewer"),
    ),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_user", ["userId"])
    .index("by_org_and_user", ["orgId", "userId"]),

  apiKeys: defineTable({
    orgId: v.id("organizations"),
    prefix: v.string(),
    hash: v.string(),
    name: v.string(),
    createdByUserId: v.id("users"),
    createdAt: v.number(),
    revokedAt: v.optional(v.number()),
    scopes: v.optional(v.array(v.string())),
  })
    .index("by_org", ["orgId"])
    .index("by_hash", ["hash"]),

  documents: defineTable({
    orgId: v.id("organizations"),
    verityDocId: v.string(),
    label: v.string(),
    contentHash: v.string(),
    storageUri: v.optional(v.string()),
    status: v.union(
      v.literal("pending"),
      v.literal("sealed"),
      v.literal("failed"),
    ),
    sealedAt: v.optional(v.number()),
    flowTxId: v.optional(v.string()),
    chainNetwork: v.string(),
    error: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_verityDocId", ["verityDocId"])
    .index("by_org_sealedAt", ["orgId", "sealedAt"]),

  inferenceReceipts: defineTable({
    orgId: v.id("organizations"),
    receiptId: v.string(),
    outputHash: v.string(),
    inputDocIds: v.array(v.string()),
    modelFingerprint: v.string(),
    metadata: v.optional(v.any()),
    status: v.union(
      v.literal("pending"),
      v.literal("sealed"),
      v.literal("failed"),
    ),
    sealedAt: v.optional(v.number()),
    flowTxId: v.optional(v.string()),
    chainNetwork: v.string(),
    error: v.optional(v.string()),
    visibility: v.union(v.literal("org"), v.literal("public")),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_receiptId", ["receiptId"])
    .index("by_org_sealedAt", ["orgId", "sealedAt"]),

  approvals: defineTable({
    orgId: v.id("organizations"),
    linkedReceiptId: v.string(),
    decision: v.union(
      v.literal("approved"),
      v.literal("rejected"),
      v.literal("escalated"),
    ),
    reviewerUserId: v.id("users"),
    status: v.union(
      v.literal("pending"),
      v.literal("sealed"),
      v.literal("failed"),
    ),
    sealedAt: v.optional(v.number()),
    flowTxId: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_linkedReceiptId", ["linkedReceiptId"]),

  verificationEvents: defineTable({
    receiptId: v.string(),
    outcome: v.union(
      v.literal("valid"),
      v.literal("invalid"),
      v.literal("not_found"),
    ),
    at: v.number(),
  })
    .index("by_receiptId", ["receiptId"])
    .index("by_at", ["at"]),

  webhooks: defineTable({
    orgId: v.id("organizations"),
    url: v.string(),
    secretHash: v.string(),
    events: v.array(v.string()),
    enabled: v.boolean(),
    createdAt: v.number(),
  }).index("by_org", ["orgId"]),

  webhookDeliveries: defineTable({
    webhookId: v.id("webhooks"),
    status: v.string(),
    attempts: v.number(),
    nextAttemptAt: v.optional(v.number()),
    lastError: v.optional(v.string()),
    createdAt: v.number(),
  })
    .index("by_webhook", ["webhookId"])
    .index("by_nextAttempt", ["nextAttemptAt"]),
});
