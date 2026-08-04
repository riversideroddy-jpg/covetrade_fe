import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Supported Brokers — Connect Your Brokerage",
  description:
    "CoveTrade integrates with leading brokers worldwide. Connect your existing brokerage account and start copy trading in minutes.",
  alternates: { canonical: "https://covetrades.com/brokers" },
  openGraph: {
    ...defaultOpenGraph,
    title: "Supported Brokers | CoveTrade",
    description:
      "Connect your existing brokerage account and start copy trading in minutes with CoveTrade's broker integrations.",
    url: "https://covetrades.com/brokers",
  },
};

export default function BrokersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
