import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Read CoveTrade's Cookie Policy to understand how we use cookies and similar tracking technologies on our platform.",
  alternates: { canonical: "https://covetrades.com/cookies" },
  robots: { index: true, follow: false },
  openGraph: { ...defaultOpenGraph, title: "Cookie Policy | CoveTrade", url: "https://covetrades.com/cookies" },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
