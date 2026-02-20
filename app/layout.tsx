import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ScopeGuard - Stop Scope Creep Before It Costs You",
  description: "AI-powered meeting analyzer that detects scope creep in real-time. Save $1-5K/month by catching out-of-scope requests before you build them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
