import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Read CoveTrade's Privacy Policy. Learn how we collect, use, and protect your personal data in compliance with GDPR and global privacy standards.",
  alternates: { canonical: "https://covetrades.com/privacy" },
  robots: { index: true, follow: false },
  openGraph: { title: "Privacy Policy | CoveTrade", url: "https://covetrades.com/privacy" },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
