import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read CoveTrade's Terms of Service. Understand the rules, rights, and responsibilities governing use of the CoveTrade platform.",
  alternates: { canonical: "https://covetrade.com/terms" },
  robots: { index: true, follow: false },
  openGraph: { title: "Terms of Service | CoveTrade", url: "https://covetrade.com/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
