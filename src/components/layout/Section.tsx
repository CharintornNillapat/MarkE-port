import type { ReactNode } from "react";
import type { Section as SectionData } from "@/content/site";

type Props = SectionData & { number: number; children?: ReactNode };

export function Section({ id, label, heading, number, children }: Props) {
  const headingId = `${id}-heading`;

  return (
    // scroll-mt keeps anchor jumps clear of the fixed navbar.
    <section id={id} aria-labelledby={headingId} className="scroll-mt-16 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-text-muted">
          {String(number).padStart(2, "0")} / {label}
        </p>
        <h2 id={headingId} className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
          {heading}
        </h2>
        {children}
      </div>
    </section>
  );
}
