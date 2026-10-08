# DESIGN.MD — Design System

This file defines **how things look and behave**. It contains no copy — all text comes from `CONTEXT.md`.

## 1. Direction

Dark studio aesthetic (Linear / Vercel). Mood reference: getartcraft.com — deep near-black canvas, thin luminous borders, crisp type, bento cards. **Reference only: never copy its assets, text or code.**

Principles:
- **One accent color.** Everything else is grayscale.
- **Depth from borders and glow**, not drop shadows.
- **Monospace for metadata** (tags, dates, labels); sans for everything else.
- **Motion is subtle** and never blocks reading.

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
- Container: `max-w-6xl mx-auto px-4 sm:px-6`
- Section vertical padding: `py-16` mobile, `py-24` ≥ `md`
- Grid gap: `gap-4`
- Card padding: `p-6`

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

## 4. Components

**Navbar** — `fixed top-4`, horizontally centered pill; `bg-[--surface]/70 backdrop-blur-md border border-[--border]`. Left: `CN` logo → `#top`. Center: Work · Experience · Stack · Contact. Right: primary CTA "Get in Touch" → `#contact`. Below `md`: links collapse into a menu button (Radix Dropdown or Sheet); CTA stays visible. Active section link uses `--accent`.

**Button**
- Primary: `bg-[--text] text-[--bg]`, hover `opacity-90`
- Secondary: transparent, `border border-[--border]`, hover `bg-[--surface-2] border-[--border-strong]`
- Both: `h-10 px-4`, icon + label gap `2`, `focus-visible:ring-2 ring-[--accent] ring-offset-2 ring-offset-[--bg]`

**Card** — `bg-[--surface] border border-[--border] rounded-2xl p-6`. Hover: `border-[--border-strong]` + cursor-following radial `--glow` (desktop pointer devices only; off for reduced motion).

**Badge** — mono `text-xs`, `border border-[--border] rounded-md px-2 py-0.5 text-[--text-muted]`.

**StatusPill** — rounded-full border pill with a small pulsing `--success` dot (CSS animation, not an emoji) + label.

**CopyButton** — copies a value to clipboard; icon swaps Copy → Check for 2s; announces "Copied" via `aria-live="polite"`; has an `aria-label` such as "Copy email".

## 5. Page structure (in order)

1. **Hero** (`#top`) — StatusPill → eyebrow-style line `Name (EN) · Role` → H1 → sub-headline → primary + secondary buttons. Background: `--glow` radial at top + faint grid pattern faded out with a mask. `min-h-[80svh]`, content vertically centered.
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

## 6. Motion

- **Entrance:** fade in + `translateY(8px → 0)`, 400ms, ease-out, triggered once when in view; children stagger 60ms.
- **Hover:** color/border/opacity transitions 150–200ms. Scale at most `1.02`.
- **Reduced motion:** opacity-only or no animation; no transforms, no pulsing dot.
- No parallax, no scroll-jacking, no animation longer than 600ms.

## 7. Accessibility & responsive

- Test widths: **375px, 768px, 1440px**.
- Text contrast meets WCAG AA (see `--text-subtle` note).
- Touch targets ≥ 44×44px on mobile.
- Semantics: one `<h1>`; each section is `<section aria-labelledby>`; navbar in `<nav>`; footer in `<footer>`.
- External links: `target="_blank" rel="noopener noreferrer"`.
