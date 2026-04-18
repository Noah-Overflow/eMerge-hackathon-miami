package main

import (
	"fmt"

	// dot-import so Overflow helpers are available without the package prefix
	. "github.com/bjartek/overflow/v2"
	"github.com/fatih/color"
)

func section(title string) {
	fmt.Println()
	color.Cyan("══════════════════════════════════════")
	color.Cyan("  %s", title)
	color.Cyan("══════════════════════════════════════")
}

func main() {
	o := Overflow(
		WithGlobalPrintOptions(),
		WithNetwork("emulator"),
	)

	// ── 1. Admin Setup ──────────────────────────────────────────────────────
	section("1 · Setup Verity Admin")
	color.Blue("Registering emulator-account as 'verity-demo' admin")

	o.Tx("SetupVerityAdmin",
		WithSigner("emulator-account"),
		WithArg("adminID", "verity-demo"),
	).Print()

	// ── 2. Anchor a Document Receipt ────────────────────────────────────────
	section("2 · Anchor Document Receipt")

	o.Tx("AddVerityReceipt",
		WithSigner("emulator-account"),
		WithArg("receiptID", "receipt-doc-001"),
		WithArg("documentHash", "sha256:e3b0c44298fc1c149afbf4c8996fb924"),
		WithArg("receiptType", "document"),
		WithArg("metadata", map[string]string{
			"title":  "Q1 Policy Draft",
			"author": "alice",
		}),
	).Print()

	// ── 3. Anchor an Inference Receipt ──────────────────────────────────────
	section("3 · Anchor Inference Receipt")

	o.Tx("AddVerityReceipt",
		WithSigner("emulator-account"),
		WithArg("receiptID", "receipt-inf-001"),
		WithArg("documentHash", "sha256:a665a45920422f9d417e4867efdc4fb8"),
		WithArg("receiptType", "inference"),
		WithArg("metadata", map[string]string{
			"model":      "gpt-4",
			"promptHash": "sha256:abc123",
		}),
	).Print()

	// ── 4. Anchor an Approval Receipt ───────────────────────────────────────
	section("4 · Anchor Approval Receipt")

	o.Tx("AddVerityReceipt",
		WithSigner("emulator-account"),
		WithArg("receiptID", "receipt-apr-001"),
		WithArg("documentHash", "sha256:b14a7b8059d9c055954c92674ce60032"),
		WithArg("receiptType", "approval"),
		WithArg("metadata", map[string]string{
			"approver": "bob",
			"action":   "sign-off",
		}),
	).Print()

	// ── 5. Read a Specific Receipt ──────────────────────────────────────────
	section("5 · GetReceipt (document)")

	o.Script("GetReceipt",
		WithArg("adminID", "verity-demo"),
		WithArg("receiptID", "receipt-doc-001"),
	).Print()

	// ── 6. Read All Receipts for the Admin ──────────────────────────────────
	section("6 · GetAllReceiptsForAdmin")

	o.Script("GetAllReceiptsForAdmin",
		WithArg("adminID", "verity-demo"),
	).Print()

	// ── 7. Registry Snapshot ────────────────────────────────────────────────
	section("7 · GetAdminRegistry")

	o.Script("GetAdminRegistry").Print()

	// ── 8. Delegation Flow ──────────────────────────────────────────────────
	// Requires a second account named "delegate-account" in flow.json.
	// Add it with: flow accounts create --network emulator
	// Then update flow.json and re-run.
	section("8 · Delegate Upload Access (emulator-bob)")

	color.Blue("emulator-account delegates Upload capability to emulator-bob")

	o.Tx("DelegateUploadAccess",
		WithSigner("account"),
		WithArg("recipient", "bob"),
	).Print()

	o.Tx("ClaimUploadDelegate",
		WithSigner("bob"),
		WithArg("provider", "account"),
	).Print()

	o.Tx("AddReceiptAsDelegate",
		WithSigner("ob"),
		WithArg("adminID", "verity-demo"),
		WithArg("receiptID", "receipt-delegated-001"),
		WithArg("documentHash", "sha256:b45f9a1c3e6d8f2a"),
		WithArg("receiptType", "inference"),
		WithArg("metadata", map[string]string{"source": "emulator-bob", "via": "delegate-cap"}),
	).Print()

	fmt.Println()
	color.Green("✓  VerityReceipts task run complete.")
}
