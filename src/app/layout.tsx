import type { Metadata } from "next";
import { Manrope, Newsreader } from "next/font/google";
import SiteHeader from "@/components/site-header";
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

export const metadata: Metadata = {
  title: "Washington Filipino Student Alliance",
  description:
    "Connecting Filipino student communities across Washington State.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} ${newsreader.variable} antialiased`}
    >
      <body className="min-h-screen">
        <SmoothScroll />
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
