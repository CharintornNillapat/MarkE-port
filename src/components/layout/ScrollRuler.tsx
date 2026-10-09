"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "framer-motion";

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const LABELS = Array.from({ length: 20 }, (_, i) => (i + 1) * 5); // a label every 5%

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

// A 1px line at the top of a tile, in a token colour.
const tick = (color: string) => `linear-gradient(var(${color}) 1px, transparent 1px)`;

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
  const [span, setSpan] = useState(0); // px from 0% to 100% on the tape
  useMotionValueEvent(scrollYProgress, "change", (p) => setPercent(Math.round(p * 100)));

  useEffect(() => {
    const measure = () =>
      setSpan(document.documentElement.scrollHeight - (TOP + BOTTOM) * parseFloat(getComputedStyle(document.documentElement).fontSize));
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
        style={{
          top: `${TOP}rem`,
          height: span + 1, // +1px: the 100% tick is a tile of its own, one tile below the 99% one
          y: tape,
          // Ticks as tiled 1px lines, pointing left from the right edge: long every 5%, short every 1%.
          backgroundImage: `${tick("--text-muted")}, ${tick("--text-subtle")}`,
          backgroundSize: `1.25rem ${span / 20}px, 0.625rem ${span / 100}px`,
          backgroundPosition: "right -0.5px",
          backgroundRepeat: "repeat-y",
        }}
      >
        {LABELS.map((i) => (
          <span
            key={i}
            className="absolute right-6 -translate-y-1/2 font-mono text-2xs text-text-muted"
            style={{ top: `${i}%` }}
          >
            {i}
          </span>
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
