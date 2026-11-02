import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "User Guide — Learn How to Copy Trade",
  description:
    "Step-by-step guide to getting started on VersoTrades. Learn how to find top traders, set up copy trading, manage risk, and grow your portfolio.",
  alternates: { canonical: "https://versotrades.com/user-guide" },
  openGraph: {
    ...defaultOpenGraph,
    title: "VersoTrades User Guide — Learn How to Copy Trade",
    description:
      "Step-by-step guide to finding top traders, setting up copy trading, and managing risk on VersoTrades.",
    url: "https://versotrades.com/user-guide",
  },
};

export default function UserGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
