import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Verify Your Identity",
  description: "Enter your two-factor authentication code to securely log in to your CoveTrade account.",
  robots: { index: false, follow: false },
};

export default function Verify2FALayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
