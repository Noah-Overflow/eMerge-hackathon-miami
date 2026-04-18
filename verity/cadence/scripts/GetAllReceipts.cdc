import VerityReceipts from "../contracts/VerityReceipts.cdc"

access(all) fun main(): {String: VerityReceipts.Receipt} {
    return VerityReceipts.receipts
}
