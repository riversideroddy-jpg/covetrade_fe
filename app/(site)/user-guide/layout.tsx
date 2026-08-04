import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "User Guide — Learn How to Copy Trade",
  description:
    "Step-by-step guide to getting started on CoveTrade. Learn how to find top traders, set up copy trading, manage risk, and grow your portfolio.",
  alternates: { canonical: "https://covetrades.com/user-guide" },
  openGraph: {
    ...defaultOpenGraph,
    title: "CoveTrade User Guide — Learn How to Copy Trade",
    description:
      "Step-by-step guide to finding top traders, setting up copy trading, and managing risk on CoveTrade.",
    url: "https://covetrades.com/user-guide",
  },
};

export default function UserGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
