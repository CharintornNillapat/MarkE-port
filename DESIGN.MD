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
Blueprint: square corners everywhere except the floating capsules.
- Cards, buttons, inputs, badges, icon buttons: square (no radius)
- Navbar, its links and CTA, status pill: `9999px` (`rounded-full`)

### Spacing & layout
- Container: `max-w-6xl mx-auto px-4 sm:px-6 lg:pr-tracker`
- Section vertical padding: `py-16` mobile, `py-24` ≥ `md`
- Grid gap: `gap-4`
- Card padding: `p-6`
- Breakpoints: Tailwind defaults. The scroll tracker (section index + ruler) shows from `lg` (1024px).
- Tracker gutter (`--spacing-tracker`, lg+): containers' right padding is `clamp(1.5rem, 8rem − (100vw − 72rem) / 2, 8rem)`, so content always ends ≥ 8rem from the viewport's right edge — the full 8rem at 1024px, back to the normal 1.5rem once the centred margin is wide enough (≈ 1360px). The rail and the stacks live in that strip and never cover content; only the docked title (§4) reaches over it.

## 3. Typography

- **Sans:** Geist Sans (`next/font`), fallback Inter → system-ui.
- **Serif (accent words only):** Instrument Serif italic 400 (`next/font`, `font-serif`), fallback Georgia. One word per heading (CONTEXT.md §UI Labels, accent words), `font-serif font-normal italic` inside the sans heading.
- **Mono:** Geist Mono.
- **Thai:** Geist has no Thai glyphs — add **Noto Sans Thai** (or IBM Plex Sans Thai) to the font stack so the Thai name renders correctly.

| Role | Classes |
|---|---|
| H1 (hero wordmark, one per page) | `text-5xl sm:text-7xl lg:text-8xl font-bold uppercase tracking-tight leading-[0.9] text-[--text]` |
| H2 (section) | `text-3xl sm:text-4xl font-semibold tracking-tight`, its accent word in italic serif |
| H3 (card title) | `text-lg font-medium` |
| Eyebrow (section label) | mono `text-xs uppercase tracking-widest text-[--text-muted]` — format `01 / WORK` |
| Body | `text-base sm:text-lg leading-relaxed text-[--text-muted] max-w-prose` |
| Card body (one-liner, description) | `text-sm leading-relaxed text-[--text-muted]` |
| Meta / badge | mono `text-xs` |
| Section index | sans `text-4xl/none font-bold uppercase tracking-wider`; docked `text-[--text]` at full size (36px); on the rail rotated −90° at 0.5; in the stacks `text-[--text-muted]` at 1/3 (= 12px), smaller only if the margin is too narrow to keep 8px clear |

## 4. Components

**Navbar** — `fixed top-4`, horizontally centered pill; `bg-[--surface]/70 backdrop-blur-md border border-[--border]`. Left: `CN` logo → `#top`. Center: Work · Experience · Stack · Contact. Right: primary CTA "Get in Touch" → `#contact`. Below `md`: links collapse into a menu button (Radix Dropdown or Sheet); CTA stays visible. Active section link uses `--accent`. Link hover inverts: `bg-[--text] text-[--bg]`.

**Button**
- Primary: `bg-[--text] text-[--bg]`, hover `opacity-90`
- Secondary: transparent, `border border-[--border]`; hover inverts to `bg-[--text] text-[--bg] border-[--text]` (icons follow, they use `currentColor`). Footer and drawer icon buttons invert the same way.
- Both: `h-10 px-4`, icon + label gap `2`, `focus-visible:ring-2 ring-[--accent] ring-offset-2 ring-offset-[--bg]`
- Primary CTAs (Hero "View Projects", Navbar "Get in Touch") are **magnetic** — see §6.
- Arrow-style icons nudge 2px in their direction on hover (§6): `ArrowDown` down, `ExternalLink` up-right, `ArrowLeft` left. Other icons stay still.

**Card** — `bg-[--surface] border border-[--border] p-6`, square. In a blueprint grid (§5) it drops its own border and the grid's shared lines frame it. Hover: a two-layer **spotlight** following the pointer (§6): a soft `--glow` wash behind the content and a 1px `--accent` border light, brightest on the stretch of border nearest the pointer. Desktop pointer devices only; off for reduced motion. **Featured** project cards also get the border beam (§6). No tilt: a tile leaning out of a seamless grid breaks its lines.

**Card strip** — a header bar across a grid card's top edge: mono `text-xs uppercase tracking-widest text-[--text-muted]`, `px-6 py-3 border-b border-[--border]`, the label left (project category, or the skill group as the card's H3) and the card's two-digit number right (decorative, `aria-hidden`).

**Section bar** — each section opens with a full-bleed bar: `bg-[--bg]/80 backdrop-blur-md border-b border-[--border]`, the eyebrow (`01 / WORK`) left on the container's grid; its top hairline draws in (§6). From `md` it is `sticky top-0` and 88px tall, so the eyebrow sits level with the navbar: it pins while its section is on screen and the next section's bar pushes it out. Below `md` it is 48px and scrolls away.

**Badge** — mono `text-xs`, `border border-[--border] px-2 py-0.5 text-[--text-muted]`, square.

**StatusPill** — rounded-full border pill with a small pulsing `--success` dot (CSS animation, not an emoji) + label. No border beam: a capsule + border + dot + glow stack reads as a generic AI badge (antislop R-09), so the dot alone carries the status.

**Section index + scroll ruler (scroll tracker)** — `lg` (≥ 1024px) and up, fixed in the tracker gutter (§2), in two lanes, over two **scrims**: frosted corners (`bg-[--bg]/80 backdrop-blur-sm`, faded out radially from the corner by a mask, `z-20`, pointer-transparent), one top-right behind the passed stack, dock and number (28rem wide, down to the rail top) and one bottom-right behind the upcoming stack (24rem wide), which fades out (200ms) once the last section docks and nothing waits there, so it never blurs the footer. Content passing under them blurs, so the titles stay legible over anything. **Ruler lane** (`right-2`, 48px wide): the scroll ruler (§6), a page-length measuring tape scrolling with the page, and an indicator + readout travelling down the viewport with scroll progress. **Title lane**, every element right-aligned on the `right-14` line, 8px clear of the ruler, top to bottom: the `CN` wordmark link to `#top` (§6 wordmark flight), then passed sections (small, muted, one row each) → the docked section, a giant flat title beneath the navbar → the docked section's number (odometer) → the rail stretch the titles ride, upright right beside the ruler → upcoming sections (small, muted, one row each). The docked title (and its turn into and out of the dock) is the only part allowed over the content column, like the navbar; every other title, in every frame, stays ≥ 8px clear of it, and no title ever crosses into the ruler lane (where the two limits clash while a wide title turns, the content wins off the dock and the ruler wins in the dock turn). One link per rendered section (labels from `CONTEXT.md`); each title flies along the rail with scroll (§6) and the docked one is `aria-current`. Real links in Tab order (after the footer); stack rows 24px apart (WCAG 2.5.8). Without JS the titles sit in the bottom stack as plain links.

**CopyButton** — copies a value to clipboard; icon swaps Copy → Check for 2s and announces "Copied" via `aria-live="polite"`; if the clipboard write is blocked it swaps to X and announces "Copy failed" instead; has an `aria-label` such as "Copy email".

## 5. Page structure (in order)

1. **Hero** (`#top`) — centred monolith (`items-center text-center`; lg+ pads both sides by the tracker gutter so it centres on the viewport): StatusPill → H1 wordmark (CONTEXT.md §Hero: `Mark Charintorn`) → Role as a mono uppercase tagline → the one-sentence line (`max-w-xl`) → primary + secondary buttons, centred. Background: `--glow` radial at top + faint grid pattern faded out with a mask + three drifting `--glow` aurora orbs + the WebGL constellation on top of them (§6). The CSS layers are the fallback for reduced motion and no JS. `min-h-[80svh]`, content vertically centered; it plays the intro sequence once on load (§6). The H1 is one span per letter (`aria-hidden`, with the wordmark as `sr-only` text) so the intro and the wordmark flight (§6) can move single letters. Ends with the **marquee**: a full-bleed `border-y` strip of every skill (CONTEXT.md §Skills), mono `text-xs uppercase tracking-widest text-[--text-muted]`, each item after a 4px `--accent` square, sliding left (§6), its ends faded by a mask. Decorative (`aria-hidden`).
2. **Work** (`#work`, eyebrow `01 / WORK`) — bento grid, drawn as a **blueprint grid**: no gaps; every cell draws its right and bottom 1px `--border` line and the list its top and left, so neighbours share one line.
   - `lg`: `grid-cols-6`, CONTEXT order, no gaps:

     | Row | Cards (col-span) |
     |---|---|
     | 1 | FinLife Tracker (3) · TFT CompStat (3) |
     | 2 | Wound Segmentation (4) · JHunt (2) |

     If projects are added or removed, choose spans so every row sums to 6 and featured cards are ≥ 3.
   - `md`: 2 columns, every card spans 1. `< md`: 1 column. Always CONTEXT order.
   - Card content: card strip (category · `01`…) → title → one-liner → **highlight** callout (featured only) → up to 5 stack badges → links row: "Live" (`ExternalLink` icon) and "Code" (`Github` icon). Hide any link that is `TODO` or `—`. If an image exists: `next/image`, `aspect-video`, rounded, top of card.
   - **Highlight callout:** `border-l-2 border-[--accent] pl-3`, mono `text-xs text-[--text-muted]`.
   - Featured cards show `description` below the one-liner at `lg` only; mobile and non-featured cards show the one-liner alone.
3. **Experience** (`#experience`, `02 / EXPERIENCE`) — vertical timeline: period (mono) left on desktop / above on mobile. **Not rendered if CONTEXT has no entries** (renumber eyebrows accordingly).
4. **Stack** (`#stack`, `03 / STACK`) — 4 group cards in a blueprint grid like Work (`md`: 2×2, mobile: 1 column), each a card strip (group title as H3 · number) over its badges.
5. **Contact** (`#contact`, `04 / CONTACT`) — one wide card: heading (accent word in italic serif) + short line, then one row per contact channel in CONTEXT (email, GitHub): lucide icon · display text · CopyButton · open-link button. Hide `TODO` channels.
6. **Footer** — `border-t border-[--border]`, `© {current year} Charintorn Nillapat` + GitHub icon link. Small, muted.

Fixed page chrome outside the flow: Navbar, scroll tracker (section index + ruler, `lg`).

## 6. Motion

Crafted, but never in the way of reading. Every effect below uses `--accent` / `--glow` only (one accent colour, §1), animates `transform`, `opacity` or paint-only custom properties (never layout properties on pointer move) — or, for the constellation, draws on its own WebGL canvas — and is switched off by `prefers-reduced-motion: reduce`.

- **Hero intro** (once on load, framer-motion): the `CN` initials show alone where the name will be (fade + scale 0.9 → 1, held, then fade out with a slight grow; 1.1s) → the name's letters rise in (opacity, `translateY(12px → 0)`, 500ms `cubic-bezier(0.2, 0.9, 0.2, 1)`, 25ms apart from 750ms) → status pill, tagline, line and buttons fade up (the entrance below, from 1.2s, 80ms apart).
- **Entrance:** fade in + `translateY(8px → 0)`, 400ms, ease-out, triggered once when in view; children stagger 60ms. Section hairline (top of each section header) draws in `scaleX(0 → 1)` from the left, 600ms, `cubic-bezier(0.2, 0.9, 0.2, 1)`.
- **Hover:** color/border/opacity transitions 150–200ms; nav links and secondary buttons invert (§4); focusable elements never transition `outline-color`. Scale at most `1.02`. Arrow icons in buttons nudge **2px** toward their direction (`translate`, 150ms, `motion-safe:` only).
- **Smooth scroll:** anchor jumps glide with native `scroll-behavior: smooth`, set only under `prefers-reduced-motion: no-preference`.
- **Spotlight (Card):** pointer position in `--mouse-x/--mouse-y` (registered custom properties easing 120ms ease-out, so the light glides). Layers fade in over 200ms on hover: surface wash `radial-gradient(circle 320px, --glow → transparent)` behind content; border light `radial-gradient(circle 192px, --accent → transparent)` masked to the 1px ring. `(hover: hover) and (pointer: fine)` only.
- **Springs** (pointer-driven, mouse only): `stiffness 150`, `damping 20`.
  - **Magnetic** — primary CTAs: drift up to **6px** toward the pointer within an 8px zone around the button (md+); springs back on leave.
- **Section index** — scroll-linked, not triggered and not sprung: every title's pose is a direct function of the scroll position, so it tracks native scrolling 1:1 with no lag. Per title: waits in the bottom stack, a clean horizontal word in its own row → over 4rem of scroll lifts out (cubic in-out) toward a rail point that already moves with the scroll, rotating −90° onto the rail at 0.5 and partly brightening, so it joins the ride at scroll speed with no stop-and-go. Nothing lifts before the page is scrolled: on load every title waits in the stack, whatever the viewport height, and one already due on the rail lifts out over the first 8rem of scroll → rides up the rail with its foot (first letter) level with its section's top edge, so the upright word never hangs over the waiting stack → over the next 8rem turns flat and grows into the giant dock beneath the navbar in full `--text`, eased by `cubic-bezier(0.25, 1, 0.5, 1)` on a squared input (eases off the rail, long soft settle, no abrupt start or stop) → shrinks into the passed stack (cubic in-out) while the next title docks (the last section docks at the end of the page). **Split letters:** every letter runs that same path; the m-th letter from the right trails the first by 0.5 · m^1.35 rem of scroll (each gap a little wider than the last: a trailing wave), so a title peels off letter by letter, strings out up the rail and reassembles in the dock. The lag folds smoothly to 0 over the last 8rem before the dock and before the end of the retire, so every letter lands on the same scroll position, also at the very end of the page; at rest letters are untransformed. Letters move with `translate3d` on their own compositor layers (subpixel-smooth, no repaint). Transform and colour only.
- **Wordmark flight (lg+)** — the passed stack is headed by a `CN` link to `#top` (the Logo / initials, one row above the passed sections; 12px muted like them). The hero name flies into it, scrubbed 1:1 by scroll: at 0 nothing has moved; from the first scroll px a fixed copy of the name's letters (same size and place) takes over from the hero's own, which hide (`data-wordmark` on `<html>`, set in the same frame). Every letter sets off at once and lands when the scroll reaches the name's bottom edge; the rightmost travel fastest, so the name peels away from its right end. Each letter moves in a straight line (cubic in-out) from its place in the hero (which scrolls with the page) and turns up to ±20° mid-flight, back to 0 on landing. Its first `C` and the next `N` after it land exactly on the `C` and `N` of the link, shrinking to 12px and dimming from `--text` to `--text-muted`; every other letter heads for the link while it shrinks to half that and fades out. On landing the link itself takes over. Below lg and under reduced motion the hero name never moves; the link just appears once the name has scrolled off.
- **Hero constellation (WebGL, three.js):** 140 points (70 below 768px), each joined to ≤ 3 neighbours closer than a fixed radius; points round, `--accent` at 70%, lines `--accent` at 15%, read from the CSS token at runtime. The field sways ±6° on a 40s loop and the camera drifts on a 30s loop; with a mouse (never touch), the camera eases toward the pointer (≈ 0.4s, up to ≈ 3.4°). Fades in over 600ms once loaded and shares the aurora's bottom fade. Budget: geometry built once (no per-frame allocation), device pixel ratio ≤ 2, ≤ 60fps, paused while the hero is off screen. three.js is `import()`ed after hydration, so it never blocks first paint; under reduced motion it is not fetched, and turning reduced motion on tears the scene down (WebGL context released).
- **Ambient loops** (the only motion allowed past 600ms, all `transform`/paint, never layout):
  - Aurora — three `--glow` orbs (576px) in the Hero, `ease-in-out infinite alternate` drifts of 18s / 22s / 25s.
  - Border beam — a 60° `--accent` arc travelling round the border of featured cards, 6s linear. A static conic-gradient square (side = the element's diagonal) is turned with `transform: rotate` inside a fixed 1px ring mask, so the compositor animates it with no per-frame repaint.
  - Status dot pulse — 2s, opacity only.
  - Marquee — the hero's skill strip slides left by one copy's width (two copies, seamless), 36s linear, `translate3d`.
  - Constellation camera drift 30s and field sway 40s (see Hero constellation).
- **Grain:** static grayscale SVG noise (`feTurbulence`, 200px tile) over the whole page at 4% opacity, `pointer-events: none`. Not motion, so it stays on.
- **Scroll ruler (lg+):** a measuring tape in its own lane at the viewport's right edge (`fixed inset-y-0 right-2`, 48px wide, clipped), the section titles riding just left of it. No spine: 101 ticks every 1% pointing left from the right edge (short 10px `--text-subtle`, long 20px `--text-muted` every 5%), each long tick labelled `5`, `10` … `100` to its left (mono `text-2xs` = 10px, `--text-muted`: small text, so it must pass AA). The tape is the whole document: 0% sits 1.5rem below the page top and 100% 2.5rem above the page bottom, and it moves exactly with the content (`translateY = -scrollY`, compositor only). The **indicator** travels down the viewport like a scrollbar thumb over the same span (1.5rem from the top to 2.5rem from the bottom, `translateY` = progress × that track), so the tick under it is always the current progress: a 48px × 1px `--accent` bar with `shadow-glow` (`0 0 6px --accent`), with the `000%`–`100%` readout beneath it (mono `text-2xs`, `--accent`, opaque `--bg` backing that hides the labels sliding under it). The readout's digits roll like an odometer, 280ms `cubic-bezier(0.2, 0.9, 0.2, 1)` — the same odometer as the docked section's number under the docked title. Decorative (`aria-hidden`).
- **Reduced motion:** no constellation (not loaded), wordmark flight, marquee drift, magnetic drift, spotlight, aurora drift, border beam, pulse or icon nudge. Entrance and the hero intro become fade-only; the hairline and the odometers (section number, percentage readout) change instantly; section index titles snap between their states (stack / docked / passed) with no flight and no letter split; anchor jumps are instant. Grain and the scroll-progress fill (it only moves when the user scrolls) remain.
- No parallax on page content (the constellation's mouse parallax is the only parallax), no scroll-jacking, no smooth-scroll library. Scroll-linked motion is limited to the right-margin tracker.

## 7. Accessibility & responsive

- Test widths: **375px, 768px, 1440px**.
- Text contrast meets WCAG AA (see `--text-subtle` note).
- Touch targets ≥ 44×44px on mobile.
- Semantics: one `<h1>`; each section is `<section aria-labelledby>`; navbar in `<nav>`; footer in `<footer>`.
- External links: `target="_blank" rel="noopener noreferrer"`.
