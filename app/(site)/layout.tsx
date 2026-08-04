import type { Metadata } from "next";

export const metadata: Metadata = {
  alternates: { canonical: "https://covetrades.com" },
  openGraph: {
    url: "https://covetrades.com",
  },
};

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <>{children}</>;
}
