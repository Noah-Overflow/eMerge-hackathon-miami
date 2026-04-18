import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import { AppProviders } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Verity | Enterprise AI Trust & Governance",
  description:
    "Cryptographically seal AI decisions, documents, and approvals to tamper-evident audit records.",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
