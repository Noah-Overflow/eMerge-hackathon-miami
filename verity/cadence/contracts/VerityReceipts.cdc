access(all) contract VerityReceipts {

    access(all) struct Receipt {
        access(all) let receiptID: String
        access(all) let documentHash: String
        access(all) let receiptType: String
        access(all) let metadata: {String: String}
        access(all) let timestamp: UFix64

        init(
            receiptID: String,
            documentHash: String,
            receiptType: String,
            metadata: {String: String},
            timestamp: UFix64
        ) {
            self.receiptID = receiptID
            self.documentHash = documentHash
            self.receiptType = receiptType
            self.metadata = metadata
            self.timestamp = timestamp
        }
    }

    access(all) var receipts: {String: Receipt}

    access(all) fun addReceipt(
        receiptID: String,
        documentHash: String,
        receiptType: String,
        metadata: {String: String}
    ) {
        let r = Receipt(
            receiptID: receiptID,
            documentHash: documentHash,
            receiptType: receiptType,
            metadata: metadata,
            timestamp: getCurrentBlock().timestamp
        )
        VerityReceipts.receipts[receiptID] = r
    }

    init() {
        self.receipts = {}
    }
}
