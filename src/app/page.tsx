import { identity } from "@/content/site";

// Phase 0 placeholder: proves tokens + fonts. Replaced by the real sections from Phase 1.
export default function Home() {
  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-24">
      <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl">
        {identity.name}
      </h1>
      <p className="mt-4 max-w-prose text-base leading-relaxed text-text-muted sm:text-lg">
        {identity.role}
      </p>
    </main>
  );
}
