/**
 * Quick test: sends an AddVerityReceipt transaction to the Flow Account Manager.
 * Run with:  node --env-file=.env.local test-flow.mjs
 */

const BASE_URL = process.env.BLOCKCHAIN_API_URL?.replace(/\/$/, "")
if (!BASE_URL) {
  console.error("❌  BLOCKCHAIN_API_URL not set in .env.local")
  process.exit(1)
}

const ACCOUNT = "0x0e964e9e2b53ed06"
const CONTRACT = "0x0e964e9e2b53ed06"

const cadenceString = (v) => ({ type: "String", value: v })
const cadenceDict = (obj) => ({
  type: "Dictionary",
  value: Object.entries(obj).map(([k, v]) => ({
    key: cadenceString(k),
    value: cadenceString(v),
  })),
})

const TEST_RECEIPT = {
  receiptID: `test-receipt-${Date.now()}`,
  documentHash: "sha256:abc123deadbeef",
  receiptType: "inference",
  metadata: { model: "gpt-4o", promptHash: "sha256:testprompt", source: "hackathon-test" },
}

const CADENCE_TX = `
import VerityReceipts from ${CONTRACT}

transaction(
    receiptID: String,
    documentHash: String,
    receiptType: String,
    metadata: {String: String}
) {
    prepare(signer: &Account) {}
    execute {
        VerityReceipts.addReceipt(
            receiptID: receiptID,
            documentHash: documentHash,
            receiptType: receiptType,
            metadata: metadata
        )
    }
}
`

async function run() {
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log("  Verity — Flow Transaction Test (mainnet)")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
  console.log(`  API:      ${BASE_URL}`)
  console.log(`  Account:  ${ACCOUNT}`)
  console.log(`  Contract: ${CONTRACT}`)
  console.log(`  Receipt:  ${TEST_RECEIPT.receiptID}`)
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")

  const body = {
    code: CADENCE_TX,
    arguments: [
      cadenceString(TEST_RECEIPT.receiptID),
      cadenceString(TEST_RECEIPT.documentHash),
      cadenceString(TEST_RECEIPT.receiptType),
      cadenceDict(TEST_RECEIPT.metadata),
    ],
  }

  console.log("📤  Sending transaction…")
  const res = await fetch(`${BASE_URL}/v1/accounts/${ACCOUNT}/transactions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  })

  const text = await res.text()
  let data
  try { data = JSON.parse(text) } catch { data = text }

  console.log(`\n📬  Status: ${res.status} ${res.statusText}`)
  console.log("📦  Response:")
  console.log(JSON.stringify(data, null, 2))

  if (!res.ok) {
    console.log("\n❌  Transaction failed")
    process.exit(1)
  }

  const txId = data?.transactionId ?? data?.id ?? data?.jobId
  const jobId = data?.jobId
  console.log(`\n✅  Transaction submitted! txId: ${txId}`)
  console.log(`🔍  Flowscan: https://www.flowscan.io/tx/${txId}`)

  if (jobId) await pollJob(jobId, txId)
}

async function pollJob(jobId, txId) {
  console.log("\n⏳  Polling job status…")
  for (let i = 0; i < 15; i++) {
    await new Promise((r) => setTimeout(r, 2000))
    const res = await fetch(`${BASE_URL}/v1/jobs/${jobId}`)
    if (!res.ok) break
    const job = await res.json()
    const state = job?.state ?? "unknown"
    console.log(`  [${i + 1}] state: ${state}${job?.error ? " | error: " + job.error : ""}`)
    if (state === "COMPLETE") {
      console.log(`\n🎉  Done! Receipt anchored on-chain.`)
      console.log(`🔍  Flowscan: https://www.flowscan.io/tx/${txId}`)
      return
    }
    if (state === "FAILED" || state === "ERROR") {
      console.log("\n💥  Job failed:")
      console.log(JSON.stringify(job, null, 2))
      return
    }
  }
}

run().catch((err) => {
  console.error("❌  Unexpected error:", err.message)
  process.exit(1)
})
