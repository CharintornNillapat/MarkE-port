"use client";

import { useEffect, useRef, useState } from "react";
import {
  interpolate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import { ScrollRuler } from "@/components/layout/ScrollRuler";
import { visibleSections } from "@/content/site";
import { spring } from "@/lib/motion";

// DESIGN.MD §6 section index (xl+), right margin. Layout in rem: titles are set at text-lg/none (1.125rem)
// and shown at 2/3 (= text-xs) in the stacks; the rail runs between the stacks.
const n = visibleSections.length;
const EDGE = 1.5; // top-6 / bottom-6
const ROW = 1.5; // stack pitch: a 0.75rem title + 0.75rem gap (24px apart, WCAG 2.5.8)
const HALF = 0.375; // centre of a 0.75rem stacked title
const LINE = 1.125; // text-lg/none line box (titles, odometer)
const RULER_TOP = EDGE + (n - 1) * ROW; // odometer, under the passed stack
const RAIL_TOP = RULER_TOP + LINE + 0.75; // + odometer and gap-3
const RAIL_BOTTOM = EDGE + n * ROW; // from the viewport bottom: above the upcoming stack
const RAIL_X = -(1 + 0.5 + LINE / 2); // a vertical title's centre: 0.5rem left of the 1rem tick track
const LIFT = 4; // scroll distance (rem) for leaving the stack and turning onto the rail
const SMALL = 2 / 3;
const REST = `scale(${SMALL})`;

// Anchor (right-centre of a title) in viewport px, rotation, scale, brightness 0–1.
type Pose = [x: number, y: number, rotate: number, scale: number, bright: number];
type Geometry = {
  rem: number;
  height: number;
  tops: number[]; // document y of each section
  maxScroll: number;
  handoff: number; // scroll over which a docked title retires as the next one arrives
  tone: (bright: number) => string;
};

const smoothstep = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));
const mix = (a: Pose, b: Pose, t: number) => a.map((v, k) => v + (b[k] - v) * t) as Pose;
// Scroll position at which a title docks: its section's top reaches the rail top (the last one docks at
// the end of the page, which it can't scroll past).
const dockAt = (i: number, g: Geometry) => Math.min(g.tops[i] - g.rem * RAIL_TOP, g.maxScroll);
const dockedIndex = (y: number, g: Geometry) => g.tops.filter((_, i) => y >= dockAt(i, g) - 1).length - 1;
const restY = (i: number, g: Geometry) => g.height - g.rem * (EDGE + (n - 1 - i) * ROW + HALF);

// Continuous flight, scrubbed by scroll: bottom stack → turns onto the rail and rides up it with its section's
// top edge → docks at the rail top → shrinks into the top stack when the next title arrives.
function flight(i: number, y: number, g: Geometry): Pose {
  const railTop = g.rem * RAIL_TOP;
  const railBottom = g.height - g.rem * RAIL_BOTTOM;
  const ride = railBottom - railTop;
  const lift = g.rem * LIFT;
  const onRail: Pose = [g.rem * RAIL_X, railBottom, -90, 1, 1];
  const left = dockAt(i, g) - y; // scroll still to go before this title docks

  let pose: Pose =
    left >= ride + lift
      ? [0, restY(i, g), 0, SMALL, 0]
      : left >= ride
        ? mix([0, restY(i, g), 0, SMALL, 0], onRail, smoothstep((ride + lift - left) / lift))
        : [onRail[0], railTop + Math.max(left, 0), -90, 1, 1];

  if (i < n - 1) {
    const retire = smoothstep(1 - (dockAt(i + 1, g) - y) / g.handoff);
    pose = mix(pose, [0, g.rem * (EDGE + i * ROW + HALF), 0, SMALL, 0], retire);
  }
  return pose;
}

// Reduced motion: no flight, each title simply sits in its state.
function snap(i: number, y: number, g: Geometry): Pose {
  const docked = dockedIndex(y, g);
  if (i < docked) return [0, g.rem * (EDGE + i * ROW + HALF), 0, SMALL, 0];
  if (i === docked) return [g.rem * RAIL_X, g.rem * RAIL_TOP, -90, 1, 1];
  return [0, restY(i, g), 0, SMALL, 0];
}

type TitleProps = {
  i: number;
  id: string;
  label: string;
  current: boolean;
  scroll: MotionValue<number>;
  geometry: MotionValue<Geometry | null>;
  discrete: boolean;
};

function Title({ i, id, label, current, scroll, geometry, discrete }: TitleProps) {
  // Read both values on every run: useTransform tracks the motion values read, so an early return before
  // scroll.get() would leave the title deaf to scrolling.
  const pose = () => {
    const y = scroll.get();
    const g = geometry.get();
    return g && { g, pose: (discrete ? snap : flight)(i, y, g) };
  };
  const transform = useTransform(() => {
    const p = pose();
    if (!p) return REST;
    const [x, y, rotate, scale] = p.pose;
    return `translate(${x}px, ${y - restY(i, p.g)}px) rotate(${rotate}deg) scale(${scale})`;
  });
  const tone = useTransform(() => {
    const p = pose();
    return p ? p.g.tone(p.pose[4]) : "var(--text-muted)";
  });

  return (
    <motion.a
      href={`#${id}`}
      aria-current={current ? "true" : undefined}
      // Anchored at its bottom-stack row (also the no-JS layout); the flight is a transform from there.
      className="pointer-events-auto absolute right-0 origin-right whitespace-nowrap font-mono text-lg/none uppercase tracking-widest text-(--tone) hover:text-text"
      style={{ bottom: `${EDGE + (n - 1 - i) * ROW + HALF - LINE / 2}rem`, transform, "--tone": tone } as MotionStyle}
    >
      {label}
    </motion.a>
  );
}

export function SectionIndex() {
  const root = useRef<HTMLDivElement>(null);
  const discrete = !!useReducedMotion();
  const { scrollY } = useScroll();
  const smooth = useSpring(scrollY, spring);
  const scroll = discrete ? scrollY : smooth;
  const geometry = useMotionValue<Geometry | null>(null);
  const [docked, setDocked] = useState(-1);

  useMotionValueEvent(scroll, "change", (y) => {
    const g = geometry.get();
    if (g) setDocked(dockedIndex(y, g));
  });

  useEffect(() => {
    const measure = () => {
      const css = getComputedStyle(document.documentElement);
      const rem = parseFloat(css.fontSize);
      const titles = [...(root.current?.querySelectorAll("a") ?? [])];
      const g: Geometry = {
        rem,
        height: window.innerHeight,
        tops: visibleSections.map(({ id }) => (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + window.scrollY),
        maxScroll: document.documentElement.scrollHeight - window.innerHeight,
        handoff: Math.max(...titles.map((a) => a.offsetWidth)) + rem,
        tone: interpolate([0, 1], [css.getPropertyValue("--text-muted").trim(), css.getPropertyValue("--text").trim()]),
      };
      geometry.set(g);
      setDocked(dockedIndex(scroll.get(), g));
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      resize.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [geometry, scroll]);

  return (
    <div ref={root} className="pointer-events-none fixed inset-y-0 right-6 z-30 hidden xl:block">
      <ScrollRuler
        number={docked >= 0 ? docked + 1 : undefined}
        style={{ top: `${RULER_TOP}rem`, bottom: `${RAIL_BOTTOM}rem` }}
      />
      {visibleSections.map(({ id, label }, i) => (
        <Title
          key={id}
          i={i}
          id={id}
          label={label}
          current={i === docked}
          scroll={scroll}
          geometry={geometry}
          discrete={discrete}
        />
      ))}
    </div>
  );
}
