import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read CoveTrade's Terms of Service. Understand the rules, rights, and responsibilities governing use of the CoveTrade platform.",
  alternates: { canonical: "https://covetrades.com/terms" },
  robots: { index: true, follow: false },
  openGraph: { ...defaultOpenGraph, title: "Terms of Service | CoveTrade", url: "https://covetrades.com/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
