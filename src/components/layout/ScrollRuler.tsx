"use client";

import { useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const TICKS = Array.from({ length: 41 }, (_, i) => i); // every 2.5%; medium every 12.5%, long every 25%

// Rolling digits: each column slides to its digit, 280ms odometer ease (instant under reduced motion).
export function Odometer({ digits }: { digits: string }) {
  return (
    <span className="flex">
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
    </span>
  );
}

// DESIGN.MD §6 scroll ruler (lg+): a full-height tick track in its own lane at the viewport's right edge
// (the section index rides just left of it), topped by a rolling 000–100% readout of scroll progress.
// The --accent fill and notch follow scroll progress (scaleY / translateY, compositor only). Decorative.
export function ScrollRuler() {
  const { scrollYProgress } = useScroll();
  const notch = useTransform(scrollYProgress, (p) => `${p * 100}%`); // of the track height
  const [percent, setPercent] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setPercent(Math.round(p * 100)));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-6 right-2 z-30 hidden w-6 flex-col items-end gap-3 lg:flex">
      <p className="flex font-mono text-xs leading-none text-text">
        <Odometer digits={String(percent).padStart(3, "0")} />%
      </p>
      <div className="relative w-full flex-1">
        <span className="absolute inset-y-0 right-0 w-0.5 bg-border-strong" />
        <motion.span
          className="absolute inset-y-0 right-0 w-0.5 origin-top bg-accent"
          style={{ scaleY: scrollYProgress }}
        />
        {TICKS.map((i) => (
          <span
            key={i}
            className={`absolute right-0 -translate-y-1/2 ${i % 10 ? (i % 5 ? "h-px w-2.5 bg-text-subtle" : "h-px w-4 bg-text-muted") : "h-0.5 w-6 bg-text-muted"}`}
            style={{ top: `${i * 2.5}%` }}
          />
        ))}
        <motion.div className="absolute inset-0" style={{ y: notch }}>
          <span className="absolute top-0 right-0 h-0.5 w-8 -translate-y-1/2 bg-accent" />
        </motion.div>
      </div>
    </div>
  );
}
