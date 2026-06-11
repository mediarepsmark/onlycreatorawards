import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  title: "OnlyCreatorAwards | Creator Awards and Discovery",
  description:
    "PG creator discovery, annual awards, CreatorStars rankings, fan voting, profile claims, and creator-safe public directories.",
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
