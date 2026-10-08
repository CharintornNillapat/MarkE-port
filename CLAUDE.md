# CLAUDE.md — Agent Instructions

Single-page portfolio + contact hub for **Charintorn Nillapat**. Dark "studio" aesthetic (Linear / Vercel style).

## 1. Source of truth

@CONTEXT.md
@DESIGN.MD
@docs/context/ROADMAP.md

| File | Owns | Rule |
|---|---|---|
| `docs/context/ROADMAP.md` | Build order and current phase | Work on the current phase only; update its status when done. |
| `CONTEXT.md` | All copy, links, project & skill data | Never invent content. A field marked `TODO` (or `—`) = not available → **don't render that element** (no empty links, no placeholder text). |
| `DESIGN.MD` | Tokens, layout, components, motion, a11y | Use tokens only. No ad-hoc hex values or arbitrary spacing. |
| `CLAUDE.md` | How to build + definition of done | — |

If two files conflict, or a requirement is unclear: **stop and ask**. Do not guess.

## 2. Stack

- **Next.js** (App Router) + **TypeScript** (`strict: true`). Check `package.json` for installed versions and only use APIs that exist in them.
- **Tailwind CSS** — if v4: define tokens with `@theme` in `globals.css` (no `tailwind.config`). If v3: CSS variables + `theme.extend`.
- **shadcn/ui** (Radix) — add only components that are actually used.
- **lucide-react** for icons. **Framer Motion** (or `motion`, whichever is installed) for animation.
- Fonts via `next/font` (see `DESIGN.MD §3`).
- No new dependencies unless necessary — if you add one, state why in your summary.

## 3. Project structure

```
src/
├─ app/
│  ├─ layout.tsx        # fonts, <html lang="en">, metadata (from CONTEXT.md §SEO)
│  ├─ page.tsx          # composes sections in DESIGN.MD §5 order
│  └─ globals.css       # design tokens
├─ content/
│  └─ site.ts           # typed data mirroring CONTEXT.md — single import for all copy
├─ components/
│  ├─ layout/           # Navbar, Footer, Section (wrapper with id + eyebrow + heading)
│  ├─ sections/         # Hero, Work, Experience, Stack, Contact
│  └─ ui/               # shadcn components + Badge, Card, CopyButton, StatusPill
└─ lib/utils.ts         # cn()
public/projects/        # project screenshots (optional)
```

### Rules
- **No hardcoded copy in JSX.** Components read from `src/content/site.ts`. Optional fields are typed as optional (`demo?: string`), not empty strings.
- **Server Components by default.** Add `"use client"` only to interactive/animated leaves (CopyButton, mobile menu, motion wrappers) — never to a whole section.
- Section anchors: `#work`, `#experience`, `#stack`, `#contact`. Navbar links are generated from the sections actually rendered.
- All raster images use `next/image` with explicit `width`/`height` or `fill` + `sizes`.

## 4. How to work

- Follow `docs/context/ROADMAP.md`: one phase per session. Don't start the next phase until the current one passes §5.
- At the start of a phase, outline the plan (files to create/change) and wait for approval.
- Don't refactor files outside the task's scope.

## 5. Definition of Done

A task is done only when **all** pass:

1. `npm run lint` → 0 errors
2. `npm run build` → succeeds (type errors = fail)
3. Layout correct at **375px, 768px, 1440px** — no horizontal scroll, no overlapping or clipped text. If you could not check this visually, say so explicitly.
4. Every interactive element reachable by Tab, with a visible focus ring
5. `prefers-reduced-motion: reduce` disables transforms
6. Every piece of text, link and number exists in `CONTEXT.md`
7. No colors/sizes outside `DESIGN.MD` tokens
8. Ends with a short summary: files changed + anything left `TODO`

## 6. Don'ts

- Don't copy text, images, logos or code from getartcraft.com — it is a mood reference only.
- Don't add fake projects, metrics, testimonials, client logos or "years of experience".
- Don't show a phone number anywhere.
- Don't use emoji as UI icons — use lucide.
- Don't add analytics, cookies, CMS, auth or a backend.

## 7. Commands

```
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

Dev machine is **Windows / PowerShell** — write shell commands in PowerShell syntax.
