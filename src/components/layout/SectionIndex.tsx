"use client";

import { useEffect, useRef, useState } from "react";
import {
  interpolate,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "framer-motion";
import { ScrollRuler } from "@/components/layout/ScrollRuler";
import { visibleSections } from "@/content/site";

// DESIGN.MD §6 section index (xl+), right margin, everything right-aligned on the right-6 line.
// Titles are set at text-xl/none bold (1.25rem); the stacks show them at 0.6 (= 12px), the rail at 0.8.
// Layout in rem, top to bottom: passed stack / docked title (one row per section) → odometer → rail →
// upcoming stack.
const n = visibleSections.length;
const EDGE = 1.5; // top-6 / bottom-6
const ROW = 1.5; // stack pitch: a 12px title + 12px gap (24px apart, WCAG 2.5.8)
const HALF = 0.375; // centre of a 12px stacked title
const BIG = 1.25; // text-xl/none line box
const ODOMETER = 1.125; // text-lg/none
const GAP = 0.75;
const RULER_TOP = EDGE + (n - 1) * ROW + BIG + GAP; // below the lowest possible docked title
const RAIL_TOP = RULER_TOP + ODOMETER + GAP;
const RAIL_BOTTOM = EDGE + n * ROW; // from the viewport bottom: above the upcoming stack
const TRACK = 1.5; // the ruler's 1rem tick track + 0.5rem gap
const SMALL = 0.6; // stacked titles, unless the margin is too narrow for that (then smaller)
const RIDE = 0.8;
const LIFT = 4; // scroll (rem) for leaving the stack and turning onto the rail
const DOCK = 8; // scroll (rem) for turning off the rail into the dock, and for the previous title to retire
const ROOM = 0.5; // gap (rem) every title keeps from the content column, in every frame
const DOCK_ROOM = 1; // gap (rem) a flat docked title needs; narrower margins dock upright instead
const REST = `scale(${SMALL})`;

// Anchor (right-centre of a title) in viewport px, rotation, scale, brightness 0–1.
type Pose = [x: number, y: number, rotate: number, scale: number, bright: number];
type Geometry = {
  rem: number;
  height: number;
  tops: number[]; // document y of each section
  maxScroll: number;
  widths: number[]; // each title's unscaled width
  line: number; // and line box height
  margin: number; // px between the content column and the right-6 line
  small: number;
  horizontal: boolean; // the widest title fits beside the content when docked flat
  tone: (bright: number) => string;
};

// If a title's rotated, scaled box would reach within ROOM of the content column, slide it right by the
// overshoot. Keeps transitions (where a turning title swings sideways) clear at any width.
function keepClear(pose: Pose, i: number, g: Geometry): Pose {
  const [x, , rotate, scale] = pose;
  const r = (rotate * Math.PI) / 180;
  const w = g.widths[i];
  const h = g.line / 2;
  const reach = scale * Math.max(w * Math.cos(r) - h * Math.sin(r), w * Math.cos(r) + h * Math.sin(r), -h * Math.sin(r), h * Math.sin(r));
  const limit = reach - (g.margin - g.rem * ROOM);
  return x < limit ? [limit, pose[1], rotate, scale, pose[4]] : pose;
}

// Cubic ease in-out over a 0–1 progress, clamped.
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const mix = (a: Pose, b: Pose, t: number) => a.map((v, k) => v + (b[k] - v) * t) as Pose;
// Scroll position at which a title docks: its section's top reaches the rail top (the last one docks at
// the end of the page, which it can't scroll past).
const dockAt = (i: number, g: Geometry) => Math.min(g.tops[i] - g.rem * RAIL_TOP, g.maxScroll);
const dockedIndex = (y: number, g: Geometry) => g.tops.filter((_, i) => y >= dockAt(i, g) - 1).length - 1;

const rest = (i: number, g: Geometry): Pose => [0, g.height - g.rem * (EDGE + (n - 1 - i) * ROW + HALF), 0, g.small, 0];
const passed = (i: number, g: Geometry): Pose => [0, g.rem * (EDGE + i * ROW + HALF), 0, g.small, 0];
const onRail = (y: number, g: Geometry): Pose => [-g.rem * (TRACK + (BIG * RIDE) / 2), y, -90, RIDE, 0.6];
// Docked: flat at full size in its own row under the passed titles or, where that can't fit beside the
// content, upright at the rail top.
const docked = (i: number, g: Geometry): Pose =>
  g.horizontal
    ? [0, g.rem * (EDGE + i * ROW + BIG / 2), 0, 1, 1]
    : [-g.rem * (TRACK + BIG / 2), g.rem * RAIL_TOP, -90, 1, 1];

// Scrubbed 1:1 by scroll: stack → turns onto the rail and rides up it level with its section's top edge →
// turns flat into the dock → shrinks into the passed stack while the next title docks.
function flight(i: number, y: number, g: Geometry): Pose {
  const railTop = g.rem * RAIL_TOP;
  const railBottom = g.height - g.rem * RAIL_BOTTOM;
  const ride = railBottom - railTop;
  const lift = g.rem * LIFT;
  const dock = g.rem * DOCK;
  const left = dockAt(i, g) - y; // scroll still to go before this title docks

  let pose =
    left >= ride + lift
      ? rest(i, g)
      : left >= ride
        ? mix(rest(i, g), onRail(railBottom, g), ease((ride + lift - left) / lift))
        : mix(onRail(railTop + Math.max(left, 0), g), docked(i, g), ease((dock - left) / dock));

  if (i < n - 1) pose = mix(pose, passed(i, g), ease((dock - (dockAt(i + 1, g) - y)) / dock));
  return keepClear(pose, i, g);
}

// Reduced motion: no flight, each title simply sits in its state.
function snap(i: number, y: number, g: Geometry): Pose {
  const d = dockedIndex(y, g);
  return keepClear(i < d ? passed(i, g) : i === d ? docked(i, g) : rest(i, g), i, g);
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
    return `translate(${x}px, ${y - rest(i, p.g)[1]}px) rotate(${rotate}deg) scale(${scale})`;
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
      className="pointer-events-auto absolute right-0 origin-right whitespace-nowrap text-xl/none font-bold uppercase tracking-wider text-(--tone) hover:text-text"
      style={{ bottom: `${EDGE + (n - 1 - i) * ROW + HALF - BIG / 2}rem`, transform, "--tone": tone } as MotionStyle}
    >
      {label}
    </motion.a>
  );
}

export function SectionIndex() {
  const root = useRef<HTMLDivElement>(null);
  const discrete = !!useReducedMotion();
  const { scrollY } = useScroll();
  const geometry = useMotionValue<Geometry | null>(null);
  const [current, setCurrent] = useState(-1);

  useMotionValueEvent(scrollY, "change", (y) => {
    const g = geometry.get();
    if (g) setCurrent(dockedIndex(y, g));
  });

  useEffect(() => {
    const measure = () => {
      const css = getComputedStyle(document.documentElement);
      const rem = parseFloat(css.fontSize);
      // Content column's right edge (container minus its padding) vs. the widest title docked flat.
      const container = document.querySelector(`#${visibleSections[0]?.id} .max-w-6xl`);
      const contentRight = container
        ? container.getBoundingClientRect().right - parseFloat(getComputedStyle(container).paddingRight)
        : Infinity;
      const titles = [...(root.current?.querySelectorAll("a") ?? [])];
      const widths = titles.map((a) => a.offsetWidth);
      const widest = Math.max(...widths);
      const margin = document.documentElement.clientWidth - rem * EDGE - contentRight;
      const g: Geometry = {
        rem,
        height: window.innerHeight,
        tops: visibleSections.map(({ id }) => (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + window.scrollY),
        maxScroll: document.documentElement.scrollHeight - window.innerHeight,
        widths,
        line: titles[0]?.offsetHeight ?? rem * BIG,
        margin,
        small: Math.min(SMALL, (margin - rem * ROOM) / widest),
        horizontal: widest + rem * DOCK_ROOM <= margin,
        tone: interpolate([0, 1], [css.getPropertyValue("--text-muted").trim(), css.getPropertyValue("--text").trim()]),
      };
      geometry.set(g);
      setCurrent(dockedIndex(window.scrollY, g));
    };
    measure();
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      resize.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [geometry]);

  return (
    <div ref={root} className="pointer-events-none fixed inset-y-0 right-6 z-30 hidden xl:block">
      <ScrollRuler
        number={current >= 0 ? current + 1 : undefined}
        style={{ top: `${RULER_TOP}rem`, bottom: `${RAIL_BOTTOM}rem` }}
      />
      {visibleSections.map(({ id, label }, i) => (
        <Title
          key={id}
          i={i}
          id={id}
          label={label}
          current={i === current}
          scroll={scrollY}
          geometry={geometry}
          discrete={discrete}
        />
      ))}
    </div>
  );
}
