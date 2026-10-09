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
// (headed by the CN wordmark the hero name flies into) → docked title → section number → rail →
// upcoming stack.
const n = visibleSections.length;
const LINE = 3.5; // right-14: 0.5rem clear of the ruler lane (right-2, w-10)
const EDGE = 1.5; // top-6 / bottom-6
const ROW = 1.5; // stack pitch: a 12px title + 12px gap (24px apart, WCAG 2.5.8)
const HALF = 0.375; // centre of a 12px stacked title
const BIG = 2.25; // text-4xl/none line box
const ODOMETER = 1.125; // text-lg/none
const GAP = 0.75;
const DOCK_TOP = EDGE + n * ROW + GAP; // below the longest passed stack (wordmark + n - 1), so also below the navbar
const NUMBER_TOP = DOCK_TOP + BIG + GAP;
const RAIL_TOP = NUMBER_TOP + ODOMETER + GAP;
const RAIL_BOTTOM = EDGE + n * ROW; // from the viewport bottom: above the upcoming stack
const SMALL = 1 / 3; // stacked titles, unless the margin is too narrow for that (then smaller)
const RIDE = 0.5;
const LIFT = 4; // scroll (rem) for leaving the stack and turning onto the rail
const DOCK = 8; // scroll (rem) for turning off the rail into the dock, and for the previous title to retire
const WAKE = 8; // scroll (rem) from the top of the page over which a title already due on the rail lifts out
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
  wordmark: Wordmark | null;
};

// The hero name's flight into the wordmark row (DESIGN.MD §6). x is px from the right-14 line, y px from
// the viewport top.
type Wordmark = {
  fly: number; // scroll px by which every letter has landed: the hero name's bottom edge
  from: [x: number, docY: number, w: number, h: number][]; // each hero letter's centre (y in the document) and size
  to: [x: number, y: number][]; // where each initial lands: its letter in the CN link
  initials: number[]; // which hero letters are the initials
  scale: number; // hero letter → stacked letter
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
// 4× speed, so its input is squared to ease the letter off the rail instead of jerking it off.
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
// A letter's lag (px of scroll behind the leading letter) applies in full while its title waits and
// rides, and folds smoothly to 0 over the last `dock` px, so every letter lands on the same scroll px
// (even at the end of the page, which a trailing letter could otherwise never reach).
const fold = (left: number, lag: number, dock: number) => left + lag * ease(left / dock);

// Scrubbed 1:1 by scroll: stack → turns onto the rail and rides up it, its foot level with its section's
// top edge → turns flat into the giant dock beneath the navbar → shrinks into the passed stack while the
// next docks.
function flight(i: number, y: number, lag: number, g: Geometry): Pose {
  const railTop = g.rem * RAIL_TOP;
  const ride = g.height - g.rem * RAIL_BOTTOM - railTop;
  const lift = g.rem * LIFT;
  const dock = g.rem * DOCK;
  const left = fold(dockAt(i, g) - y, lag, dock); // scroll still to go before this letter docks
  // Lifts toward a rail point that already moves with the scroll, so it joins the ride at scroll speed
  // (no stop-and-go where lift and ride meet). Never before the page has been scrolled: on load every
  // title waits in the stack, and one already due on the rail lifts out over the first WAKE rem.
  const lifting = ease(Math.min((ride + lift - left) / lift, (y - lag) / (g.rem * WAKE)));
  const lifted = mix(rest(i, g), onRail(railTop + Math.max(left, 0), i, g), lifting);
  const docking = arrive((dock - left) / dock);
  const retiring = i < n - 1 ? ease((dock - fold(dockAt(i + 1, g) - y, lag, dock)) / dock) : 0;
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

// The pose of a letter running `lag` rem behind its title's leading letter. Reads both values on every
// run: useTransform tracks the motion values read, so an early return before scroll.get() would leave it
// deaf to scrolling.
function read({ i, scroll, geometry, discrete }: Props, lag: number) {
  const y = scroll.get();
  const g = geometry.get();
  return g && { g, pose: discrete ? snap(i, y, g) : flight(i, y, g.rem * lag, g) };
}

// A letter flies on its own copy of the title's path, `lag` behind the leading letter, expressed relative
// to the title it sits in (`mid`: the title moves with its average letter, whose transform it inherits).
// Every resting state leaves it untransformed.
function Letter({ char, k, lag, mid, ...props }: Props & { char: string; k: number; lag: number; mid: number }) {
  const transform = useTransform(() => {
    const title = read(props, mid);
    const self = read(props, lag);
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
    const self = read(props, lag);
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
  const letters = [...label];
  const lags = letters.map((_, k) => STAGGER * (letters.length - 1 - k) ** WAVE);
  // The title itself (its hit area and focus ring) keeps its average letter's timing.
  const mid = lags.reduce((a, b) => a + b, 0) / lags.length;
  const transform = useTransform(() => {
    const p = read(props, mid);
    if (!p) return REST;
    const [x, y, rotate, scale] = p.pose;
    return `translate3d(${x}px, ${y - rest(props.i, p.g)[1]}px, 0) rotate(${rotate}deg) scale(${scale})`;
  });

  return (
    <motion.a
      data-title
      href={`#${id}`}
      aria-label={label}
      aria-current={current ? "true" : undefined}
      // Anchored at its bottom-stack row (also the no-JS layout); the flight is a transform from there.
      className="group pointer-events-auto absolute right-0 origin-right whitespace-nowrap text-4xl/none font-bold uppercase tracking-wider will-change-transform"
      style={{ bottom: `${EDGE + (n - 1 - props.i) * ROW + HALF - BIG / 2}rem`, transform }}
    >
      {letters.map((char, k) => (
        <Letter key={k} {...props} char={char} k={k} lag={lags[k]} mid={mid} />
      ))}
    </motion.a>
  );
}

const LETTERS = [...identity.name.replace(/\s/g, "")];

// Letter k's progress 0–1: they all set off with the first scroll and the rightmost (nearest the index)
// travel fastest, so the name peels away from its right end and every letter lands at `fly`.
const travel = (k: number, y: number, w: Wordmark) =>
  ease(y / (w.fly * (1 - (0.4 * k) / (LETTERS.length - 1))));

type WordmarkProps = Omit<Props, "i">;

// One hero letter in flight: from its place in the hero name (scrolling with the page) to its initial's
// place in the CN link, or, for every other letter, toward the link while it shrinks and fades out. Each
// turns a little mid-flight, so the name scatters rather than slides.
function FlyingLetter({ char, k, scroll, geometry, discrete }: WordmarkProps & { char: string; k: number }) {
  const transform = useTransform(() => {
    const y = scroll.get();
    const w = geometry.get()?.wordmark;
    if (!w) return "none";
    const [x0, docY, lw, lh] = w.from[k];
    const t = travel(k, y, w);
    const j = w.initials.indexOf(k);
    const [x1, y1] = j >= 0 ? w.to[j] : [(w.to[0][0] + w.to[w.to.length - 1][0]) / 2, w.to[0][1]];
    const x = x0 + (x1 - x0) * t;
    const top = docY - y + (y1 - (docY - y)) * t;
    const s = 1 + ((j >= 0 ? w.scale : w.scale / 2) - 1) * t;
    const r = Math.sin(Math.PI * t) * (((k * 47) % 41) - 20);
    // Anchored at its top-right corner (right-0 top-0), so its centre starts at (-lw/2, lh/2).
    return `translate3d(${x + lw / 2}px, ${top - lh / 2}px, 0) rotate(${r}deg) scale(${s})`;
  });
  const opacity = useTransform(() => {
    const y = scroll.get();
    const w = geometry.get()?.wordmark;
    // Shown only in flight: at 0 the hero's own letters are in place, from `fly` on the CN link is.
    if (!w || discrete || y <= 0 || y >= w.fly) return 0;
    return w.initials.includes(k) ? 1 : 1 - Math.min(Math.max((travel(k, y, w) - 0.25) / 0.6, 0), 1);
  });
  const color = useTransform(() => {
    const y = scroll.get();
    const g = geometry.get();
    return g?.wordmark ? g.tone(1 - travel(k, y, g.wordmark)) : "var(--text)";
  });

  return (
    <motion.span
      className="absolute top-0 right-0 text-8xl leading-[0.9] font-bold tracking-tight uppercase will-change-transform"
      style={{ transform, opacity, color }}
    >
      {char}
    </motion.span>
  );
}

// Top row of the passed stack: the CN wordmark, a link to the top. It takes over from the flying letters
// once they land (and, without JS or before measuring, simply sits there).
function Wordmark(props: WordmarkProps) {
  const { scroll, geometry } = props;
  const opacity = useTransform(() => {
    const w = geometry.get()?.wordmark;
    return !w || scroll.get() >= w.fly ? 1 : 0;
  });
  const transform = useTransform(() => `scale(${geometry.get()?.small ?? SMALL})`);

  return (
    <>
      <motion.a
        data-wordmark-link
        href="#top"
        aria-label={identity.name}
        className="group pointer-events-auto absolute right-0 origin-right whitespace-nowrap text-4xl/none font-bold uppercase tracking-wider"
        style={{ top: `${EDGE + HALF - BIG / 2}rem`, transform, opacity }}
      >
        {[...identity.initials].map((char) => (
          <span key={char} className="inline-block text-text-muted group-hover:text-text">
            {char}
          </span>
        ))}
      </motion.a>
      <div aria-hidden>
        {LETTERS.map((char, k) => (
          <FlyingLetter key={k} {...props} char={char} k={k} />
        ))}
      </div>
    </>
  );
}

// Where the hero name's letters start and where the initials land, or null if the hero isn't there.
function measureWordmark(anchor: number, small: number, root: HTMLElement | null): Wordmark | null {
  const h1 = document.getElementById("top-heading");
  const link = root?.querySelector<HTMLElement>("[data-wordmark-link]");
  const letters = [...(h1?.querySelectorAll<HTMLElement>("[data-letter]") ?? [])];
  if (!h1 || !link || letters.length !== LETTERS.length) return null;
  // Layout offsets (offsetLeft/Top, relative to the h1), not live rects: the intro may still be moving them.
  const box = h1.getBoundingClientRect();
  const marks = [...link.children] as HTMLElement[];
  return {
    fly: box.bottom + window.scrollY,
    from: letters.map((l) => [
      box.left + l.offsetLeft + l.offsetWidth / 2 - anchor,
      box.top + window.scrollY + l.offsetTop + l.offsetHeight / 2,
      l.offsetWidth,
      l.offsetHeight,
    ]),
    // The link is scaled by `small` about its right edge, centred on its row.
    to: marks.map((m) => [
      -small * (link.offsetWidth - m.offsetLeft - m.offsetWidth / 2),
      link.offsetTop + link.offsetHeight / 2,
    ]),
    initials: letters.flatMap((l, k) => (l.hasAttribute("data-initial") ? [k] : [])),
    scale: (small * parseFloat(getComputedStyle(link).fontSize)) / parseFloat(getComputedStyle(letters[0]).fontSize),
  };
}

export function SectionIndex() {
  const root = useRef<HTMLDivElement>(null);
  const discrete = !!useReducedMotion();
  const { scrollY } = useScroll();
  const geometry = useMotionValue<Geometry | null>(null);
  const [current, setCurrent] = useState(-1);

  // While the hero name's copy is in flight (scrolled at all, lg+, motion allowed), the hero's own letters
  // hide (globals.css `wordmark:`). Set in the same frame as the scroll that moves the copy.
  const swap = (y: number, g: Geometry | null) =>
    document.documentElement.toggleAttribute("data-wordmark", !discrete && !!g?.wordmark && y > 0);

  useMotionValueEvent(scrollY, "change", (y) => {
    const g = geometry.get();
    swap(y, g);
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
      const small = Math.min(SMALL, (margin - rem * ROOM) / Math.max(...widths));
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
        small,
        tone: interpolate([0, 1], [css.getPropertyValue("--text-muted").trim(), css.getPropertyValue("--text").trim()]),
        wordmark: measureWordmark(anchor, small, root.current),
      };
      geometry.set(g);
      swap(window.scrollY, g);
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
      document.documentElement.removeAttribute("data-wordmark");
    };
    // swap reads `discrete`: re-measuring when reduced motion toggles also re-syncs the hero letters.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geometry, discrete]);

  return (
    <>
      {/* Frosted corners behind the passed stack + dock and the upcoming stack (DESIGN.MD §4): content
          passing under them blurs, so the titles stay legible over anything. The bottom one fades out once
          the last section docks and nothing waits there, so it never blurs the footer. */}
      <div
        aria-hidden
        className="scrim-top pointer-events-none fixed top-0 right-0 z-20 hidden w-md bg-bg/80 backdrop-blur-sm lg:block"
        style={{ height: `${RAIL_TOP}rem` }}
      />
      <div
        aria-hidden
        className={`scrim-bottom pointer-events-none fixed right-0 bottom-0 z-20 hidden w-sm bg-bg/80 backdrop-blur-sm transition-opacity duration-200 lg:block ${current < n - 1 ? "opacity-100" : "opacity-0"}`}
        style={{ height: `${RAIL_BOTTOM + 2 * ROW}rem` }}
      />
      <ScrollRuler />
      <div ref={root} className="pointer-events-none fixed inset-y-0 right-14 z-30 hidden lg:block">
        {/* The docked section's eyebrow number, rolling like an odometer. Decorative: the titles are the links. */}
        <p
          aria-hidden
          className={`absolute right-0 font-mono text-lg leading-none text-text transition-opacity duration-200 ${current >= 0 ? "opacity-100" : "opacity-0"}`}
          style={{ top: `${NUMBER_TOP}rem` }}
        >
          <Odometer digits={String(Math.max(current, 0) + 1).padStart(2, "0")} />
        </p>
        <Wordmark scroll={scrollY} geometry={geometry} discrete={discrete} />
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
    </>
  );
}
