"use client";

import { Fragment, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const TICKS = Array.from({ length: 41 }, (_, i) => i); // every 2.5%: long every 25%, medium every 12.5%; labelled every 5%

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

// DESIGN.MD §6 scroll ruler (lg+): a full-height track in its own lane at the viewport's right edge (the
// section index rides just left of it). Right to left: milestone labels every 5%, the spine, ticks. The
// --accent indicator and its 000–100% readout ride the track together at the scroll progress
// (translateY, 1:1 with scroll); the readout's opaque backing hides the label it passes. Decorative.
export function ScrollRuler() {
  const { scrollYProgress } = useScroll();
  const at = useTransform(scrollYProgress, (p) => `${p * 100}%`); // of the track height
  const [percent, setPercent] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setPercent(Math.round(p * 100)));

  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-6 right-2 z-30 hidden w-10 lg:block">
      <span className="absolute inset-y-0 right-7 w-0.5 bg-border-strong" />
      <motion.span className="absolute inset-y-0 right-7 w-0.5 origin-top bg-accent" style={{ scaleY: scrollYProgress }} />
      {TICKS.map((i) => (
        <Fragment key={i}>
          <span
            className={`absolute right-7 -translate-y-1/2 ${i % 10 ? (i % 5 ? "h-px w-1.5 bg-text-subtle" : "h-px w-2 bg-text-muted") : "h-0.5 w-3 bg-text-muted"}`}
            style={{ top: `${i * 2.5}%` }}
          />
          {i % 2 === 0 && (
            <span
              className="absolute right-0 -translate-y-1/2 font-mono text-2xs text-text-muted"
              style={{ top: `${i * 2.5}%` }}
            >
              {String(i * 2.5).padStart(2, "0")}
            </span>
          )}
        </Fragment>
      ))}
      <motion.div className="absolute inset-0" style={{ y: at }}>
        <div className="absolute top-0 right-0 flex -translate-y-1/2 items-center gap-1">
          <span className="h-0.5 w-3.5 bg-accent shadow-glow" />
          <span className="flex bg-bg py-1.5 font-mono text-2xs text-accent">
            <Odometer digits={String(percent).padStart(3, "0")} />%
          </span>
        </div>
      </motion.div>
    </div>
  );
}
