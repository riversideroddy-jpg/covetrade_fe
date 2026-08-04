import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Risk Disclaimer",
  description: "Important risk disclosures for CoveTrade users. Copy trading and investing in financial markets involves substantial risk of loss.",
  alternates: { canonical: "https://covetrades.com/risk-disclaimer" },
  robots: { index: true, follow: false },
  openGraph: { ...defaultOpenGraph, title: "Risk Disclaimer | CoveTrade", url: "https://covetrades.com/risk-disclaimer" },
};

export default function RiskDisclaimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
