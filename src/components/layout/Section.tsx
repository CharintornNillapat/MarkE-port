import type { ReactNode } from "react";
import * as motion from "framer-motion/client";
import { Accent } from "@/components/ui/Accent";
import type { Section as SectionData } from "@/content/site";
import { reveal, revealItem, revealLine } from "@/lib/motion";

type Props = SectionData & { number: number; children?: ReactNode };

export function Section({ id, label, heading, accent, number, children }: Props) {
  const headingId = `${id}-heading`;

  return (
    <section id={id} aria-labelledby={headingId} className="pb-16 md:pb-24">
      {/* DESIGN.MD §4 section bar: full-bleed, and from md it pins to the top while its section is on
          screen (the next section's bar pushes it out), level with the navbar. Its top hairline draws in. */}
      <motion.div
        {...reveal}
        className="relative z-10 border-b border-border bg-bg/80 backdrop-blur-md md:sticky md:top-0"
      >
        <motion.span {...revealLine} aria-hidden className="absolute inset-x-0 top-0 h-px origin-left bg-border" />
        <div className="mx-auto flex h-12 max-w-6xl items-center px-4 sm:px-6 md:h-22 lg:pr-tracker">
          <motion.p {...revealItem} className="font-mono text-xs uppercase tracking-widest text-text-muted">
            {String(number).padStart(2, "0")} / {label}
          </motion.p>
        </div>
      </motion.div>
      <div className="mx-auto max-w-6xl px-4 pt-10 sm:px-6 md:pt-14 lg:pr-tracker">
        <motion.h2
          {...reveal}
          {...revealItem}
          id={headingId}
          className="text-3xl font-semibold tracking-tight sm:text-4xl"
        >
          <Accent text={heading} word={accent} />
        </motion.h2>
        {children}
      </div>
    </section>
  );
}
