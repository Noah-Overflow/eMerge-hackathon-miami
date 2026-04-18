# Verity — Enterprise AI Trust & Governance

> Built at the **eMerge AI Hackathon 2026** · Miami, FL · April 19, 2026

## What is Verity?

Verity is an integrity and audit layer for enterprise AI pipelines. Every document ingested, every model output produced, and every human approval recorded gets a **cryptographic receipt** — tamper-evident, timestamped, and independently verifiable.

When legal asks *"what did the AI say?"*, you have proof.

---

## The problem

Enterprises are deploying AI at scale with no way to answer three questions their compliance teams ask every week:

- Which **exact document version** did the system use when it generated that answer?
- What **model** was running at the time of a specific decision?
- Was the output **modified** after the fact?

Logs in SaaS dashboards are mutable and vendor-controlled. That is not governance. That is liability.

---

## The solution

Verity provides a **REST API** your AI pipeline calls at three moments:

| Moment | Endpoint | What gets sealed |
|--------|----------|-----------------|
| Document ingested | `POST /anchor/document` | Content hash + storage pointer + timestamp |
| Model produces output | `POST /anchor/inference` | Output hash + input doc IDs + model fingerprint |
| Human approves | `POST /anchor/approval` | Reviewer handle + decision + linked receipt |

Each call returns a **receipt ID**. Anyone — a compliance officer, an auditor, a regulator — can verify that receipt at `verity.app/verify/:id` without an account, without installing anything.

---

## Track

**Enterprise AI · AI Safety, Trust & Governance**
eMerge AI Hackathon 2026 — [emergeamericas.com](https://emergeamericas.com)

---

## Tech stack

| Layer | Choice |
|-------|--------|
| Frontend | Next.js 14 (App Router) + Tailwind CSS |
| Design | Google Stitch (AI-generated UI) |
| Auth | WebAuthn passkeys — no email, no wallet |
| Blockchain | Flow (Cadence smart contract, testnet) |
| Account management | Phoenix Wallet API (custodial Flow accounts) |
| Signing | Server-side; enterprise never touches the chain |
| AI surface | OpenAI API (output hash + citation anchoring) |

---

## Architecture

```
Enterprise AI pipeline
        │
        │  POST /anchor/{document|inference|approval}
        ▼
   Verity Backend  ──►  Phoenix signing service  ──►  Flow testnet
        │                                               (Cadence contract)
        │  receiptId + sealedAt
        ▼
   Enterprise app
```

The enterprise's files **never leave their infrastructure**. Verity receives only cryptographic hashes.

---

## Cadence contract (1 contract, 3 event types)

```cadence
// DocumentRegistered  — when a doc/dataset is ingested
// InferenceAnchored   — when an AI output is produced
// HumanApprovalRecorded — when a reviewer signs off
```

---

## Running locally

```bash
git clone https://github.com/noahnaizir/eMerge-hackathon-miami
cd eMerge-hackathon-miami
npm install
npx convex dev
```

In a second terminal:

```bash
npm run dev
```

### Environment variables

**Next.js (`.env.local`, often created by `npx convex dev`)**

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_CONVEX_URL` | Convex deployment URL for `ConvexReactClient` |
| `NEXT_PUBLIC_CONVEX_SITE_URL` | Site URL (optional; used by Convex tooling) |

**Convex deployment (Dashboard → Settings → Environment variables, or `npx convex env set` for single-line values)**

| Variable | Purpose |
|----------|---------|
| `JWT_PRIVATE_KEY` | PEM PKCS#8 **private** key for RS256 session JWTs (must match the public key wired in `convex/auth.config.ts`; multiline PEM is easiest to paste in the dashboard) |
| `WEBAUTHN_RP_ID` | Relying party ID (default `localhost`) |
| `WEBAUTHN_ORIGIN` | Expected WebAuthn origin (default `http://localhost:3000`) |
| `SIGNER_SECRET` | Shared secret for `POST /finalizeSeal` (header `x-verity-signer-secret`) so your Flow signer can mark rows sealed |

**Signer → Convex HTTP**

After deploy, call your Convex HTTP action URL (see [HTTP actions](https://docs.convex.dev/functions/http-actions)) with JSON body:

`{ "orgId": "<organizations id>", "kind": "document" | "inference", "verityDocId"?: "...", "receiptId"?: "...", "flowTxId": "...", "status": "sealed" | "failed", "error"?: "..." }`

---

## Team

- **Noah** — Blockchain & backend

---

## License

MIT
