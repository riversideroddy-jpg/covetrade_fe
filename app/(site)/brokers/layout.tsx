import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Supported Brokers — Connect Your Brokerage",
  description:
    "CoveTrade integrates with leading brokers worldwide. Connect your existing brokerage account and start copy trading in minutes.",
  alternates: { canonical: "https://covetrade.com/brokers" },
  openGraph: {
    title: "Supported Brokers | CoveTrade",
    description:
      "Connect your existing brokerage account and start copy trading in minutes with CoveTrade's broker integrations.",
    url: "https://covetrade.com/brokers",
  },
};

export default function BrokersLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
