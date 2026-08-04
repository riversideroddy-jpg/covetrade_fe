import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about CoveTrade — the world's leading social investment network. Our mission, values, team, and the technology behind precision copy trading.",
  alternates: { canonical: "https://covetrades.com/about" },
  openGraph: {
    ...defaultOpenGraph,
    title: "About CoveTrade — The World's Leading Social Investment Network",
    description:
      "Our mission, values, and the technology behind precision copy trading. Meet the team building the future of social investing.",
    url: "https://covetrades.com/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
