import { skills } from "@/content/site";

const items = skills.flatMap(({ items }) => items);

// DESIGN.MD §5 marquee: every skill (CONTEXT.md §Skills) sliding left on a 36s loop, two copies so it
// wraps seamlessly. Still when motion is reduced, and paused while the pointer is over it (WCAG 2.2.2).
// Decorative: the Stack section lists the same items.
export function Marquee() {
  return (
    <div aria-hidden className="marquee-fade overflow-hidden border-y border-border py-3">
      <div className="flex w-max motion-safe:animate-marquee motion-safe:hover:paused">
        {[0, 1].map((copy) => (
          <ul key={copy} className="flex shrink-0 items-center">
            {items.map((item) => (
              <li
                key={item}
                className="flex items-center gap-8 pr-8 font-mono text-xs tracking-widest whitespace-nowrap text-text-muted uppercase"
              >
                <span className="size-1 bg-accent" />
                {item}
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
