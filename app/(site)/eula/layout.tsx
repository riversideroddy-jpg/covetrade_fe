import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "End User License Agreement (EULA)",
  description: "CoveTrade's End User License Agreement governing the use of our software and trading platform.",
  alternates: { canonical: "https://covetrade.com/eula" },
  robots: { index: true, follow: false },
  openGraph: { title: "EULA | CoveTrade", url: "https://covetrade.com/eula" },
};

export default function EulaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
