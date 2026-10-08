"use client";

import { Fragment, useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const TICKS = Array.from({ length: 101 }, (_, i) => i); // every 1%; long and labelled every 5%

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

// DESIGN.MD §6 scroll ruler (lg+), in its own lane at the viewport's right edge: a measuring tape that
// scrolls with the page. Its 0–100% span is exactly the page's scroll distance, laid out from the
// indicator down, so it moves 1:1 with the content (translateY = -scrollY) and the tick under the fixed
// --accent indicator (level with the docked title, `at` rem from the top) is always the current
// progress, which the readout beneath it shows. Decorative.
export function ScrollRuler({ at }: { at: number }) {
  const { scrollY, scrollYProgress } = useScroll();
  const tape = useTransform(scrollY, (y) => -y);
  const [percent, setPercent] = useState(0);
  const [length, setLength] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setPercent(Math.round(p * 100)));

  useEffect(() => {
    const measure = () => setLength(document.documentElement.scrollHeight - window.innerHeight);
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      resize.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-y-0 right-2 z-30 hidden w-12 overflow-hidden lg:block">
      <span className="absolute inset-y-0 right-0 w-px bg-border-strong" />
      <motion.div
        className="absolute inset-x-0 will-change-transform"
        style={{ top: `${at}rem`, height: length, y: tape }}
      >
        {TICKS.map((i) => (
          <Fragment key={i}>
            <span
              className={`absolute right-0 h-px -translate-y-1/2 ${i % 5 ? "w-2 bg-text-subtle" : "w-4 bg-text-muted"}`}
              style={{ top: `${i}%` }}
            />
            {i % 5 === 0 && i > 0 && (
              <span
                className="absolute right-5 -translate-y-1/2 font-mono text-2xs text-text-muted"
                style={{ top: `${i}%` }}
              >
                {i}
              </span>
            )}
          </Fragment>
        ))}
      </motion.div>
      <div className="absolute right-0 flex flex-col items-end" style={{ top: `${at}rem` }}>
        <span className="h-0.5 w-12 -translate-y-1/2 bg-accent shadow-glow" />
        <span className="flex bg-bg pt-1 pb-0.5 font-mono text-2xs text-accent">
          <Odometer digits={String(percent).padStart(3, "0")} />%
        </span>
      </div>
    </div>
  );
}
