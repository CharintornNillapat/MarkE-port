import type { Metadata } from "next";
import { ArrowLeft } from "lucide-react";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import { ui } from "@/content/site";

export const metadata: Metadata = { title: ui.notFound.title };

// No Navbar: its links are #anchors on the home page. Next adds noindex to this page.
export default function NotFound() {
  return (
    <>
      <main className="relative isolate flex flex-1 items-center">
        <div aria-hidden className="hero-backdrop pointer-events-none absolute inset-0 -z-10" />
        <div className="mx-auto w-full max-w-6xl px-4 py-24 sm:px-6">
          <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{ui.notFound.code}</p>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl">
            {ui.notFound.title}
          </h1>
          <p className="mt-6 max-w-prose text-base leading-relaxed text-text-muted sm:text-lg">
            {ui.notFound.line}
          </p>
          <Button href={ui.notFound.back.href} className="mt-8">
            <ArrowLeft aria-hidden />
            {ui.notFound.back.label}
          </Button>
        </div>
      </main>
      <Footer />
    </>
  );
}
