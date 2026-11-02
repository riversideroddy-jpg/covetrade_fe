import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Supported Brokers — Connect Your Brokerage",
  description:
    "VersoTrades integrates with leading brokers worldwide. Connect your existing brokerage account and start copy trading in minutes.",
  alternates: { canonical: "https://versotrades.com/brokers" },
  openGraph: {
    ...defaultOpenGraph,
    title: "Supported Brokers | VersoTrades",
    description:
      "Connect your existing brokerage account and start copy trading in minutes with VersoTrades's broker integrations.",
    url: "https://versotrades.com/brokers",
  },
};

export default function BrokersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
