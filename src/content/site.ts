// Typed mirror of CONTEXT.md, the single import for every string on the site.
// Fields marked TODO or "—" in CONTEXT.md are left out (optional), never empty strings.

export type Link = { label: string; href: string };

export type ContactChannel = Link & { display: string };

export type Project = {
  title: string;
  category: string;
  featured: boolean;
  oneLiner: string;
  description: string;
  highlight?: string;
  stack: string[];
  repo?: string;
  demo?: string;
};

export type Experience = {
  role: string;
  org: string;
  period: string;
  type: "Internship" | "Full-time" | "Freelance" | "Capstone";
  highlights: string[];
  stack: string[];
};

export type SkillGroup = { group: string; items: string[] };

export type Section = {
  id: "work" | "experience" | "stack" | "contact";
  label: string;
  heading: string;
};

const GITHUB_URL = "https://github.com/CharintornNillapat";

export const identity = {
  name: "Charintorn Nillapat",
  nameTh: "ชรินทร นิลพัตร์",
  nickname: "Mark",
  initials: "CN",
  role: "Software Engineer, Full-Stack & AI",
  education: "B.Eng. Computer Engineering (วศ.บ. วิศวกรรมคอมพิวเตอร์)",
  location: "Thailand",
  availability: "Open to opportunities & freelance work",
};

// LinkedIn: TODO in CONTEXT.md, so it's left out.
export const contact: ContactChannel[] = [
  {
    label: "Email",
    display: "charintornnillapat@gmail.com",
    href: "mailto:charintornnillapat@gmail.com",
  },
  { label: "GitHub", display: "github.com/CharintornNillapat", href: GITHUB_URL },
];

export const hero = {
  status: identity.availability,
  line: "Building full-stack web platforms and applied computer-vision systems, from interface to API to model pipeline.",
  primaryCta: { label: "View Projects", href: "#work" } satisfies Link,
  secondaryCta: { label: "GitHub Profile", href: GITHUB_URL } satisfies Link,
};

export const about =
  "Computer Engineering graduate who builds full-stack web applications and applied AI / computer-vision systems. I care about the unglamorous parts that make software trustworthy: atomic data writes, reproducible experiments, tests, and pipelines that fail safely.";

export const projects: Project[] = [
  {
    title: "FinLife Tracker",
    category: "Full-Stack PWA · Personal Finance",
    featured: true,
    oneLiner: "Offline-first finance tracker with a daily diary, synced to Supabase.",
    description:
      "Installable PWA for wallets, income, spending and debt goals in Thai Baht, with a daily diary of mood, workouts and meals beside each day's spending. Works offline on localStorage; signed in, it syncs both ways with Supabase and every ledger change runs as one atomic Postgres function. An AI classifier suggests categories through a server-side proxy.",
    highlight:
      "1,000+ unit tests and 150+ Playwright tests across Chromium, Firefox and WebKit",
    stack: [
      "React 19",
      "TypeScript",
      "Supabase",
      "Playwright",
      "Vitest",
      "Vite",
      "Tailwind CSS v4",
      "Zod",
      "Vercel",
    ],
    repo: "https://github.com/CharintornNillapat/IncomeAndExpence",
    demo: "https://income-and-expence-neon.vercel.app",
  },
  {
    title: "TFT CompStat",
    category: "Data Platform · Web App",
    featured: true,
    oneLiner:
      "Dark, data-dense Teamfight Tactics companion: meta comps, tier lists and a personal match dashboard.",
    description:
      "Curated meta compositions, champion and item tier lists, and a personal dashboard for one Riot account. Pages read only from Supabase; Riot is called by a single sync service behind a database lock and cooldown, so an API outage degrades freshness, never content. A daily GitHub Actions job refreshes tier data from CommunityDragon and MetaTFT stats.",
    highlight:
      "Moved functions next to the database region: full page load from Thailand cut from ~1.1–1.7s to ~0.5s",
    stack: [
      "Next.js",
      "React 19",
      "TypeScript",
      "Tailwind CSS v4",
      "Supabase",
      "Riot Games API",
      "GitHub Actions",
      "Vercel",
    ],
    repo: "https://github.com/CharintornNillapat/tft-compstat",
    demo: "https://tft-compstat.vercel.app",
  },
  {
    title: "Wound Segmentation (U-Net + ResNet34)",
    category: "Deep Learning · Computer Vision · Healthcare",
    featured: true,
    oneLiner:
      "Wound segmentation model with a reproducible training and five-part evaluation pipeline.",
    description:
      "Binary wound segmentation using U-Net with a ResNet34 encoder, trained on a Roboflow COCO export. Refactored from research notebooks into a config-driven pipeline with checkpoint resume and a test suite covering threshold sweep, robustness, public-dataset (FUSeg) generalization, wound-area measurement and false alarms, verified to reproduce the original notebook results byte for byte.",
    highlight: "Parity check proves the refactor reproduces the original thesis metrics exactly",
    stack: [
      "Python",
      "PyTorch",
      "segmentation_models_pytorch",
      "Albumentations",
      "Google Colab",
    ],
    repo: "https://github.com/CharintornNillapat/wound-segmentation",
  },
  {
    title: "JHunt",
    category: "Automation · Data Pipeline",
    featured: false,
    oneLiner: "Daily job-alert pipeline: JobsDB → filters → Gemini screening → Telegram.",
    description:
      "Runs every morning on GitHub Actions with no server. Fetches listings from the JobsDB JSON API, removes duplicates across runs using cached state, filters by title, seniority and location, optionally screens the rest with Gemini 2.5 Flash, and sends each new job to Telegram. The AI step is fail-open: any error keeps the jobs rather than dropping alerts.",
    stack: ["Python", "requests", "Gemini API", "GitHub Actions", "Telegram Bot API"],
    repo: "https://github.com/CharintornNillapat/JHunt",
  },
];

// Empty until CONTEXT.md has entries; the Experience section and nav link stay hidden while empty.
export const experience: Experience[] = [];

export const skills: SkillGroup[] = [
  {
    group: "Languages",
    items: ["Python", "TypeScript", "JavaScript", "C/C++", "SQL", "HTML/CSS"],
  },
  {
    group: "Frontend & Full-Stack",
    items: ["Next.js", "React", "Vite", "Tailwind CSS", "Node.js", "Express", "FastAPI", "Supabase"],
  },
  {
    group: "AI & Computer Vision",
    items: ["PyTorch", "OpenCV", "U-Net", "ResNet", "ONNX", "Albumentations", "Gemini API"],
  },
  {
    group: "Testing, Tooling & DevOps",
    items: ["Playwright", "Vitest", "Docker", "Linux (Ubuntu)", "Git", "GitHub Actions", "Vercel"],
  },
];

// OG image: TODO in CONTEXT.md.
export const seo = {
  title: "Charintorn Nillapat | Full-Stack & AI Engineer",
  description:
    "Software engineer from Thailand building full-stack web applications and applied computer-vision systems.",
  url: "https://mark-e-port.vercel.app",
};

// DESIGN.MD §5 order. Eyebrow numbers (`01 / WORK`) are assigned to the sections actually rendered.
const sections: Section[] = [
  { id: "work", label: "Work", heading: "Selected Work & Engineering Projects" },
  { id: "experience", label: "Experience", heading: "Work Experience" },
  { id: "stack", label: "Stack", heading: "Technical Capabilities & Stack" },
  { id: "contact", label: "Contact", heading: "Get in Touch" },
];

// CONTEXT.md §UI Labels.
export const ui = {
  nav: {
    cta: { label: "Get in Touch", href: "#contact" } satisfies Link,
    menu: "Menu",
    close: "Close menu",
  },
  sections,
  project: { demo: "Live", repo: "Code" },
  copy: { email: "Copy email", github: "Copy GitHub profile link", done: "Copied", failed: "Copy failed" },
  contact: {
    heading: "Let's Build Something Together",
    line: "Whether you have an engineering role, a project inquiry, or just want to connect, feel free to reach out.",
    open: "Open link",
  },
  notFound: {
    code: "404",
    title: "Page not found",
    line: "This page doesn't exist.",
    back: { label: "Back to home", href: "/" } satisfies Link,
  },
};

// Sections that render (page + navbar). CONTEXT.md §Experience: hidden while the list is empty.
export const visibleSections = sections.filter(
  (s) => s.id !== "experience" || experience.length > 0,
);
