import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate Program — Refer & Earn",
  description:
    "Join the CoveTrade affiliate program. Refer traders, earn commissions, and grow your passive income by promoting the world's leading copy trading platform.",
  alternates: { canonical: "https://covetrade.com/affiliate" },
  openGraph: {
    title: "CoveTrade Affiliate Program — Refer & Earn",
    description:
      "Refer traders, earn commissions, and grow your passive income with the CoveTrade affiliate program.",
    url: "https://covetrade.com/affiliate",
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
