import { Fragment } from "react";
import * as motion from "framer-motion/client";
import { ArrowDown } from "lucide-react";
import { HeroCanvas } from "@/components/sections/HeroCanvas";
import { Marquee } from "@/components/sections/Marquee";
import { Button } from "@/components/ui/Button";
import { GithubIcon } from "@/components/ui/icons";
import { Magnetic } from "@/components/ui/Magnetic";
import { StatusPill } from "@/components/ui/StatusPill";
import { hero, identity } from "@/content/site";
import { INTRO_MARK, introItem, introLetter } from "@/lib/motion";

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

const words = hero.wordmark.split(" ");
const starts = words.map((_, w) => words.slice(0, w).join("").length); // index of each word's first letter

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
        <motion.div {...introItem(0)}>
          <StatusPill label={hero.status} />
        </motion.div>
        {/* One span per letter (data-letter): they rise in on load, and from lg the section index flies
            copies of them into its top row (DESIGN.MD §6), hiding these while it does (wordmark:). */}
        <h1
          id="top-heading"
          className="relative mt-8 text-5xl leading-[0.9] font-bold tracking-tight text-balance text-text uppercase sm:text-7xl lg:text-8xl lg:wordmark:text-transparent"
        >
          <span className="sr-only">{hero.wordmark}</span>
          <motion.span
            {...INTRO_MARK}
            aria-hidden
            className="pointer-events-none absolute inset-0 flex items-center justify-center"
          >
            {identity.logo}
          </motion.span>
          {words.map((word, w) => (
            <Fragment key={w}>
              {w > 0 && " "}
              <span aria-hidden className="inline-block whitespace-nowrap">
                {[...word].map((char, k) => (
                  <motion.span
                    key={k}
                    {...introLetter(starts[w] + k)}
                    data-letter
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            </Fragment>
          ))}
        </h1>
        <motion.p
          {...introItem(1)}
          className="mt-6 font-mono text-xs tracking-widest text-text-muted uppercase sm:text-sm"
        >
          {identity.role}
        </motion.p>
        <motion.p
          {...introItem(2)}
          className="mt-4 max-w-xl text-base leading-relaxed text-balance text-text-muted sm:text-lg"
        >
          {keepHyphenatedWords(hero.line)}
        </motion.p>
        <motion.div {...introItem(3)} className="mt-8 flex flex-wrap justify-center gap-3">
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
        </motion.div>
      </div>
      <Marquee />
    </section>
  );
}
