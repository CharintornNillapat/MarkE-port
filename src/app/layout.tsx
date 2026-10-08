import type { Metadata } from "next";
import { MotionConfig } from "framer-motion";
import { Geist, Geist_Mono, Noto_Sans_Thai, Syne } from "next/font/google";
import { seo } from "@/content/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// DESIGN.MD §3 display face (wide, extended): H1, H2 and the section index.
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

// Only the Thai name needs it; unicode-range loads it on demand, so skip the preload.
const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai"],
  preload: false,
});

// CONTEXT.md §SEO. OG image is TODO there, so link previews get title + description only.
export const metadata: Metadata = {
  metadataBase: new URL(seo.url),
  title: seo.title,
  description: seo.description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", title: seo.title, description: seo.description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} ${notoSansThai.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-bg font-sans text-text">
        {/* Entrance items render hidden until framer-motion runs; without JS they'd stay hidden. */}
        <noscript>
          <style>{"[data-reveal]{opacity:1!important;transform:none!important}"}</style>
        </noscript>
        {/* DESIGN.MD §6: with reduced motion, framer skips transforms and keeps only the fade. */}
        <MotionConfig reducedMotion="user">{children}</MotionConfig>
        {/* Static grain over everything (DESIGN.MD §6); never takes pointer input. */}
        <div aria-hidden className="grain pointer-events-none fixed inset-0 z-50" />
      </body>
    </html>
  );
}
