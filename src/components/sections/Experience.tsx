import * as motion from "framer-motion/client";
import { Badge } from "@/components/ui/Badge";
import { experience } from "@/content/site";
import { reveal, revealItem } from "@/lib/motion";

// DESIGN.MD §5 timeline: period left on md+, above on mobile. page.tsx only renders it when the list has entries.
export function Experience() {
  return (
    <motion.ol {...reveal} className="mt-10">
      {experience.map(({ role, org, period, type, highlights, stack }) => (
        <motion.li
          {...revealItem}
          key={`${role}-${org}-${period}`}
          className="group grid gap-2 md:grid-cols-4 md:gap-6"
        >
          <p className="font-mono text-xs text-text-muted md:pt-1.5">
            {period}
            <span className="mt-1 block uppercase tracking-widest">{type}</span>
          </p>
          {/* The left border is the timeline line; pb keeps it unbroken down to the next entry. */}
          <div className="relative border-l border-border pb-10 pl-6 group-last:pb-0 md:col-span-3">
            <span aria-hidden className="absolute top-2 -left-1 size-2 rounded-full bg-border-strong" />
            <h3 className="text-lg font-medium text-text">{role}</h3>
            <p className="mt-1 text-sm leading-relaxed text-text-muted">{org}</p>
            {highlights.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-4 text-sm leading-relaxed text-text-muted">
                {highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            )}
            {stack.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {stack.map((item) => (
                  <li key={item}>
                    <Badge>{item}</Badge>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.li>
      ))}
    </motion.ol>
  );
}
