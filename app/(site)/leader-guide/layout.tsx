import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Leader Guide — Grow Your Copier Base",
  description:
    "Everything you need to know about becoming a successful VersoTrades Leader. Tips on strategy, risk management, communication, and growing your copier base.",
  alternates: { canonical: "https://versotrades.com/leader-guide" },
  openGraph: {
    ...defaultOpenGraph,
    title: "VersoTrades Leader Guide — Grow Your Copier Base",
    description:
      "Tips on strategy, risk management, and growing your copier base as a VersoTrades Leader.",
    url: "https://versotrades.com/leader-guide",
  },
};

export default function LeaderGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
