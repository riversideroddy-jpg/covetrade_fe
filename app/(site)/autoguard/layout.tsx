import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "AutoGuard™ — Smart Trade Protection",
  description:
    "AutoGuard™ by CoveTrade automatically protects every copied trade with intelligent take-profit, stop-loss, and delta-based guardrails. Trade smarter, not harder.",
  alternates: { canonical: "https://covetrades.com/autoguard" },
  openGraph: {
    ...defaultOpenGraph,
    title: "AutoGuard™ — Smart Trade Protection | CoveTrade",
    description:
      "Automatically protect every copied trade with intelligent take-profit, stop-loss, and delta-based guardrails.",
    url: "https://covetrades.com/autoguard",
  },
};

export default function AutoguardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
