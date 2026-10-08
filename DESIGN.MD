# DESIGN.MD — Design System

This file defines **how things look and behave**. It contains no copy — all text comes from `CONTEXT.md`.

## 1. Direction

Dark studio aesthetic (Linear / Vercel). Mood reference: getartcraft.com — deep near-black canvas, thin luminous borders, crisp type, bento cards. **Reference only: never copy its assets, text or code.**

Principles:
- **One accent color.** Everything else is grayscale.
- **Depth from borders and glow**, not drop shadows.
- **Monospace for metadata** (tags, dates, labels); sans for everything else.
- **Motion is purposeful and physics-driven** (springs, pointer-tracked light, slow ambient loops, one lightweight WebGL constellation in the hero — §6), never in the way of reading, and fully off under `prefers-reduced-motion` (the WebGL layer is never even loaded).

## 2. Tokens

Define as CSS variables in `globals.css`; map to Tailwind theme names.

### Color

| Token | Value | Use |
|---|---|---|
| `--bg` | `#09090b` | Page background |
| `--surface` | `#121215` | Cards, navbar |
| `--surface-2` | `#18181b` | Hover / raised surfaces |
| `--border` | `rgba(255,255,255,0.08)` | Default 1px borders, dividers |
| `--border-strong` | `rgba(255,255,255,0.16)` | Hover borders |
| `--text` | `#f4f4f5` | Headings, primary text |
| `--text-muted` | `#a1a1aa` | Body, descriptions, **all small text** |
| `--text-subtle` | `#71717a` | Decorative only or text ≥ 18px — fails WCAG AA (≈4.1:1) at small sizes |
| `--accent` | `#38bdf8` | Links, focus ring, active nav, highlights |
| `--glow` | `rgba(56,189,248,0.12)` | Radial background gradients only |
| `--success` | `#22c55e` | Status-pill dot only |

### Radius
- Cards: `16px` (`rounded-2xl`)
- Buttons, inputs: `10px` (`rounded-[10px]`)
- Badges: `6px` (`rounded-md`)
- Navbar, status pill: `9999px` (`rounded-full`)

### Spacing & layout
- Container: `max-w-6xl mx-auto px-4 sm:px-6 lg:pr-tracker`
- Section vertical padding: `py-16` mobile, `py-24` ≥ `md`
- Grid gap: `gap-4`
- Card padding: `p-6`
- Breakpoints: Tailwind defaults. The scroll tracker (section index + ruler) shows from `lg` (1024px).
- Tracker gutter (`--spacing-tracker`, lg+): containers' right padding is `clamp(1.5rem, 8rem − (100vw − 72rem) / 2, 8rem)`, so content always ends ≥ 8rem from the viewport's right edge — the full 8rem at 1024px, back to the normal 1.5rem once the centred margin is wide enough (≈ 1360px). The rail and the stacks live in that strip and never cover content; only the docked title (§4) reaches over it.

## 3. Typography

- **Sans:** Geist Sans (`next/font`), fallback Inter → system-ui.
- **Mono:** Geist Mono.
- **Thai:** Geist has no Thai glyphs — add **Noto Sans Thai** (or IBM Plex Sans Thai) to the font stack so the Thai name renders correctly.

| Role | Classes |
|---|---|
| H1 (hero wordmark, one per page) | `text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tight leading-[0.9] text-[--text]` |
| H2 (section) | `text-3xl sm:text-4xl font-semibold tracking-tight` |
| H3 (card title) | `text-lg font-medium` |
| Eyebrow (section label) | mono `text-xs uppercase tracking-widest text-[--text-muted]` — format `01 / WORK` |
| Body | `text-base sm:text-lg leading-relaxed text-[--text-muted] max-w-prose` |
| Card body (one-liner, description) | `text-sm leading-relaxed text-[--text-muted]` |
| Meta / badge | mono `text-xs` |
| Section index | sans `text-4xl/none font-bold uppercase tracking-wider`; docked `text-[--text]` at full size (36px); on the rail rotated −90° at 0.5; in the stacks `text-[--text-muted]` at 1/3 (= 12px), smaller only if the margin is too narrow to keep 8px clear |

## 4. Components

**Navbar** — `fixed top-4`, horizontally centered pill; `bg-[--surface]/70 backdrop-blur-md border border-[--border]`. Left: `CN` logo → `#top`. Center: Work · Experience · Stack · Contact. Right: primary CTA "Get in Touch" → `#contact`. Below `md`: links collapse into a menu button (Radix Dropdown or Sheet); CTA stays visible. Active section link uses `--accent`.

**Button**
- Primary: `bg-[--text] text-[--bg]`, hover `opacity-90`
- Secondary: transparent, `border border-[--border]`, hover `bg-[--surface-2] border-[--border-strong]`
- Both: `h-10 px-4`, icon + label gap `2`, `focus-visible:ring-2 ring-[--accent] ring-offset-2 ring-offset-[--bg]`
- Primary CTAs (Hero "View Projects", Navbar "Get in Touch") are **magnetic** — see §6.
- Arrow-style icons nudge 2px in their direction on hover (§6): `ArrowDown` down, `ExternalLink` up-right, `ArrowLeft` left. Other icons stay still.

**Card** — `bg-[--surface] border border-[--border] rounded-2xl p-6`. Hover: `border-[--border-strong]` + a two-layer **spotlight** following the pointer (§6): a soft `--glow` wash behind the content and a 1px `--accent` border light, brightest on the stretch of border nearest the pointer. Desktop pointer devices only; off for reduced motion. **Featured** project cards also get the border beam and 3D tilt (§6).

**Badge** — mono `text-xs`, `border border-[--border] rounded-md px-2 py-0.5 text-[--text-muted]`.

**StatusPill** — rounded-full border pill with a small pulsing `--success` dot (CSS animation, not an emoji) + label, plus the border beam (§6).

**Section index + scroll ruler (scroll tracker)** — `lg` (≥ 1024px) and up, fixed in the tracker gutter (§2), no backing panel, in two lanes. **Ruler lane** (`right-2`, 40px wide): the full-height scroll ruler (§6) with its milestone labels and the percentage readout riding its indicator. **Title lane**, every element right-aligned on the `right-14` line, 8px clear of the ruler, top to bottom: passed sections (small, muted, one row each) → the docked section, a giant flat title beneath the navbar → the docked section's number (odometer) → the rail stretch the titles ride, upright right beside the ruler → upcoming sections (small, muted, one row each). The docked title (and its turn into and out of the dock) is the only part allowed over the content column, like the navbar; every other title, in every frame, stays ≥ 8px clear of it, and no title ever crosses into the ruler lane (where the two limits clash while a wide title turns, the content wins off the dock and the ruler wins in the dock turn). One link per rendered section (labels from `CONTEXT.md`); each title flies along the rail with scroll (§6) and the docked one is `aria-current`. Real links in Tab order (after the footer); stack rows 24px apart (WCAG 2.5.8). Without JS the titles sit in the bottom stack as plain links.

**CopyButton** — copies a value to clipboard; icon swaps Copy → Check for 2s; announces "Copied" via `aria-live="polite"`; has an `aria-label` such as "Copy email".

## 5. Page structure (in order)

1. **Hero** (`#top`) — centred monolith (`items-center text-center`; lg+ pads both sides by the tracker gutter so it centres on the viewport): StatusPill → H1 wordmark `Name (EN)` → Role as a mono uppercase tagline → the one-sentence line (`max-w-xl`) → primary + secondary buttons, centred. Background: `--glow` radial at top + faint grid pattern faded out with a mask + three drifting `--glow` aurora orbs + the WebGL constellation on top of them (§6). The CSS layers are the fallback for reduced motion and no JS. `min-h-[80svh]`, content vertically centered; the Hero itself has no entrance animation.
2. **Work** (`#work`, eyebrow `01 / WORK`) — bento grid.
   - `lg`: `grid-cols-6`, CONTEXT order, no gaps:

     | Row | Cards (col-span) |
     |---|---|
     | 1 | FinLife Tracker (3) · TFT CompStat (3) |
     | 2 | Wound Segmentation (4) · JHunt (2) |

     If projects are added or removed, choose spans so every row sums to 6 and featured cards are ≥ 3.
   - `md`: 2 columns, every card spans 1. `< md`: 1 column. Always CONTEXT order.
   - Card content: category (eyebrow style) → title → one-liner → **highlight** callout (featured only) → up to 5 stack badges → links row: "Live" (`ExternalLink` icon) and "Code" (`Github` icon). Hide any link that is `TODO` or `—`. If an image exists: `next/image`, `aspect-video`, rounded, top of card.
   - **Highlight callout:** `border-l-2 border-[--accent] pl-3`, mono `text-xs text-[--text-muted]`.
   - Featured cards show `description` below the one-liner at `lg` only; mobile and non-featured cards show the one-liner alone.
3. **Experience** (`#experience`, `02 / EXPERIENCE`) — vertical timeline: period (mono) left on desktop / above on mobile. **Not rendered if CONTEXT has no entries** (renumber eyebrows accordingly).
4. **Stack** (`#stack`, `03 / STACK`) — 4 group cards (`md`: 2×2, mobile: 1 column), each with group title and badges.
5. **Contact** (`#contact`, `04 / CONTACT`) — one wide card: heading + short line, then one row per contact channel in CONTEXT (email, GitHub): lucide icon · display text · CopyButton · open-link button. Hide `TODO` channels.
6. **Footer** — `border-t border-[--border]`, `© {current year} Charintorn Nillapat` + GitHub icon link. Small, muted.

Fixed page chrome outside the flow: Navbar, scroll tracker (section index + ruler, `lg`).

## 6. Motion

Crafted, but never in the way of reading. Every effect below uses `--accent` / `--glow` only (one accent colour, §1), animates `transform`, `opacity` or paint-only custom properties (never layout properties on pointer move) — or, for the constellation, draws on its own WebGL canvas — and is switched off by `prefers-reduced-motion: reduce`.

- **Entrance:** fade in + `translateY(8px → 0)`, 400ms, ease-out, triggered once when in view; children stagger 60ms. Section hairline (top of each section header) draws in `scaleX(0 → 1)` from the left, 600ms, `cubic-bezier(0.2, 0.9, 0.2, 1)`.
- **Hover:** color/border/opacity transitions 150–200ms; focusable elements never transition `outline-color`. Scale at most `1.02`. Arrow icons in buttons nudge **2px** toward their direction (`translate`, 150ms, `motion-safe:` only).
- **Smooth scroll:** anchor jumps glide with native `scroll-behavior: smooth`, set only under `prefers-reduced-motion: no-preference`.
- **Spotlight (Card):** pointer position in `--mouse-x/--mouse-y` (registered custom properties easing 120ms ease-out, so the light glides). Layers fade in over 200ms on hover: surface wash `radial-gradient(circle 320px, --glow → transparent)` behind content; border light `radial-gradient(circle 192px, --accent → transparent)` masked to the 1px ring. `(hover: hover) and (pointer: fine)` only.
- **Springs** (pointer-driven, mouse only): `stiffness 150`, `damping 20`.
  - **Tilt** — featured project cards: `rotateX/rotateY` up to **4°** from the pointer offset, perspective 1000px; settles flat on leave.
  - **Magnetic** — primary CTAs: drift up to **6px** toward the pointer within an 8px zone around the button (md+); springs back on leave.
- **Section index** — scroll-linked, not triggered and not sprung: every title's pose is a direct function of the scroll position, so it tracks native scrolling 1:1 with no lag. Per title: waits in the bottom stack, a clean horizontal word in its own row → over 4rem of scroll lifts out (cubic in-out) toward a rail point that already moves with the scroll, rotating −90° onto the rail at 0.5 and partly brightening, so it joins the ride at scroll speed with no stop-and-go. Nothing lifts before the page is scrolled: on load every title waits in the stack, whatever the viewport height, and one already due on the rail lifts out over the first 8rem of scroll → rides up the rail with its foot (first letter) level with its section's top edge, so the upright word never hangs over the waiting stack → over the next 8rem turns flat and grows into the giant dock beneath the navbar in full `--text`, eased by `cubic-bezier(0.25, 1, 0.5, 1)` on a squared input (eases off the rail, long soft settle, no abrupt start or stop) → shrinks into the passed stack (cubic in-out) while the next title docks (the last section docks at the end of the page). **Split letters:** every letter runs that same path; the m-th letter from the right trails the first by 0.5 · m^1.35 rem of scroll (each gap a little wider than the last: a trailing wave), so a title peels off letter by letter, strings out up the rail and reassembles in the dock. The lag folds smoothly to 0 over the last 8rem before the dock and before the end of the retire, so every letter lands on the same scroll position, also at the very end of the page; at rest letters are untransformed. Letters move with `translate3d` on their own compositor layers (subpixel-smooth, no repaint). Transform and colour only.
- **Hero constellation (WebGL, three.js):** 140 points (70 below 768px), each joined to ≤ 3 neighbours closer than a fixed radius; points round, `--accent` at 70%, lines `--accent` at 15%, read from the CSS token at runtime. The field sways ±6° on a 40s loop and the camera drifts on a 30s loop; with a mouse (never touch), the camera eases toward the pointer (≈ 0.4s, up to ≈ 3.4°). Fades in over 600ms once loaded and shares the aurora's bottom fade. Budget: geometry built once (no per-frame allocation), device pixel ratio ≤ 2, ≤ 60fps, paused while the hero is off screen. three.js is `import()`ed after hydration, so it never blocks first paint; under reduced motion it is not fetched, and turning reduced motion on tears the scene down (WebGL context released).
- **Ambient loops** (the only motion allowed past 600ms, all `transform`/paint, never layout):
  - Aurora — three `--glow` orbs (576px) in the Hero, `ease-in-out infinite alternate` drifts of 18s / 22s / 25s.
  - Border beam — a 60° `--accent` arc travelling round the border of the StatusPill and featured cards, 6s linear. A static conic-gradient square (side = the element's diagonal) is turned with `transform: rotate` inside a fixed 1px ring mask, so the compositor animates it with no per-frame repaint.
  - Status dot pulse — 2s, opacity only.
  - Constellation camera drift 30s and field sway 40s (see Hero constellation).
- **Grain:** static grayscale SVG noise (`feTurbulence`, 200px tile) over the whole page at 4% opacity, `pointer-events: none`. Not motion, so it stays on.
- **Scroll ruler (lg+):** a full-height track in its own lane at the viewport's right edge (`fixed inset-y-6 right-2`, 40px wide), the section titles riding just left of it. Right to left: milestone labels every 5% (`00`–`100`, mono `text-2xs` = 10px, `--text-subtle`), a 2px `--border-strong` spine, then 41 ticks every 2.5% pointing left: long every 25% (12px × 2px, `--text-muted`), medium every 12.5% (8px, `--text-muted`), short (6px, `--text-subtle`). `--accent` fill = scroll progress via `scaleY`. The **indicator** — a 14px × 2px `--accent` bar with a `shadow-glow` (`0 0 6px --accent`) — and its `000%`–`100%` readout (mono `text-2xs`, `--accent`, opaque `--bg` backing that hides the label it passes) ride the track together at the current progress (`translateY`, 1:1 with scroll). The readout's digits roll like an odometer, 280ms `cubic-bezier(0.2, 0.9, 0.2, 1)` — the same odometer as the docked section's number under the docked title. Decorative (`aria-hidden`).
- **Reduced motion:** no constellation (not loaded), tilt, magnetic drift, spotlight, aurora drift, border beam, pulse or icon nudge. Entrance becomes fade-only; the hairline and the odometers (section number, percentage readout) change instantly; section index titles snap between their states (stack / docked / passed) with no flight and no letter split; anchor jumps are instant. Grain and the scroll-progress fill (it only moves when the user scrolls) remain.
- No parallax on page content (the constellation's mouse parallax is the only parallax), no scroll-jacking, no smooth-scroll library. Scroll-linked motion is limited to the right-margin tracker.

## 7. Accessibility & responsive

- Test widths: **375px, 768px, 1440px**.
- Text contrast meets WCAG AA (see `--text-subtle` note).
- Touch targets ≥ 44×44px on mobile.
- Semantics: one `<h1>`; each section is `<section aria-labelledby>`; navbar in `<nav>`; footer in `<footer>`.
- External links: `target="_blank" rel="noopener noreferrer"`.
