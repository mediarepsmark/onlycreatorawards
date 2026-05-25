import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "CPCAdvertising.com AI Creatives and Campaign Generation",
  description:
    "Generate creatives, targeting, bids, budgets, and TrafficHaus-ready advertising campaigns from one AI-driven workspace."
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
