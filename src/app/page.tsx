import { Footer } from "@/components/layout/Footer";
import { Navbar } from "@/components/layout/Navbar";
import { Section } from "@/components/layout/Section";
import { identity, visibleSections } from "@/content/site";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Phase 0 placeholder; the Hero replaces it in Phase 2. */}
        <div id="top" className="mx-auto max-w-6xl px-4 pt-32 pb-16 sm:px-6 md:pb-24">
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl">
            {identity.name}
          </h1>
          <p className="mt-4 max-w-prose text-base leading-relaxed text-text-muted sm:text-lg">
            {identity.role}
          </p>
        </div>
        {visibleSections.map((section, i) => (
          <Section key={section.id} {...section} number={i + 1} />
        ))}
      </main>
      <Footer />
    </>
  );
}
