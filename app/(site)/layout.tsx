import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://covetrade.com" },
  openGraph: {
    url: "https://covetrade.com",
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
