import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Integration guide | Verity",
  description:
    "Passkeys, API keys, and REST endpoints to seal documents and AI outputs with Verity.",
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
