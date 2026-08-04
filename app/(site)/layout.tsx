import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: { canonical: "https://covetrades.com" },
  openGraph: {
    ...defaultOpenGraph,
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
