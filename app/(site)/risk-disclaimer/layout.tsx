import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Risk Disclaimer",
  description: "Important risk disclosures for VersoTrades users. Copy trading and investing in financial markets involves substantial risk of loss.",
  alternates: { canonical: "https://versotrades.com/risk-disclaimer" },
  robots: { index: true, follow: false },
  openGraph: { ...defaultOpenGraph, title: "Risk Disclaimer | VersoTrades", url: "https://versotrades.com/risk-disclaimer" },
};

export default function RiskDisclaimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
