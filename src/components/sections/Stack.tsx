import * as motion from "framer-motion/client";
import { Badge } from "@/components/ui/Badge";
import { Card, CardStrip } from "@/components/ui/Card";
import { skills } from "@/content/site";
import { reveal, revealItem } from "@/lib/motion";

export function Stack() {
  return (
    // Blueprint grid, like Work (DESIGN.MD §5).
    <motion.ul {...reveal} className="mt-10 grid border-t border-l border-border md:grid-cols-2">
      {skills.map(({ group, items }, i) => (
        <motion.li {...revealItem} key={group} className="border-r border-b border-border">
          <Card className="h-full border-0">
            <CardStrip label={group} index={i + 1} as="h3" />
            <ul className="flex flex-wrap gap-2">
              {items.map((item) => (
                <li key={item}>
                  <Badge>{item}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </motion.li>
      ))}
    </motion.ul>
  );
}
