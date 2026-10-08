"use client";

import { motion, useScroll } from "framer-motion";
import { visibleSections } from "@/content/site";
import { useActiveSection } from "@/lib/useActiveSection";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const TICKS = Array.from({ length: 21 }, (_, i) => i); // every 5%, longer every 25%

// DESIGN.MD §6 scroll ruler (xl+): the active section's eyebrow number rolls like an odometer above a
// tick track whose --accent fill follows scroll progress (scaleY, compositor only). Decorative: the
// navbar already says where you are, so it's hidden from assistive tech and never takes pointer input.
export function ScrollRuler() {
  const { scrollYProgress } = useScroll();
  const active = useActiveSection();
  const index = visibleSections.findIndex(({ id }) => id === active);
  const number = String(Math.max(index + 1, 1)).padStart(2, "0");

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed top-1/2 right-6 z-30 hidden -translate-y-1/2 flex-col items-end gap-4 xl:flex"
    >
      <p
        className={`flex font-mono text-lg leading-none text-text transition-opacity duration-200 ${index < 0 ? "opacity-0" : "opacity-100"}`}
      >
        {[...number].map((digit, i) => (
          <span key={i} className="h-lh overflow-hidden">
            <span
              className="flex flex-col motion-safe:transition-transform motion-safe:duration-280 motion-safe:ease-odometer"
              style={{ transform: `translateY(-${Number(digit) * 10}%)` }}
            >
              {DIGITS.map((d) => (
                <span key={d}>{d}</span>
              ))}
            </span>
          </span>
        ))}
      </p>
      <div className="relative h-48 w-4">
        <span className="absolute inset-y-0 right-0 w-px bg-border" />
        <motion.span
          className="absolute inset-y-0 right-0 w-px origin-top bg-accent"
          style={{ scaleY: scrollYProgress }}
        />
        {TICKS.map((i) => (
          <span
            key={i}
            className={`absolute right-0 h-px bg-border-strong ${i % 5 ? "w-2" : "w-4"}`}
            style={{ top: `${i * 5}%` }}
          />
        ))}
      </div>
    </div>
  );
}
