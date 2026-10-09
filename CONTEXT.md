# CONTEXT.md — Content Source of Truth

All copy on the site comes from this file. The agent may shorten text to fit a layout but must **not add claims, numbers or links**.
`TODO` = not available yet → hide that element on the site.

Project facts below were verified against each repo's README (Oct 2026). If a repo changes, update this file first, then the site.

---

## Identity

| Field | Value |
|---|---|
| Name (EN) | Charintorn Nillapat |
| Name (TH) | ชรินทร นิลพัตร์ |
| Nickname | Mark |
| Logo | MARK (favicon: its first letter, M) |
| Role | Software Engineer, Full-Stack & AI |
| Education | B.Eng. Computer Engineering (วศ.บ. วิศวกรรมคอมพิวเตอร์) |
| Location | Thailand |
| Availability | Open to opportunities & freelance work |

Name (TH), Education and Location are reference data: the site has no section that shows them (DESIGN.MD §5), so `site.ts` leaves them out. Add them there if a section is ever designed for them.

## Contact

| Channel | Display text | Link |
|---|---|---|
| Email (primary) | charintornnillapat@gmail.com | `mailto:charintornnillapat@gmail.com` |
| GitHub | github.com/CharintornNillapat | https://github.com/CharintornNillapat |
| LinkedIn | TODO | TODO |

No phone number on the site.

---

## Hero

- **Status:** Open to opportunities & freelance work
- **Wordmark (H1):** Mark Charintorn (Nickname + first name from Identity), set as the giant title
- **Tagline:** Role (from Identity), directly beneath the wordmark
- **Line:** Building full-stack web platforms and applied computer-vision systems, from interface to API to model pipeline.
- **Primary CTA:** View Projects → `#work`
- **Secondary CTA:** GitHub Profile → GitHub link

## About (short bio)

Not rendered: DESIGN.MD §5 has no About section, so `site.ts` leaves it out. Kept here as the approved wording if one is added.

Computer Engineering graduate who builds full-stack web applications and applied AI / computer-vision systems. I care about the unglamorous parts that make software trustworthy: atomic data writes, reproducible experiments, tests, and pipelines that fail safely.

---

## Projects

Listed in display order. `featured: yes` → large bento card. `highlight` = one engineering fact shown as a callout on the card. Cards show the first 5 **Stack** items as badges, so list the most relevant first.

### 1. FinLife Tracker
- **Category:** Full-Stack PWA · Personal Finance
- **Featured:** yes
- **One-liner:** Offline-first finance tracker with a daily diary, synced to Supabase.
- **Description:** Installable PWA for wallets, income, spending and debt goals in Thai Baht, with a daily diary of mood, workouts and meals beside each day's spending. Works offline on localStorage; signed in, it syncs both ways with Supabase and every ledger change runs as one atomic Postgres function. An AI classifier suggests categories through a server-side proxy.
- **Highlight:** 1,000+ unit tests and 150+ Playwright tests across Chromium, Firefox and WebKit
- **Stack:** React 19, TypeScript, Supabase, Playwright, Vitest, Vite, Tailwind CSS v4, Zod, Vercel
- **Repo:** https://github.com/CharintornNillapat/IncomeAndExpence
- **Demo:** https://income-and-expence-neon.vercel.app

### 2. TFT CompStat
- **Category:** Data Platform · Web App
- **Featured:** yes
- **One-liner:** Dark, data-dense Teamfight Tactics companion: meta comps, tier lists and a personal match dashboard.
- **Description:** Curated meta compositions, champion and item tier lists, and a personal dashboard for one Riot account. Pages read only from Supabase; Riot is called by a single sync service behind a database lock and cooldown, so an API outage degrades freshness, never content. A daily GitHub Actions job refreshes tier data from CommunityDragon and MetaTFT stats.
- **Highlight:** Moved functions next to the database region: full page load from Thailand cut from ~1.1–1.7s to ~0.5s
- **Stack:** Next.js, React 19, TypeScript, Tailwind CSS v4, Supabase, Riot Games API, GitHub Actions, Vercel
- **Repo:** https://github.com/CharintornNillapat/tft-compstat
- **Demo:** https://tft-compstat.vercel.app

### 3. Wound Segmentation (U-Net + ResNet34)
- **Category:** Deep Learning · Computer Vision · Healthcare
- **Featured:** yes
- **One-liner:** Wound segmentation model with a reproducible training and five-part evaluation pipeline.
- **Description:** Binary wound segmentation using U-Net with a ResNet34 encoder, trained on a Roboflow COCO export. Refactored from research notebooks into a config-driven pipeline with checkpoint resume and a test suite covering threshold sweep, robustness, public-dataset (FUSeg) generalization, wound-area measurement and false alarms, verified to reproduce the original notebook results byte for byte.
- **Highlight:** Parity check proves the refactor reproduces the original thesis metrics exactly
- **Stack:** Python, PyTorch, segmentation_models_pytorch, Albumentations, Google Colab
- **Repo:** https://github.com/CharintornNillapat/wound-segmentation
- **Demo:** —

### 4. JHunt
- **Category:** Automation · Data Pipeline
- **Featured:** no
- **One-liner:** Daily job-alert pipeline: JobsDB → filters → Gemini screening → Telegram.
- **Description:** Runs every morning on GitHub Actions with no server. Fetches listings from the JobsDB JSON API, removes duplicates across runs using cached state, filters by title, seniority and location, optionally screens the rest with Gemini 2.5 Flash, and sends each new job to Telegram. The AI step is fail-open: any error keeps the jobs rather than dropping alerts.
- **Stack:** Python, requests, Gemini API, GitHub Actions, Telegram Bot API
- **Repo:** https://github.com/CharintornNillapat/JHunt
- **Demo:** —

---

## Experience

Draft — to be filled in later. **Until there is at least one entry, the Experience section and its nav link are not rendered.** Build the component and data type now, with an empty list.

```
### <Role> — <Company / Project>
- Period: <MMM YYYY – MMM YYYY | Present>
- Type: <Internship | Full-time | Freelance | Capstone>
- Highlights:
  - <achievement, ideally with a real result>
- Stack: <...>
```

---

## Skills

| Group | Items |
|---|---|
| Languages | Python, TypeScript, JavaScript, C/C++, SQL, HTML/CSS |
| Frontend & Full-Stack | Next.js, React, Vite, Tailwind CSS, Node.js, Express, FastAPI, Supabase |
| AI & Computer Vision | PyTorch, OpenCV, U-Net, ResNet, ONNX, Albumentations, Gemini API |
| Testing, Tooling & DevOps | Playwright, Vitest, Docker, Linux (Ubuntu), Git, GitHub Actions, Vercel |

---

## UI Labels

Interface text that isn't page content: nav, buttons, section labels. Mirrored in `site.ts` as `ui.*`. Same rule: `TODO` = not available → don't render.

| Key (`site.ts`) | Text | Used in |
|---|---|---|
| `ui.sections` · work | Work | Navbar link · eyebrow `NN / WORK` |
| `ui.sections` · experience | Experience | Navbar link · eyebrow — hidden while Experience is empty |
| `ui.sections` · stack | Stack | Navbar link · eyebrow |
| `ui.sections` · contact | Contact | Navbar link · eyebrow |
| `ui.sections` · work · heading | Selected Engineering Projects | Section H2 |
| `ui.sections` · experience · heading | Work Experience | Section H2 — hidden while Experience is empty |
| `ui.sections` · stack · heading | Languages & Tools | Section H2 |
| `ui.sections` · contact · heading | Get in Touch | Section H2 |
| `ui.nav.cta` | Email me → `#contact` | Navbar primary button |
| `ui.nav.menu` | Menu | Mobile menu button label · drawer title |
| `ui.nav.close` | Close menu | Mobile drawer close button label |
| `ui.project.demo` | Live | Project card link (demo) |
| `ui.project.repo` | Code | Project card link (repo) |
| `ui.copy.email` | Copy email | CopyButton `aria-label`, email row |
| `ui.copy.github` | Copy GitHub profile link | CopyButton `aria-label`, GitHub row |
| `ui.copy.done` | Copied | CopyButton live announcement |
| `ui.copy.failed` | Copy failed | CopyButton live announcement when the clipboard write is blocked |
| `ui.contact.heading` | Let's Build Something Together | Contact card heading |
| `ui.contact.line` | Open to engineering roles and freelance projects. Send an email or find me on GitHub. | Contact card short line |
| `ui.contact.open` · email | Send email | Open button, email row (`mailto:`) |
| `ui.contact.open` · github | Open GitHub profile | Open button, GitHub row |
| `ui.notFound.code` | 404 | 404 page eyebrow |
| `ui.notFound.title` | Page not found | 404 page H1 · tab title |
| `ui.notFound.line` | This page doesn't exist. | 404 page short line |
| `ui.notFound.back` | Back to home → `/` | 404 page button |

**Accent word** (set in italic serif inside its heading; the text itself is unchanged). Only one heading has one:

| Heading | Accent word |
|---|---|
| Let's Build Something Together | Together |

**Marquee** (strip under the hero): every item from §Skills, in table order. Decorative; the Stack section lists them for real.

**Wordmark in the section index** (lg+): the hero wordmark's letters fly into the top of the index; its first word, `MARK`, lands as the Logo, a link to `#top`; the rest scatters and fades.

Eyebrow numbers count only the sections actually rendered. Footer reads `© {current year} {Name (EN)}` (no extra label).

---

## SEO / Metadata

- **Title:** Charintorn Nillapat | Full-Stack & AI Engineer
- **Description:** Software engineer from Thailand building full-stack web applications and applied computer-vision systems.
- **Site URL:** https://mark-e-port.vercel.app
- **OG image:** TODO (1200×630)
