import { ArrowDown } from "lucide-react";
import { HeroCanvas } from "@/components/sections/HeroCanvas";
import { Button } from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { StatusPill } from "@/components/ui/StatusPill";
import { hero, identity } from "@/content/site";

// Browsers break after a hyphen ("High-" / "Performance"). From sm up, keep hyphenated words whole;
// below sm the break stays allowed so a long word can't overflow a 320px screen.
const keepHyphenatedWords = (text: string) =>
  text.split(/(\S+-\S+)/).map((part, i) =>
    i % 2 ? (
      <span key={i} className="sm:whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );

export function Hero() {
  return (
    <section id="top" aria-labelledby="top-heading" className="relative isolate">
      {/* Aurora: three --glow orbs drifting on 18–25s loops (transform only); still when motion is reduced.
          The WebGL constellation sits on top of them and shares the field's bottom fade. */}
      <div aria-hidden className="aurora-field pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span className="aurora-orb -top-48 left-1/4 motion-safe:animate-aurora-1" />
        <span className="aurora-orb top-0 -right-24 motion-safe:animate-aurora-2" />
        <span className="aurora-orb top-1/4 -left-40 motion-safe:animate-aurora-3" />
        <HeroCanvas />
      </div>
      <div aria-hidden className="hero-backdrop pointer-events-none absolute inset-0 -z-10" />
      {/* pt clears the fixed navbar; content is centred in the remaining height. */}
      <div className="mx-auto flex min-h-[80svh] max-w-6xl flex-col items-start justify-center px-4 pt-28 pb-16 sm:px-6 lg:pr-tracker">
        <StatusPill label={hero.status} />
        <p className="mt-6 font-mono text-xs uppercase tracking-widest text-text-muted">
          {/* inline-block: on narrow screens the line breaks at the "·", not inside the role. */}
          {identity.name} · <span className="inline-block">{identity.role}</span>
        </p>
        <h1
          id="top-heading"
          className="mt-3 text-balance text-4xl font-semibold leading-[1.05] tracking-tight text-text sm:text-6xl"
        >
          {keepHyphenatedWords(hero.headline)}
        </h1>
        <p className="mt-6 max-w-prose text-base leading-relaxed text-text-muted sm:text-lg">
          {hero.subheadline}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Magnetic>
            <Button href={hero.primaryCta.href}>
              {hero.primaryCta.label}
              <ArrowDown aria-hidden className="motion-safe:group-hover:translate-y-0.5" />
            </Button>
          </Magnetic>
          <Button href={hero.secondaryCta.href} variant="secondary">
            <GithubIcon />
            {hero.secondaryCta.label}
          </Button>
        </div>
      </div>
    </section>
  );
}
