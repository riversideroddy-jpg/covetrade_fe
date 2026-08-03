import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Risk Disclaimer",
  description: "Important risk disclosures for CoveTrade users. Copy trading and investing in financial markets involves substantial risk of loss.",
  alternates: { canonical: "https://covetrade.com/risk-disclaimer" },
  robots: { index: true, follow: false },
  openGraph: { title: "Risk Disclaimer | CoveTrade", url: "https://covetrade.com/risk-disclaimer" },
};

export default function RiskDisclaimerLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
