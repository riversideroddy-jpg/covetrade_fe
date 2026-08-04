import type { Metadata } from "next";

export const SITE_URL = "https://covetrades.com";

// Next.js does not deep-merge `openGraph`/`twitter` objects across nested
// layouts — a child's `openGraph` fully replaces the parent's. Spread this
// into every page-level `openGraph` override so og:image/site_name/type/
// locale keep showing up instead of only the root layout's homepage.
export const defaultOpenGraph: NonNullable<Metadata["openGraph"]> = {
  type: "website",
  locale: "en_US",
  siteName: "CoveTrade",
  images: [
    {
      url: "/images/og-image.png",
      width: 1200,
      height: 630,
      alt: "CoveTrade — Copy Top Traders. Grow Your Portfolio.",
      type: "image/png",
    },
  ],
};
