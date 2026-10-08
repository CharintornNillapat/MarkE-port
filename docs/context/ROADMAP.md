# ROADMAP — Build Phases

**Current phase: 1**

Rules:
- Do **only** the current phase. Each phase = one session.
- A phase is finished when its "Done when" list and `CLAUDE.md §5` both pass.
- When finished: tick the box, add a one-line note (what changed / anything left `TODO`), move "Current phase" to the next number, then stop.
- Don't edit future phases. If a phase turns out wrong, propose the change and wait.

---

## [x] Phase 0 — Foundation
Scaffold and tokens only. No visible UI yet.
- Next.js (App Router, TypeScript, ESLint, Tailwind, `src/`), lucide-react, framer-motion, clsx + tailwind-merge (`cn()`), shadcn init.
  - `create-next-app` may refuse to run in a folder that already has these `.md` files → scaffold into a temp folder and move the files in.
- Tokens from `DESIGN.MD §2` in `globals.css`; fonts from `§3` in `layout.tsx` (incl. Noto Sans Thai).
- `src/content/site.ts`: types + data for everything in `CONTEXT.md` (Experience = empty array).
- `.gitignore`: add `.screenshots/`.

**Done when:** `npm run build` passes · `page.tsx` renders the name and one line of muted text using tokens · no hex values outside `globals.css`.
Note: Next 16.4 + Tailwind 4.3 + shadcn (radix) scaffold; DESIGN tokens with Tailwind's default palette disabled; Geist + Noto Sans Thai; `site.ts` incl. `ui` labels (added to CONTEXT §UI Labels); official GitHub mark in `ui/icons.tsx`. TODO in CONTEXT: section H2 headings, Contact heading/line, GitHub copy label, open-link labels.

## [ ] Phase 1 — Layout shell
- `Section` wrapper (id, eyebrow, heading, `aria-labelledby`), `Navbar` (desktop + mobile menu), `Footer`.
- `page.tsx` composes all sections as empty `Section`s in `DESIGN.MD §5` order. Experience is skipped when empty, and eyebrow numbers adjust.

**Done when:** anchor links scroll to each section · mobile menu opens/closes with keyboard and Esc · no Experience link while it's empty.
Note:

## [ ] Phase 2 — Hero
- `StatusPill`, `Button` (primary/secondary), Hero with glow + grid background.

**Done when:** one `<h1>` on the page · CTAs go to `#work` and GitHub · readable at 375px with no overflow.
Note:

## [ ] Phase 3 — Work (bento)
- `Card`, `Badge`, project card with highlight callout and Live/Code links; grid spans per `DESIGN.MD §5`.

**Done when:** spans match the table at `lg`, 2 cols at `md`, 1 col on mobile · no link rendered for `—`/`TODO` · all 4 projects shown in CONTEXT order.
Note:

## [ ] Phase 4 — Stack + Contact
- Stack: 4 group cards. Contact: rows for email and GitHub with `CopyButton`.

**Done when:** copy works and announces "Copied" · no phone number anywhere · LinkedIn row hidden while `TODO`.
Note:

## [ ] Phase 5 — Experience + motion
- `Experience` timeline component (still hidden while empty).
- Entrance and hover motion per `DESIGN.MD §6`, card cursor glow.

**Done when:** with reduced motion on, nothing moves and the status dot doesn't pulse · adding one test entry to `site.ts` shows the section and nav link (remove it afterwards).
Note:

## [ ] Phase 6 — Polish & ship
- Metadata from `CONTEXT.md §SEO`, favicon, 404 page.
- If Playwright is available: screenshots at 375 / 768 / 1440 into `.screenshots/` and review them.
- Deploy to Vercel, then put the URL into `CONTEXT.md` (Site URL).

**Done when:** all of `CLAUDE.md §5` passes on the deployed site.
Note:
