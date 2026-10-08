import type { ReactNode } from "react";
import * as motion from "framer-motion/client";
import type { Section as SectionData } from "@/content/site";
import { reveal, revealItem, revealLine } from "@/lib/motion";

type Props = SectionData & { number: number; children?: ReactNode };

export function Section({ id, label, heading, number, children }: Props) {
  const headingId = `${id}-heading`;

  return (
    // scroll-mt keeps anchor jumps clear of the fixed navbar.
    <section id={id} aria-labelledby={headingId} className="scroll-mt-16 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:pr-tracker">
        {/* Hairline draws in, then eyebrow + heading reveal, separately from the content below. */}
        <motion.div {...reveal}>
          <motion.span {...revealLine} aria-hidden className="mb-10 block h-px origin-left bg-border" />
          <motion.p {...revealItem} className="font-mono text-xs uppercase tracking-widest text-text-muted">
            {String(number).padStart(2, "0")} / {label}
          </motion.p>
          <motion.h2
            {...revealItem}
            id={headingId}
            className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl"
          >
            {heading}
          </motion.h2>
        </motion.div>
        {children}
      </div>
    </section>
  );
}
