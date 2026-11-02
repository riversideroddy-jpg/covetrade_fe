import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Consent & Cookie Preferences",
  description: "Manage your data consent and cookie preferences on VersoTrades.",
  alternates: { canonical: "https://versotrades.com/consent" },
  robots: { index: false, follow: false },
};

export default function ConsentLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
