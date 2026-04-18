const scripts = {
  getReceipt: (contractAddress: string) => `
import VerityReceipts from ${contractAddress}

access(all) fun main(receiptID: String): VerityReceipts.Receipt? {
    return VerityReceipts.receipts[receiptID]
}
`,

  getAllReceipts: (contractAddress: string) => `
import VerityReceipts from ${contractAddress}

access(all) fun main(): {String: VerityReceipts.Receipt} {
    return VerityReceipts.receipts
}
`,

  addReceipt: (contractAddress: string) => `
import VerityReceipts from ${contractAddress}

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
`,
}

export default scripts
