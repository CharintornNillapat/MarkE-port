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
| Logo / initials | CN |
| Role | Software Engineer — Full-Stack & AI |
| Education | B.Eng. Computer Engineering (วศ.บ. วิศวกรรมคอมพิวเตอร์) |
| Location | Thailand |
| Availability | Open to opportunities & freelance work |

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
- **Name line:** Name (EN) · Role (from Identity), shown above the headline
- **Headline:** Engineering Intelligent Systems & High-Performance Web Applications.
- **Sub-headline:** Computer Engineering graduate building full-stack web platforms and applied computer-vision systems — from interface to API to model pipeline.
- **Primary CTA:** View Projects → `#work`
- **Secondary CTA:** GitHub Profile → GitHub link

## About (short bio)

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
- **One-liner:** Dark, data-dense Teamfight Tactics companion — meta comps, tier lists and a personal match dashboard.
- **Description:** Curated meta compositions, champion and item tier lists, and a personal dashboard for one Riot account. Pages read only from Supabase; Riot is called by a single sync service behind a database lock and cooldown, so an API outage degrades freshness, never content. A daily GitHub Actions job refreshes tier data from CommunityDragon and MetaTFT stats.
- **Highlight:** Moved functions next to the database region — full page load from Thailand cut from ~1.1–1.7s to ~0.5s
- **Stack:** Next.js, React 19, TypeScript, Tailwind CSS v4, Supabase, Riot Games API, GitHub Actions, Vercel
- **Repo:** https://github.com/CharintornNillapat/tft-compstat
- **Demo:** https://tft-compstat.vercel.app

### 3. Wound Segmentation (U-Net + ResNet34)
- **Category:** Deep Learning · Computer Vision · Healthcare
- **Featured:** yes
- **One-liner:** Wound segmentation model with a reproducible training and five-part evaluation pipeline.
- **Description:** Binary wound segmentation using U-Net with a ResNet34 encoder, trained on a Roboflow COCO export. Refactored from research notebooks into a config-driven pipeline with checkpoint resume and a test suite covering threshold sweep, robustness, public-dataset (FUSeg) generalization, wound-area measurement and false alarms — verified to reproduce the original notebook results byte for byte.
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
| `ui.sections` · work · heading | Selected Work & Engineering Projects | Section H2 |
| `ui.sections` · experience · heading | Work Experience | Section H2 — hidden while Experience is empty |
| `ui.sections` · stack · heading | Technical Capabilities & Stack | Section H2 |
| `ui.sections` · contact · heading | Get in Touch | Section H2 |
| `ui.nav.cta` | Get in Touch → `#contact` | Navbar primary button |
| `ui.nav.menu` | Menu | Mobile menu button label · drawer title |
| `ui.nav.close` | Close menu | Mobile drawer close button label |
| `ui.project.demo` | Live | Project card link (demo) |
| `ui.project.repo` | Code | Project card link (repo) |
| `ui.copy.email` | Copy email | CopyButton `aria-label`, email row |
| `ui.copy.github` | Copy GitHub profile link | CopyButton `aria-label`, GitHub row |
| `ui.copy.done` | Copied | CopyButton live announcement |
| `ui.contact.heading` | Let's Build Something Together | Contact card heading |
| `ui.contact.line` | Whether you have an engineering role, a project inquiry, or just want to connect, feel free to reach out. | Contact card short line |
| `ui.contact.open` | Open link | Open-link button labels in contact rows |

Eyebrow numbers count only the sections actually rendered. Footer reads `© {current year} {Name (EN)}` (no extra label).

---

## SEO / Metadata

- **Title:** Charintorn Nillapat — Full-Stack & AI Engineer
- **Description:** Software engineer from Thailand building full-stack web applications and applied computer-vision systems.
- **Site URL:** TODO (set after first deploy)
- **OG image:** TODO (1200×630)
