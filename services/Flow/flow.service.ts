import scripts from "./scripts"

const BLOCKCHAIN_API_URL = process.env.BLOCKCHAIN_API_URL!
const FLOW_ACCOUNT_ADDRESS = "0x0e964e9e2b53ed06"
const FLOW_CONTRACT_ADDRESS = "0x0e964e9e2b53ed06"

export interface FlowReceipt {
  receiptID: string
  documentHash: string
  receiptType: string
  metadata: Record<string, string>
  timestamp: string
}

function metadataToJsonCadence(metadata: Record<string, string>) {
  return {
    type: "Dictionary",
    value: Object.entries(metadata).map(([k, v]) => ({
      key: { type: "String", value: k },
      value: { type: "String", value: v },
    })),
  }
}

function extractFlowTxId(responseData: Record<string, unknown>): string {
  if (typeof responseData.id === "string") return responseData.id
  if (typeof responseData.transactionId === "string") return responseData.transactionId
  if (typeof responseData.jobId === "string") return responseData.jobId
  return JSON.stringify(responseData).slice(0, 64)
}

class FlowService {
  async addReceipt(
    receiptID: string,
    documentHash: string,
    receiptType: string,
    metadata: Record<string, string>,
  ): Promise<string> {
    const body = {
      code: scripts.addReceipt(FLOW_CONTRACT_ADDRESS),
      arguments: [
        { type: "String", value: receiptID },
        { type: "String", value: documentHash },
        { type: "String", value: receiptType },
        metadataToJsonCadence(metadata),
      ],
    }

    const response = await fetch(
      `${BLOCKCHAIN_API_URL}/v1/accounts/${FLOW_ACCOUNT_ADDRESS}/transactions`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    )

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(
        `Blockchain API error: ${response.status} ${response.statusText} - ${errorText}`,
      )
    }

    const data = (await response.json()) as Record<string, unknown>
    return extractFlowTxId(data)
  }

  async getReceipt(receiptID: string): Promise<FlowReceipt | null> {
    const body = {
      code: scripts.getReceipt(FLOW_CONTRACT_ADDRESS),
      arguments: [{ type: "String", value: receiptID }],
    }

    const response = await fetch(`${BLOCKCHAIN_API_URL}/v1/scripts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(
        `Blockchain API error: ${response.status} ${response.statusText} - ${errorText}`,
      )
    }

    const data = (await response.json()) as Record<string, unknown> | null
    if (!data || data.type === "Optional" && data.value === null) return null
    return data as unknown as FlowReceipt
  }

  async getAllReceipts(): Promise<Record<string, FlowReceipt>> {
    const body = {
      code: scripts.getAllReceipts(FLOW_CONTRACT_ADDRESS),
      arguments: [],
    }

    const response = await fetch(`${BLOCKCHAIN_API_URL}/v1/scripts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      const errorText = await response.text().catch(() => "Unknown error")
      throw new Error(
        `Blockchain API error: ${response.status} ${response.statusText} - ${errorText}`,
      )
    }

    const data = (await response.json()) as Record<string, unknown>
    return data as unknown as Record<string, FlowReceipt>
  }
}

export const flowService = new FlowService()
