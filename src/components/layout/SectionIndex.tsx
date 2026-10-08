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
import { ScrollRuler } from "@/components/layout/ScrollRuler";
import { visibleSections } from "@/content/site";

// DESIGN.MD §6 section index (lg+), in the tracker gutter the page containers keep free (pr-tracker),
// everything right-aligned on the right-6 line.
// Titles are set at text-4xl/none bold (2.25rem): full size when docked beneath the
// navbar, 0.5 on the rail, 1/3 (= 12px) in the stacks. Layout in rem, top to bottom: passed stack →
// docked title → odometer → rail → upcoming stack.
const n = visibleSections.length;
const EDGE = 1.5; // top-6 / bottom-6
const ROW = 1.5; // stack pitch: a 12px title + 12px gap (24px apart, WCAG 2.5.8)
const HALF = 0.375; // centre of a 12px stacked title
const BIG = 2.25; // text-4xl/none line box
const ODOMETER = 1.125; // text-lg/none
const GAP = 0.75;
const DOCK_TOP = EDGE + (n - 1) * ROW + GAP; // below the longest passed stack, so also below the navbar
const RULER_TOP = DOCK_TOP + BIG + GAP;
const RAIL_TOP = RULER_TOP + ODOMETER + GAP;
const RAIL_BOTTOM = EDGE + n * ROW; // from the viewport bottom: above the upcoming stack
const TRACK = 1.5; // the ruler's 1rem tick track + 0.5rem gap
const SMALL = 1 / 3; // stacked titles, unless the margin is too narrow for that (then smaller)
const RIDE = 0.5;
const LIFT = 4; // scroll (rem) for leaving the stack and turning onto the rail
const DOCK = 8; // scroll (rem) for turning off the rail into the dock, and for the previous title to retire
// Letters peel off one by one: the m-th letter from the right trails the first by STAGGER · m^WAVE rem of
// scroll, so each gap is a little wider than the last (a trailing wave).
const STAGGER = 0.5;
const WAVE = 1.35;
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
  letters: number[][]; // and each letter's centre, in px from the title's right edge
  line: number; // line box height
  margin: number; // px between the content column and the right-6 line
  small: number;
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
// Into the dock: a long soft settle (the 0.25, 1, 0.5, 1 curve) with no abrupt stop. That curve starts at
// 4× speed, so its input is squared to ease the letter off the rail instead of jerking it off.
const settle = cubicBezier(0.25, 1, 0.5, 1);
const arrive = (t: number) => settle(Math.min(Math.max(t, 0), 1) ** 2);
const mix = (a: Pose, b: Pose, t: number) => a.map((v, k) => v + (b[k] - v) * t) as Pose;
// Scroll position at which a title docks: its section's top reaches the rail top (the last one docks at
// the end of the page, which it can't scroll past).
const dockAt = (i: number, g: Geometry) => Math.min(g.tops[i] - g.rem * RAIL_TOP, g.maxScroll);
const dockedIndex = (y: number, g: Geometry) => g.tops.filter((_, i) => y >= dockAt(i, g) - 1).length - 1;

const rest = (i: number, g: Geometry): Pose => [0, g.height - g.rem * (EDGE + (n - 1 - i) * ROW + HALF), 0, g.small, 0];
const passed = (i: number, g: Geometry): Pose => [0, g.rem * (EDGE + i * ROW + HALF), 0, g.small, 0];
const onRail = (y: number, g: Geometry): Pose => [-g.rem * (TRACK + (BIG * RIDE) / 2), y, -90, RIDE, 0.6];
const docked = (g: Geometry): Pose => [0, g.rem * (DOCK_TOP + BIG / 2), 0, 1, 1];

// Scrubbed 1:1 by scroll: stack → turns onto the rail and rides up it level with its section's top edge →
// turns flat into the giant dock beneath the navbar → shrinks into the passed stack while the next docks.
function flight(i: number, y: number, g: Geometry): Pose {
  const railTop = g.rem * RAIL_TOP;
  const ride = g.height - g.rem * RAIL_BOTTOM - railTop;
  const lift = g.rem * LIFT;
  const dock = g.rem * DOCK;
  const left = dockAt(i, g) - y; // scroll still to go before this title docks
  // Lifts toward a rail point that already moves with the scroll, so it joins the ride at scroll speed
  // (no stop-and-go where lift and ride meet).
  const lifted = mix(rest(i, g), onRail(railTop + Math.max(left, 0), g), ease((ride + lift - left) / lift));
  const docking = arrive((dock - left) / dock);
  const retiring = i < n - 1 ? ease((dock - (dockAt(i + 1, g) - y)) / dock) : 0;
  const pose = mix(mix(lifted, docked(g), docking), passed(i, g), retiring);
  // The docked title is the one thing allowed over the content column (beneath the navbar, like it).
  return mix(keepClear(pose, i, g), pose, docking * (1 - retiring));
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

// The title's pose, or a letter's: the title's pose `lead` rem further down the page. Reads both values on
// every run: useTransform tracks the motion values read, so an early return before scroll.get() would
// leave it deaf to scrolling.
function read({ i, scroll, geometry, discrete }: Props, lead = 0) {
  const y = scroll.get();
  const g = geometry.get();
  return g && { g, pose: discrete ? snap(i, y, g) : flight(i, y + g.rem * lead, g) };
}

// A letter flies on its own copy of the title's path, run ahead or behind by `lead`, expressed relative to
// the title it sits in (whose transform it inherits). Every resting state leaves it untransformed.
function Letter({ char, k, lead, ...props }: Props & { char: string; k: number; lead: number }) {
  const transform = useTransform(() => {
    const title = read(props);
    const self = read(props, lead);
    if (!title || !self) return "none";
    const [x, y, r, s] = title.pose;
    const [xk, yk, rk, sk] = self.pose;
    const c = title.g.letters[props.i][k];
    // Its anchor's offset, taken back into the title's unrotated, unscaled frame.
    const a = (-r * Math.PI) / 180;
    const ox = ((xk - x) * Math.cos(a) - (yk - y) * Math.sin(a)) / s;
    const oy = ((xk - x) * Math.sin(a) + (yk - y) * Math.cos(a)) / s;
    // Turn and scale about its own centre (c, 0), then move that centre to where its own pose puts it.
    const turn = rk - r;
    const zoom = sk / s;
    const b = (turn * Math.PI) / 180;
    // translate3d: each letter gets its own compositor layer, so it glides at subpixel precision instead
    // of being repainted (and pixel-snapped) inside its title's layer every frame.
    return `translate3d(${ox + zoom * c * Math.cos(b) - c}px, ${oy + zoom * c * Math.sin(b)}px, 0) rotate(${turn}deg) scale(${zoom})`;
  });
  const tone = useTransform(() => {
    const self = read(props, lead);
    return self ? self.g.tone(self.pose[4]) : "var(--text-muted)";
  });

  return (
    <motion.span
      className="inline-block whitespace-pre text-(--tone) group-hover:text-text"
      style={{ transform, "--tone": tone } as MotionStyle}
    >
      {char}
    </motion.span>
  );
}

function Title({ id, label, current, ...props }: Props & { id: string; label: string; current: boolean }) {
  const transform = useTransform(() => {
    const p = read(props);
    if (!p) return REST;
    const [x, y, rotate, scale] = p.pose;
    return `translate3d(${x}px, ${y - rest(props.i, p.g)[1]}px, 0) rotate(${rotate}deg) scale(${scale})`;
  });
  const letters = [...label];
  const lags = letters.map((_, k) => STAGGER * (letters.length - 1 - k) ** WAVE);
  const mid = lags.reduce((a, b) => a + b, 0) / lags.length;

  return (
    <motion.a
      href={`#${id}`}
      aria-label={label}
      aria-current={current ? "true" : undefined}
      // Anchored at its bottom-stack row (also the no-JS layout); the flight is a transform from there.
      className="group pointer-events-auto absolute right-0 origin-right whitespace-nowrap text-4xl/none font-bold uppercase tracking-wider will-change-transform"
      style={{ bottom: `${EDGE + (n - 1 - props.i) * ROW + HALF - BIG / 2}rem`, transform }}
    >
      {letters.map((char, k) => (
        // Re-centred on the average lag, so the title itself (its hit area and focus ring) keeps mid-word timing.
        <Letter key={k} {...props} char={char} k={k} lead={mid - lags[k]} />
      ))}
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
      // Content column's right edge (container minus its padding).
      const container = document.querySelector(`#${visibleSections[0]?.id} .max-w-6xl`);
      const contentRight = container
        ? container.getBoundingClientRect().right - parseFloat(getComputedStyle(container).paddingRight)
        : Infinity;
      const titles = [...(root.current?.querySelectorAll("a") ?? [])];
      const widths = titles.map((a) => a.offsetWidth);
      const margin = document.documentElement.clientWidth - rem * EDGE - contentRight;
      const g: Geometry = {
        rem,
        height: window.innerHeight,
        tops: visibleSections.map(({ id }) => (document.getElementById(id)?.getBoundingClientRect().top ?? 0) + window.scrollY),
        maxScroll: document.documentElement.scrollHeight - window.innerHeight,
        widths,
        letters: titles.map((a) =>
          [...a.children].map((l) => (l as HTMLElement).offsetLeft + (l as HTMLElement).offsetWidth / 2 - a.offsetWidth),
        ),
        line: titles[0]?.offsetHeight ?? rem * BIG,
        margin,
        small: Math.min(SMALL, (margin - rem * ROOM) / Math.max(...widths)),
        tone: interpolate([0, 1], [css.getPropertyValue("--text-muted").trim(), css.getPropertyValue("--text").trim()]),
      };
      geometry.set(g);
      setCurrent(dockedIndex(window.scrollY, g));
    };
    measure();
    document.fonts.ready.then(measure); // title widths change once the display face loads
    const resize = new ResizeObserver(measure);
    resize.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      resize.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [geometry]);

  return (
    <div ref={root} className="pointer-events-none fixed inset-y-0 right-6 z-30 hidden lg:block">
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
