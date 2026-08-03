import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AutoGuard™ — Smart Trade Protection",
  description:
    "AutoGuard™ by CoveTrade automatically protects every copied trade with intelligent take-profit, stop-loss, and delta-based guardrails. Trade smarter, not harder.",
  alternates: { canonical: "https://covetrade.com/autoguard" },
  openGraph: {
    title: "AutoGuard™ — Smart Trade Protection | CoveTrade",
    description:
      "Automatically protect every copied trade with intelligent take-profit, stop-loss, and delta-based guardrails.",
    url: "https://covetrade.com/autoguard",
  },
};

export default function AutoguardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
