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

const TOP = 1.5; // rem: where 0% sits, on the tape and in the viewport
const BOTTOM = 2.5; // rem: room under 100% for the readout

// DESIGN.MD §6 scroll ruler (lg+), in its own lane at the viewport's right edge: a measuring tape the
// length of the whole document that scrolls with it 1:1 (translateY = -scrollY), and an --accent
// indicator that travels down the viewport like a scrollbar thumb (progress × its track). Tape and
// track share TOP/BOTTOM, so the tick under the indicator is always the current progress, which the
// readout beneath it shows. Decorative.
export function ScrollRuler() {
  const { scrollY, scrollYProgress } = useScroll();
  const tape = useTransform(scrollY, (y) => -y);
  const thumb = useTransform(scrollYProgress, (p) => `${p * 100}%`);
  const [percent, setPercent] = useState(0);
  const [length, setLength] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => setPercent(Math.round(p * 100)));

  useEffect(() => {
    const measure = () => setLength(document.documentElement.scrollHeight);
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
      <motion.div
        className="absolute inset-x-0 will-change-transform"
        style={{ top: `${TOP}rem`, height: `calc(${length}px - ${TOP + BOTTOM}rem)`, y: tape }}
      >
        {TICKS.map((i) => (
          <Fragment key={i}>
            <span
              className={`absolute right-0 h-px -translate-y-1/2 ${i % 5 ? "w-2.5 bg-text-subtle" : "w-5 bg-text-muted"}`}
              style={{ top: `${i}%` }}
            />
            {i % 5 === 0 && i > 0 && (
              <span
                className="absolute right-6 -translate-y-1/2 font-mono text-2xs text-text-muted"
                style={{ top: `${i}%` }}
              >
                {i}
              </span>
            )}
          </Fragment>
        ))}
      </motion.div>
      <div className="absolute inset-x-0" style={{ top: `${TOP}rem`, bottom: `${BOTTOM}rem` }}>
        <motion.div className="flex h-full flex-col items-end will-change-transform" style={{ y: thumb }}>
          <span className="h-px w-12 -translate-y-1/2 bg-accent shadow-glow" />
          <span className="flex bg-bg pt-1 pb-0.5 font-mono text-2xs text-accent">
            <Odometer digits={String(percent).padStart(3, "0")} />%
          </span>
        </motion.div>
      </div>
    </div>
  );
}
