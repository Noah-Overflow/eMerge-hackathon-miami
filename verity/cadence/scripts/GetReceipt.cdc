import VerityReceipts from "../contracts/VerityReceipts.cdc"

access(all) fun main(receiptID: String): VerityReceipts.Receipt? {
    return VerityReceipts.receipts[receiptID]
}
