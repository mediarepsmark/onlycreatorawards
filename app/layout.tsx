import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "CPCAdvertising.com AI Creatives and Campaign Generation",
  description:
    "Generate creatives, targeting, bids, budgets, and TrafficHaus-ready advertising campaigns from one AI-driven workspace.",
  icons: {
    apple: "/favicon.png",
    icon: "/favicon.png",
    shortcut: "/favicon.png"
  }
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
