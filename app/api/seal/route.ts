import { NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { flowService } from "@/services/Flow/flow.service"
import type { Id } from "@/convex/_generated/dataModel"

let convex: ConvexHttpClient | null = null
function getConvex() {
  if (!convex) {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL
    if (!url) throw new Error("NEXT_PUBLIC_CONVEX_URL is not set")
    convex = new ConvexHttpClient(url)
  }
  return convex
}

export async function POST(req: NextRequest) {
  let body: {
    receiptID: string
    documentHash: string
    receiptType: string
    metadata: Record<string, string>
    orgId: string
    visibility?: "org" | "public"
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
  }

  const { receiptID, documentHash, receiptType, metadata, orgId, visibility = "public" } = body

  if (!receiptID || !documentHash || !receiptType || !orgId) {
    return NextResponse.json(
      { error: "Missing required fields: receiptID, documentHash, receiptType, orgId" },
      { status: 400 },
    )
  }

  let flowTxId: string
  try {
    flowTxId = await flowService.addReceipt(receiptID, documentHash, receiptType, metadata ?? {})
  } catch (err) {
    const message = err instanceof Error ? err.message : "Flow transaction failed"
    return NextResponse.json({ error: message }, { status: 502 })
  }

  try {
    await getConvex().mutation(api.seal.recordSealedReceipt, {
      orgId: orgId as Id<"organizations">,
      receiptId: receiptID,
      outputHash: documentHash,
      inputDocIds: [],
      modelFingerprint: receiptType,
      flowTxId,
      chainNetwork: "flow-mainnet",
      visibility,
      metadata,
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Convex mutation failed"
    return NextResponse.json(
      { error: `Flow tx succeeded (${flowTxId}) but Convex record failed: ${message}` },
      { status: 500 },
    )
  }

  return NextResponse.json({ ok: true, flowTxId, receiptID })
}
