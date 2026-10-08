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
- Tracker gutter (`--spacing-tracker`, lg+): containers' right padding is `clamp(1.5rem, 6rem − (100vw − 72rem) / 2, 6rem)`, so content always ends ≥ 6rem from the viewport's right edge — the full 6rem at 1024px, back to the normal 1.5rem once the centred margin is wide enough (≈ 1296px). The tracker lives in that strip and never covers content.

## 3. Typography

- **Sans:** Geist Sans (`next/font`), fallback Inter → system-ui.
- **Mono:** Geist Mono.
- **Thai:** Geist has no Thai glyphs — add **Noto Sans Thai** (or IBM Plex Sans Thai) to the font stack so the Thai name renders correctly.

| Role | Classes |
|---|---|
| H1 (hero, one per page) | `text-4xl sm:text-6xl font-semibold tracking-tight leading-[1.05] text-[--text]` |
| H2 (section) | `text-3xl sm:text-4xl font-semibold tracking-tight` |
| H3 (card title) | `text-lg font-medium` |
| Eyebrow (section label) | mono `text-xs uppercase tracking-widest text-[--text-muted]` — format `01 / WORK` |
| Body | `text-base sm:text-lg leading-relaxed text-[--text-muted] max-w-prose` |
| Card body (one-liner, description) | `text-sm leading-relaxed text-[--text-muted]` |
| Meta / badge | mono `text-xs` |
| Section index | sans `text-xl/none font-bold uppercase tracking-wider`; docked `text-[--text]` at full size; on the rail rotated −90° at 0.8; in the stacks `text-[--text-muted]` at 0.6 (= 12px), smaller only if the margin is too narrow to keep 8px clear |

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

**Section index + scroll ruler (scroll tracker)** — `lg` (≥ 1024px) and up, fixed in the tracker gutter (§2), every element right-aligned on the `right-6` line, no backing panel. Top to bottom: passed sections (small, muted, one row each) with the docked section in the row after them → the odometer number → the tick rail → upcoming sections (small, muted, one row each). The docked title sits **flat** at full size when the widest title + 16px fits beside the content column (≈ 1388px and up); narrower, it docks **upright** at the rail top. No title ever comes within 8px of the content column, in any frame. One link per rendered section (labels from `CONTEXT.md`); each title flies along the rail with scroll (§6) and the docked one is `aria-current`. Real links in Tab order (after the footer); stack rows 24px apart (WCAG 2.5.8). Without JS the titles sit in the bottom stack as plain links.

**CopyButton** — copies a value to clipboard; icon swaps Copy → Check for 2s; announces "Copied" via `aria-live="polite"`; has an `aria-label` such as "Copy email".

## 5. Page structure (in order)

1. **Hero** (`#top`) — StatusPill → eyebrow-style line `Name (EN) · Role` → H1 → sub-headline → primary + secondary buttons. Background: `--glow` radial at top + faint grid pattern faded out with a mask + three drifting `--glow` aurora orbs + the WebGL constellation on top of them (§6). The CSS layers are the fallback for reduced motion and no JS. `min-h-[80svh]`, content vertically centered; the Hero itself has no entrance animation.
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
- **Section index** — scroll-linked, not triggered and not sprung: every title's pose is a direct function of the scroll position, so it tracks native scrolling 1:1 with no lag. Per title: waits in the bottom stack → over 4rem of scroll lifts out, rotates −90° onto the rail at 0.8 and partly brightens → rides up the rail level with its section's top edge → over the next 8rem turns flat (or stays upright, see §4) into the dock at full size and full `--text` → shrinks into the passed stack while the next title turns into the dock (the last section docks at the end of the page). Each stage eases in-out (cubic) over its scroll distance. Transform and colour only.
- **Hero constellation (WebGL, three.js):** 140 points (70 below 768px), each joined to ≤ 3 neighbours closer than a fixed radius; points round, `--accent` at 70%, lines `--accent` at 15%, read from the CSS token at runtime. The field sways ±6° on a 40s loop and the camera drifts on a 30s loop; with a mouse (never touch), the camera eases toward the pointer (≈ 0.4s, up to ≈ 3.4°). Fades in over 600ms once loaded and shares the aurora's bottom fade. Budget: geometry built once (no per-frame allocation), device pixel ratio ≤ 2, ≤ 60fps, paused while the hero is off screen. three.js is `import()`ed after hydration, so it never blocks first paint; under reduced motion it is not fetched, and turning reduced motion on tears the scene down (WebGL context released).
- **Ambient loops** (the only motion allowed past 600ms, all `transform`/paint, never layout):
  - Aurora — three `--glow` orbs (576px) in the Hero, `ease-in-out infinite alternate` drifts of 18s / 22s / 25s.
  - Border beam — a 60° `--accent` arc travelling round the border of the StatusPill and featured cards, 6s linear. A static conic-gradient square (side = the element's diagonal) is turned with `transform: rotate` inside a fixed 1px ring mask, so the compositor animates it with no per-frame repaint.
  - Status dot pulse — 2s, opacity only.
  - Constellation camera drift 30s and field sway 40s (see Hero constellation).
- **Grain:** static grayscale SVG noise (`feTurbulence`, 200px tile) over the whole page at 4% opacity, `pointer-events: none`. Not motion, so it stays on.
- **Scroll ruler (lg+):** the section index's rail — a right-gutter track between the passed and upcoming stacks, 41 ticks every 2.5% (medium every 12.5%, long every 25%); `--accent` fill = scroll progress via `scaleY`, plus a 2px `--accent` notch at the current progress (`translateY`); above it the docked section's eyebrow number rolls like an odometer, 280ms `cubic-bezier(0.2, 0.9, 0.2, 1)`. Decorative (`aria-hidden`).
- **Reduced motion:** no constellation (not loaded), tilt, magnetic drift, spotlight, aurora drift, border beam, pulse or icon nudge. Entrance becomes fade-only; the hairline and odometer change instantly; section index titles snap between their states (stack / docked / passed) with no flight; anchor jumps are instant. Grain and the scroll-progress fill (it only moves when the user scrolls) remain.
- No parallax on page content (the constellation's mouse parallax is the only parallax), no scroll-jacking, no smooth-scroll library. Scroll-linked motion is limited to the right-margin tracker.

## 7. Accessibility & responsive

- Test widths: **375px, 768px, 1440px**.
- Text contrast meets WCAG AA (see `--text-subtle` note).
- Touch targets ≥ 44×44px on mobile.
- Semantics: one `<h1>`; each section is `<section aria-labelledby>`; navbar in `<nav>`; footer in `<footer>`.
- External links: `target="_blank" rel="noopener noreferrer"`.
