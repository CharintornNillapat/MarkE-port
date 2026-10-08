# Charintorn Nillapat — Portfolio

Single-page portfolio and contact hub, with a dark "studio" look.

**Live:** https://mark-e-port.vercel.app

## Stack

- Next.js 16 (App Router, Cache Components) · React 19 · TypeScript (strict)
- Tailwind CSS 4 (design tokens in `src/app/globals.css`)
- Radix UI (mobile menu) · lucide-react (icons) · Framer Motion (entrance animation)
- Fonts: Geist, Geist Mono, Noto Sans Thai via `next/font`
- Deployed on Vercel from `main`

## Development

```bash
npm install
npm run dev     # http://localhost:3000
npm run lint
npm run build
```

## Where things live

| File | Owns |
|---|---|
| `CONTEXT.md` | All copy, links, project and skill data |
| `DESIGN.MD` | Tokens, layout, components, motion, accessibility |
| `docs/context/ROADMAP.md` | Build phases and status |
| `CLAUDE.md` | Build rules and definition of done |
| `src/content/site.ts` | Typed mirror of `CONTEXT.md`; the only import for text on the site |

To change content, edit `CONTEXT.md` first, then mirror it in `src/content/site.ts`.
Experience entries go in the `experience` array; the section and its nav link appear once it has one.
