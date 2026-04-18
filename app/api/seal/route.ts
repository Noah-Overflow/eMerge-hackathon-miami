import { NextRequest, NextResponse } from "next/server"
import { ConvexHttpClient } from "convex/browser"
import { api } from "@/convex/_generated/api"
import { flowService } from "@/services/Flow/flow.service"
import type { Id } from "@/convex/_generated/dataModel"

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-verity-signer-secret")
  if (secret !== process.env.SIGNER_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

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
    await convex.mutation(api.seal.recordSealedReceipt, {
      orgId: orgId as Id<"organizations">,
      receiptId: receiptID,
      outputHash: documentHash,
      inputDocIds: [],
      modelFingerprint: receiptType,
      flowTxId,
      chainNetwork: process.env.FLOW_NETWORK ?? "flow-emulator",
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
