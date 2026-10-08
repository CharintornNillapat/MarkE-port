import type { ReactNode } from "react";
import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Section } from "@/components/layout/Section";
import { Hero } from "@/components/sections/Hero";
import { Work } from "@/components/sections/Work";
import { visibleSections, type Section as SectionData } from "@/content/site";

export default function Home() {
  // Section bodies by id; a section without one still renders its eyebrow and heading.
  const content: Partial<Record<SectionData["id"], ReactNode>> = { work: <Work /> };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        {visibleSections.map((section, i) => (
          <Section key={section.id} {...section} number={i + 1}>
            {content[section.id]}
          </Section>
        ))}
      </main>
      <Footer />
    </>
  );
}
