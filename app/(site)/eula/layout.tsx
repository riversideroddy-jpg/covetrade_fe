import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  title: "End User License Agreement (EULA)",
  description: "VersoTrades's End User License Agreement governing the use of our software and trading platform.",
  alternates: { canonical: "https://versotrades.com/eula" },
  robots: { index: true, follow: false },
  openGraph: { ...defaultOpenGraph, title: "EULA | VersoTrades", url: "https://versotrades.com/eula" },
};

export default function EulaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
