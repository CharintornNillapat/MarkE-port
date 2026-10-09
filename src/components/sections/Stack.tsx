import * as motion from "framer-motion/client";
import { Badge } from "@/components/ui/Badge";
import { skills } from "@/content/site";
import { reveal, revealItem } from "@/lib/motion";

// DESIGN.MD §5: a spec-sheet list, not a card grid. One ruled row per group, label left, badges right,
// so Stack reads differently from Work's blueprint grid.
export function Stack() {
  return (
    <motion.ul {...reveal} className="mt-10 border-t border-border">
      {skills.map(({ group, items }, i) => (
        <motion.li
          {...revealItem}
          key={group}
          className="grid gap-4 border-b border-border py-6 md:grid-cols-4 md:gap-6"
        >
          <h3 className="flex items-baseline gap-3 font-mono text-xs tracking-widest text-text-muted uppercase md:col-span-1">
            <span aria-hidden>{String(i + 1).padStart(2, "0")}</span>
            {group}
          </h3>
          <ul className="flex flex-wrap gap-2 md:col-span-3">
            {items.map((item) => (
              <li key={item}>
                <Badge>{item}</Badge>
              </li>
            ))}
          </ul>
        </motion.li>
      ))}
    </motion.ul>
  );
}
