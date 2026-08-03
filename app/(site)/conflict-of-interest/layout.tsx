import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Conflict of Interest Policy",
  description: "CoveTrade's Conflict of Interest Policy — how we identify, manage, and disclose potential conflicts in our trading platform.",
  alternates: { canonical: "https://covetrade.com/conflict-of-interest" },
  robots: { index: true, follow: false },
  openGraph: { title: "Conflict of Interest Policy | CoveTrade", url: "https://covetrade.com/conflict-of-interest" },
};

export default function ConflictLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
