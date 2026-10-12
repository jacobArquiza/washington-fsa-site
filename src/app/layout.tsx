import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import SmoothScroll from "@/components/smooth-scroll";
import "lenis/dist/lenis.css";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
});

// Use the canonical deployment hostname, never a branch preview URL.
const productionUrl = process.env.NEXT_PUBLIC_SITE_URL
  ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? new URL(`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`)
    : new URL("http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: productionUrl,
  title: "Washington Filipino Student Alliance",
  description:
    "Connecting Asian American and Pacific Islander (AAPI) student communities across Washington through culture, collaboration, and leadership.",
  openGraph: {
    type: "website",
    siteName: "Washington Filipino Student Alliance",
    title: "Washington Filipino Student Alliance",
    description:
      "Connecting Asian American and Pacific Islander (AAPI) student communities across Washington through culture, collaboration, and leadership.",
    images: [
      {
        url: "/og/wfsa-social.png",
        width: 1200,
        height: 630,
        alt: "Washington Filipino Student Alliance — Connecting WA through community",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Washington Filipino Student Alliance",
    description:
      "Connecting Asian American and Pacific Islander (AAPI) student communities across Washington through culture, collaboration, and leadership.",
    images: [
      {
        url: "/og/wfsa-social.png",
        alt: "Washington Filipino Student Alliance — Connecting WA through community",
      },
    ],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${newsreader.variable} antialiased`}
    >
      <body id="top" className="min-h-screen">
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll />
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
