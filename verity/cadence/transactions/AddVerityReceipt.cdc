import VerityReceipts from "../contracts/VerityReceipts.cdc"

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
