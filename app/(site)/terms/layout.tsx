import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Read VersoTrades's Terms of Service. Understand the rules, rights, and responsibilities governing use of the VersoTrades platform.",
  alternates: { canonical: "https://versotrades.com/terms" },
  robots: { index: true, follow: false },
  openGraph: { ...defaultOpenGraph, title: "Terms of Service | VersoTrades", url: "https://versotrades.com/terms" },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
