"use client";

import type { CSSProperties } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const TICKS = Array.from({ length: 41 }, (_, i) => i); // every 2.5%; medium every 12.5%, long every 25%

type Props = { number?: number; style?: CSSProperties };

// DESIGN.MD §6 scroll ruler: the docked section's eyebrow number rolls like an odometer above a tick rail
// whose --accent fill and notch follow scroll progress (scaleY / translateY, compositor only). SectionIndex
// places it (style) and flies the section titles along it. Decorative: the titles themselves are the links.
export function ScrollRuler({ number, style }: Props) {
  const { scrollYProgress } = useScroll();
  const notch = useTransform(scrollYProgress, (p) => `${p * 100}%`); // of the track height
  const digits = String(number ?? 1).padStart(2, "0");

  return (
    <div aria-hidden className="absolute right-0 flex flex-col items-end gap-3" style={style}>
      <p
        className={`flex font-mono text-lg leading-none text-text transition-opacity duration-200 ${number ? "opacity-100" : "opacity-0"}`}
      >
        {[...digits].map((digit, i) => (
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
      <div className="relative w-4 flex-1">
        <span className="absolute inset-y-0 right-0 w-px bg-border" />
        <motion.span
          className="absolute inset-y-0 right-0 w-px origin-top bg-accent"
          style={{ scaleY: scrollYProgress }}
        />
        {TICKS.map((i) => (
          <span
            key={i}
            className={`absolute right-0 h-px bg-border-strong ${i % 10 ? (i % 5 ? "w-1.5" : "w-3") : "w-4"}`}
            style={{ top: `${i * 2.5}%` }}
          />
        ))}
        <motion.div className="absolute inset-0" style={{ y: notch }}>
          <span className="absolute top-0 right-0 h-0.5 w-5 -translate-y-1/2 bg-accent" />
        </motion.div>
      </div>
    </div>
  );
}
