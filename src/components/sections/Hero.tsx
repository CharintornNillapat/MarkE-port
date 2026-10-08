import { ArrowDown } from "lucide-react";
import { HeroCanvas } from "@/components/sections/HeroCanvas";
import { Button } from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { StatusPill } from "@/components/ui/StatusPill";
import { hero, identity } from "@/content/site";

// Browsers break after a hyphen ("computer-" / "vision"). From sm up, keep hyphenated words whole;
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
      {/* pt clears the fixed navbar; content is centred in the remaining height. Centred on the viewport:
          lg+ pads both sides by the tracker gutter, not just the right. */}
      <div className="mx-auto flex min-h-[80svh] max-w-6xl flex-col items-center justify-center px-4 pt-28 pb-16 text-center sm:px-6 lg:px-tracker">
        <StatusPill label={hero.status} />
        <h1
          id="top-heading"
          className="mt-8 text-5xl leading-[0.9] font-bold tracking-tight text-balance text-text uppercase sm:text-7xl lg:text-8xl"
        >
          {identity.name}
        </h1>
        <p className="mt-6 font-mono text-xs tracking-widest text-text-muted uppercase sm:text-sm">{identity.role}</p>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-balance text-text-muted sm:text-lg">
          {keepHyphenatedWords(hero.line)}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
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
