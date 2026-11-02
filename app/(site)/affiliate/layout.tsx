import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Affiliate Program — Refer & Earn",
  description:
    "Join the VersoTrades affiliate program. Refer traders, earn commissions, and grow your passive income by promoting the world's leading copy trading platform.",
  alternates: { canonical: "https://versotrades.com/affiliate" },
  openGraph: {
    ...defaultOpenGraph,
    title: "VersoTrades Affiliate Program — Refer & Earn",
    description:
      "Refer traders, earn commissions, and grow your passive income with the VersoTrades affiliate program.",
    url: "https://versotrades.com/affiliate",
  },
};

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
