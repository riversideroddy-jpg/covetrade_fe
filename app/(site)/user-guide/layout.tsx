import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Guide â€” Learn How to Copy Trade",
  description:
    "Step-by-step guide to getting started on CoveTrade. Learn how to find top traders, set up copy trading, manage risk, and grow your portfolio.",
  alternates: { canonical: "https://covetrades.com/user-guide" },
  openGraph: {
    title: "CoveTrade User Guide â€” Learn How to Copy Trade",
    description:
      "Step-by-step guide to finding top traders, setting up copy trading, and managing risk on CoveTrade.",
    url: "https://covetrades.com/user-guide",
  },
};

export default function UserGuideLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
