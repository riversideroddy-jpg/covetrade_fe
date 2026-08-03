import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "Read CoveTrade's Cookie Policy to understand how we use cookies and similar tracking technologies on our platform.",
  alternates: { canonical: "https://covetrade.com/cookies" },
  robots: { index: true, follow: false },
  openGraph: { title: "Cookie Policy | CoveTrade", url: "https://covetrade.com/cookies" },
};

export default function CookiesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
