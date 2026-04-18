import { CodeBlock } from "@/components/docs/CodeBlock";
import { GuideSectionsEnd } from "@/components/docs/GuideSectionsEnd";

export function GuideSections() {
  return (
    <div className="space-y-16 sm:space-y-20">
      <section id="step-account" className="scroll-mt-28">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high font-display text-sm font-bold text-primary-container">
            1
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold text-on-surface sm:text-2xl">
              Create your account
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant sm:text-base">
              Secure your workspace with passkey-first authentication. No shared
              passwords; biometrics stay on the device.
            </p>
            <div className="mt-6 rounded-lg border-l-4 border-secondary-container bg-surface-container-lowest p-5 shadow-ambient">
              <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                Passkey sign-in
              </p>
              <p className="mt-2 text-sm text-on-surface">
                Authenticate with Face ID, Touch ID, or Windows Hello to continue.
              </p>
              <p className="mt-3 text-xs text-on-surface-variant">
                Verity uses WebAuthn. Private keys never leave the user&apos;s device;
                we only store the public credential.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="step-api-key" className="scroll-mt-28">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high font-display text-sm font-bold text-primary-container">
            2
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold text-on-surface sm:text-2xl">
              Get your API key
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant sm:text-base">
              Generate a key per environment. Store it in secrets — never commit
              to source control.
            </p>
            <div className="mt-6 rounded-lg bg-surface-container-low p-4 sm:p-5">
              <p className="text-xs font-medium text-on-surface-variant">
                Production key (example)
              </p>
              <p className="mt-2 font-mono text-sm text-on-surface">
                sk-verity-6f9a…8h2k
              </p>
            </div>
            <p className="mt-2 text-xs text-on-surface-variant">terminal — bash</p>
            <CodeBlock
              code={`# Set environment variable
export VERITY_API_KEY=sk-verity-6f9a...8h2k`}
            />
          </div>
        </div>
      </section>

      <section id="step-document" className="scroll-mt-28">
        <div className="flex items-start gap-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-high font-display text-sm font-bold text-primary-container">
            3
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-display text-xl font-bold text-on-surface sm:text-2xl">
              Register a document
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-on-surface-variant sm:text-base">
              When your pipeline ingests a PDF, policy, or dataset, send its
              content hash (and optional storage pointer). Verity returns a
              document id for later inference receipts.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3 rounded-lg bg-secondary-container/20 px-4 py-3 text-sm font-medium text-on-secondary-container">
              <span aria-hidden>✓</span>
              Seal successful · Status: sealed
            </div>
            <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-on-surface-variant">Receipt ID</dt>
                <dd className="mt-1 font-mono text-on-surface">rec_doc_920…31a</dd>
              </div>
              <div>
                <dt className="text-on-surface-variant">Sealed at</dt>
                <dd className="mt-1 font-mono text-on-surface">2026-04-18T14:22:01Z</dd>
              </div>
            </dl>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              POST /anchor/document
            </p>
            <CodeBlock
              code={`curl -X POST https://api.verity.app/anchor/document \\
  -H "Authorization: Bearer $VERITY_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "content_hash": "sha256:…",
    "label": "HR Policy v2",
    "storage_uri": "s3://your-bucket/policy-v2.pdf"
  }'`}
            />
          </div>
        </div>
      </section>

      <GuideSectionsEnd />
    </div>
  );
}
