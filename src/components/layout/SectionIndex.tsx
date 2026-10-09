"use client";

import { useEffect, useRef, useState } from "react";
import {
  cubicBezier,
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
import { Odometer, ScrollRuler } from "@/components/layout/ScrollRuler";
import { identity, visibleSections } from "@/content/site";

// DESIGN.MD §6 section index (lg+), in the tracker gutter the page containers keep free (pr-tracker),
// everything right-aligned on the right-14 line, just left of the full-height ScrollRuler lane.
// Titles are set at text-4xl/none bold (2.25rem): full size when docked beneath the
// navbar, 0.5 on the rail, 1/3 (= 12px) in the stacks. Layout in rem, top to bottom: passed stack
// (headed by the MARK logo link) → docked title → section number → rail → upcoming stack.
const n = visibleSections.length;
const LINE = 3.5; // right-14: 0.5rem clear of the ruler lane (right-2, w-10)
const EDGE = 1.5; // top-6 / bottom-6
const ROW = 1.5; // stack pitch: a 12px title + 12px gap (24px apart, WCAG 2.5.8)
const HALF = 0.375; // centre of a 12px stacked title
const BIG = 2.25; // text-4xl/none line box
const ODOMETER = 1.125; // text-lg/none
const GAP = 0.75;
const DOCK_TOP = EDGE + n * ROW + GAP; // below the longest passed stack (logo + n - 1), so also below the navbar
const NUMBER_TOP = DOCK_TOP + BIG + GAP;
const RAIL_TOP = NUMBER_TOP + ODOMETER + GAP;
const RAIL_BOTTOM = EDGE + n * ROW; // from the viewport bottom: above the upcoming stack
const SMALL = 1 / 3; // stacked titles, unless the margin is too narrow for that (then smaller)
const RIDE = 0.5;
const LIFT = 4; // scroll (rem) for leaving the stack and turning onto the rail
const DOCK = 8; // scroll (rem) for turning off the rail into the dock, and for the previous title to retire
const WAKE = 8; // scroll (rem) from the top of the page over which a title already due on the rail lifts out
const ROOM = 0.5; // gap (rem) every title but the docked one keeps from the content column, in every frame
const REST = `scale(${SMALL})`;

// Anchor (right-centre of a title) in viewport px, rotation, scale, brightness 0–1.
type Pose = [x: number, y: number, rotate: number, scale: number, bright: number];
type Geometry = {
  rem: number;
  height: number;
  tops: number[]; // document y of each section
  maxScroll: number;
  widths: number[]; // each title's unscaled width
  line: number; // line box height
  margin: number; // px between the content column and the right-6 line
  small: number;
  tone: (bright: number) => string;
  heroEnd: number; // document y of the hero name's bottom edge: the MARK link appears once it has scrolled off
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

// Nor past the titles' line into the ruler lane: a turning title's line box swings right of its anchor by
// scale · (line / 2) · |sin r|, so hold the anchor that far left (upright on the rail that is exactly
// where it rides).
function keepRight(pose: Pose, g: Geometry): Pose {
  const limit = -pose[3] * (g.line / 2) * Math.abs(Math.sin((pose[2] * Math.PI) / 180));
  return pose[0] > limit ? [limit, pose[1], pose[2], pose[3], pose[4]] : pose;
}

// Cubic ease in-out over a 0–1 progress, clamped.
const ease = (t: number) => (t <= 0 ? 0 : t >= 1 ? 1 : t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
// Into the dock: a long soft settle (the 0.25, 1, 0.5, 1 curve) with no abrupt stop. That curve starts at
// 4× speed, so its input is squared to ease the title off the rail instead of jerking it off.
const settle = cubicBezier(0.25, 1, 0.5, 1);
const arrive = (t: number) => settle(Math.min(Math.max(t, 0), 1) ** 2);
const mix = (a: Pose, b: Pose, t: number) => a.map((v, k) => v + (b[k] - v) * t) as Pose;
// Scroll position at which a title docks: its section's top reaches the rail top (the last one docks at
// the end of the page, which it can't scroll past).
const dockAt = (i: number, g: Geometry) => Math.min(g.tops[i] - g.rem * RAIL_TOP, g.maxScroll);
const dockedIndex = (y: number, g: Geometry) => g.tops.filter((_, i) => y >= dockAt(i, g) - 1).length - 1;

const rest = (i: number, g: Geometry): Pose => [0, g.height - g.rem * (EDGE + (n - 1 - i) * ROW + HALF), 0, g.small, 0];
const passed = (i: number, g: Geometry): Pose => [0, g.rem * (EDGE + (i + 1) * ROW + HALF), 0, g.small, 0];
// On the rail, upright beside the ruler: its foot (first letter) at y, so the word hangs above y and
// never over the waiting stack below the rail.
const onRail = (y: number, i: number, g: Geometry): Pose => [
  (-g.rem * BIG * RIDE) / 2,
  y - g.widths[i] * RIDE,
  -90,
  RIDE,
  0.6,
];
const docked = (g: Geometry): Pose => [0, g.rem * (DOCK_TOP + BIG / 2), 0, 1, 1];

// Scrubbed 1:1 by scroll: stack → turns onto the rail and rides up it, its foot level with its section's
// top edge → turns flat into the giant dock beneath the navbar → shrinks into the passed stack while the
// next docks.
function flight(i: number, y: number, g: Geometry): Pose {
  const railTop = g.rem * RAIL_TOP;
  const ride = g.height - g.rem * RAIL_BOTTOM - railTop;
  const lift = g.rem * LIFT;
  const dock = g.rem * DOCK;
  const left = dockAt(i, g) - y; // scroll still to go before this title docks
  // Lifts toward a rail point that already moves with the scroll, so it joins the ride at scroll speed
  // (no stop-and-go where lift and ride meet). Never before the page has been scrolled: on load every
  // title waits in the stack, and one already due on the rail lifts out over the first WAKE rem.
  const lifting = ease(Math.min((ride + lift - left) / lift, y / (g.rem * WAKE)));
  const lifted = mix(rest(i, g), onRail(railTop + Math.max(left, 0), i, g), lifting);
  const docking = arrive((dock - left) / dock);
  const retiring = i < n - 1 ? ease((dock - (dockAt(i + 1, g) - y)) / dock) : 0;
  const pose = mix(mix(lifted, docked(g), docking), passed(i, g), retiring);
  // Two limits: ROOM clear of the content column (keepClear) and out of the ruler lane (keepRight). They
  // only clash while a wide title turns. Turning into or out of the dock (the one thing allowed over the
  // content, like the navbar) the ruler wins; anywhere else the content does.
  const free = docking * (1 - retiring);
  return free > 0 ? keepRight(mix(keepClear(pose, i, g), pose, free), g) : keepClear(keepRight(pose, g), i, g);
}

// Reduced motion: no flight, each title simply sits in its state.
function snap(i: number, y: number, g: Geometry): Pose {
  const d = dockedIndex(y, g);
  return i === d ? docked(g) : keepClear(i < d ? passed(i, g) : rest(i, g), i, g);
}

type Props = {
  i: number;
  scroll: MotionValue<number>;
  geometry: MotionValue<Geometry | null>;
  discrete: boolean;
};

// The pose of a title. Reads both values on every run: useTransform tracks the motion values read, so an
// early return before scroll.get() would leave it deaf to scrolling.
function read({ i, scroll, geometry, discrete }: Props) {
  const y = scroll.get();
  const g = geometry.get();
  return g && { g, pose: discrete ? snap(i, y, g) : flight(i, y, g) };
}

function Title({ id, label, current, ...props }: Props & { id: string; label: string; current: boolean }) {
  const transform = useTransform(() => {
    const p = read(props);
    if (!p) return REST;
    const [x, y, rotate, scale] = p.pose;
    return `translate3d(${x}px, ${y - rest(props.i, p.g)[1]}px, 0) rotate(${rotate}deg) scale(${scale})`;
  });
  const tone = useTransform(() => {
    const p = read(props);
    return p ? p.g.tone(p.pose[4]) : "var(--text-muted)";
  });

  return (
    <motion.a
      data-title
      href={`#${id}`}
      aria-label={label}
      aria-current={current ? "true" : undefined}
      // Anchored at its bottom-stack row (also the no-JS layout); the flight is a transform from there.
      className="pointer-events-auto absolute right-0 origin-right whitespace-nowrap text-(--tone) text-4xl/none font-bold uppercase tracking-wider will-change-transform hover:text-text"
      style={{ bottom: `${EDGE + (n - 1 - props.i) * ROW + HALF - BIG / 2}rem`, transform, "--tone": tone } as MotionStyle}
    >
      {label}
    </motion.a>
  );
}

// Top row of the passed stack: the MARK logo, a link to the top. Hidden while the hero name is on screen
// (the name says the same thing), and, without JS or before measuring, simply there.
function Wordmark({ scroll, geometry }: Pick<Props, "scroll" | "geometry">) {
  const opacity = useTransform(() => {
    const g = geometry.get();
    return !g || scroll.get() >= g.heroEnd ? 1 : 0;
  });
  const transform = useTransform(() => `scale(${geometry.get()?.small ?? SMALL})`);

  return (
    <motion.a
      href="#top"
      aria-label={identity.name}
      className="pointer-events-auto absolute right-0 origin-right whitespace-nowrap text-4xl/none font-bold uppercase tracking-wider text-text-muted hover:text-text"
      style={{ top: `${EDGE + HALF - BIG / 2}rem`, transform, opacity }}
    >
      {identity.logo}
    </motion.a>
  );
}

export function SectionIndex() {
  const root = useRef<HTMLElement>(null);
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
      // Content column's right edge (container minus its padding).
      const container = document.querySelector(`#${visibleSections[0]?.id} .max-w-6xl`);
      const contentRight = container
        ? container.getBoundingClientRect().right - parseFloat(getComputedStyle(container).paddingRight)
        : Infinity;
      const titles = [...(root.current?.querySelectorAll<HTMLElement>("a[data-title]") ?? [])];
      const widths = titles.map((a) => a.offsetWidth);
      const anchor = document.documentElement.clientWidth - rem * LINE; // the right-14 line, viewport x
      const margin = anchor - contentRight;
      const g: Geometry = {
        rem,
        height: window.innerHeight,
        tops: visibleSections.map(({ id }) => (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + window.scrollY),
        maxScroll: document.documentElement.scrollHeight - window.innerHeight,
        widths,
        line: titles[0]?.offsetHeight ?? rem * BIG,
        margin,
        small: Math.min(SMALL, (margin - rem * ROOM) / Math.max(...widths)),
        tone: interpolate([0, 1], [css.getPropertyValue("--text-muted").trim(), css.getPropertyValue("--text").trim()]),
        heroEnd: (document.getElementById("top-heading")?.getBoundingClientRect().bottom ?? 0) + window.scrollY,
      };
      geometry.set(g);
      setCurrent(dockedIndex(window.scrollY, g));
    };
    measure();
    document.fonts.ready.then(measure); // title widths change once the font loads
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      resize.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [geometry]);

  return (
    <>
      {/* Scrims behind the passed stack + dock and the upcoming stack (DESIGN.MD §4): an 80% --bg wash
          fading out from the corner keeps the titles legible over anything (no blur: DESIGN.MD §4 caps
          backdrop blur at the navbar and the section bar). The bottom one fades out once the last section
          docks and nothing waits there, so it never dims the footer. */}
      <div
        aria-hidden
        className="scrim-top pointer-events-none fixed top-0 right-0 z-20 hidden w-md bg-bg/80 lg:block"
        style={{ height: `${RAIL_TOP}rem` }}
      />
      <div
        aria-hidden
        className={`scrim-bottom pointer-events-none fixed right-0 bottom-0 z-20 hidden w-sm bg-bg/80 transition-opacity duration-200 lg:block ${current < n - 1 ? "opacity-100" : "opacity-0"}`}
        style={{ height: `${RAIL_BOTTOM + 2 * ROW}rem` }}
      />
      <ScrollRuler />
      <nav
        ref={root}
        aria-label="Sections"
        className="pointer-events-none fixed inset-y-0 right-14 z-30 hidden lg:block"
      >
        {/* The docked section's eyebrow number, rolling like an odometer. Decorative: the titles are the links. */}
        <p
          aria-hidden
          className={`absolute right-0 font-mono text-lg leading-none text-text transition-opacity duration-200 ${current >= 0 ? "opacity-100" : "opacity-0"}`}
          style={{ top: `${NUMBER_TOP}rem` }}
        >
          <Odometer digits={String(Math.max(current, 0) + 1).padStart(2, "0")} />
        </p>
        <Wordmark scroll={scrollY} geometry={geometry} />
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
      </nav>
    </>
  );
}
