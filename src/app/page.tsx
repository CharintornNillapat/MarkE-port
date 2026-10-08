import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Section } from "@/components/layout/Section";
import { Hero } from "@/components/sections/Hero";
import { visibleSections } from "@/content/site";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        {visibleSections.map((section, i) => (
          <Section key={section.id} {...section} number={i + 1} />
        ))}
      </main>
      <Footer />
    </>
  );
}
