"use client";

import { motion } from "framer-motion";
import { visibleSections } from "@/content/site";
import { spring } from "@/lib/motion";
import { useActiveSection } from "@/lib/useActiveSection";

// Geometry in rem, from the type scale: titles are set at text-lg/none (1.125rem line box) and shown at
// 2/3 scale (= text-xs) when inactive; stack rows are 24px apart (WCAG 2.5.8 spacing for small targets).
const SLOT = 1.125;
const GAP = 0.75;
const ROW = 1.5;
const SMALL = 2 / 3;
const rowY = (i: number) => `${SLOT + GAP + i * ROW}rem`;
const height = `${SLOT + GAP + (visibleSections.length - 1) * ROW + SLOT * SMALL}rem`;
// Mono glyphs are 1ch wide plus 0.1em tracking: room for the longest title at full size.
const width = `calc(${Math.max(...visibleSections.map(({ label }) => label.length))} * (1ch + 0.1em))`;
const flight = { type: "spring", ...spring } as const;

// DESIGN.MD §4 section index (wide+, in the margin beside the scroll ruler). Every title keeps its own row in
// the stack; the active one springs up into the top slot at full size while the rest stay small and muted.
// Plain y/scale targets (not layoutId) so rapid section changes can't leave a title stuck mid-flight;
// MotionConfig makes them instant for reduced motion.
export function SectionIndex() {
  const active = useActiveSection();

  return (
    <div className="fixed right-6 bottom-6 z-30 hidden rounded-2xl border border-border/50 bg-surface/40 p-4 font-mono text-lg/none uppercase tracking-widest backdrop-blur-md wide:block">
      <ul className="relative" style={{ width, height }}>
        {visibleSections.map(({ id, label }, i) => (
          <li key={id}>
            <motion.a
              href={`#${id}`}
              aria-current={id === active ? "true" : undefined}
              initial={false}
              animate={id === active ? { y: "0rem", scale: 1 } : { y: rowY(i), scale: SMALL }}
              transition={flight}
              // Not transition-colors: it would also fade the focus ring's outline-color in.
              className="absolute top-0 right-0 origin-top-right text-text-muted transition-[color] duration-200 hover:text-text aria-[current=true]:text-text"
            >
              {label}
            </motion.a>
          </li>
        ))}
      </ul>
    </div>
  );
}
