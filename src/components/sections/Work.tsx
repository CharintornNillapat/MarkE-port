import * as motion from "framer-motion/client";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardStrip } from "@/components/ui/Card";
import { GithubIcon } from "@/components/ui/icons";
import { projects, ui, type Project } from "@/content/site";
import { reveal, revealItem } from "@/lib/motion";

// DESIGN.MD §5 lg spans, by position. When projects are added or removed, update this list and the
// DESIGN table together: every row sums to 6 and featured cards span at least 3.
const lgSpans = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-4", "lg:col-span-2"];

export function Work() {
  return (
    // Blueprint grid (DESIGN.MD §5): no gaps, cells share 1px lines (each draws its right and bottom
    // edge, the list its top and left).
    <motion.ul {...reveal} className="mt-10 grid border-t border-l border-border md:grid-cols-2 lg:grid-cols-6">
      {projects.map((project, i) => (
        <motion.li {...revealItem} key={project.title} className={`border-r border-b border-border ${lgSpans[i]}`}>
          <ProjectCard project={project} index={i + 1} />
        </motion.li>
      ))}
    </motion.ul>
  );
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { title, category, featured, oneLiner, description, highlight, stack, demo, repo } = project;

  return (
    <Card className="flex h-full flex-col border-0">
      {/* Featured cards: a light travels round the border (off for reduced motion, DESIGN.MD §6). */}
      {featured && <span aria-hidden className="border-beam" />}
      <CardStrip label={category} index={index} />
      <h3 className="text-lg font-medium text-text">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-muted">{oneLiner}</p>
      {featured && (
        <p className="mt-3 hidden text-sm leading-relaxed text-text-muted lg:block">{description}</p>
      )}
      {featured && highlight && (
        <p className="mt-4 border-l-2 border-accent pl-3 font-mono text-xs text-text-muted">
          {highlight}
        </p>
      )}
      <ul className="mt-4 flex flex-wrap gap-2">
        {stack.slice(0, 5).map((item) => (
          <li key={item}>
            <Badge>{item}</Badge>
          </li>
        ))}
      </ul>
      {/* mt-auto pins the links to the card bottom so they line up across a row.
          The sr-only title tells screen readers which project each "Live" / "Code" link belongs to. */}
      {(demo || repo) && (
        <div className="mt-auto flex flex-wrap gap-3 pt-6">
          {demo && (
            <Button href={demo} variant="secondary">
              <ExternalLink
                aria-hidden
                className="motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
              />
              {ui.project.demo}
              <span className="sr-only"> {title}</span>
            </Button>
          )}
          {repo && (
            <Button href={repo} variant="secondary">
              <GithubIcon />
              {ui.project.repo}
              <span className="sr-only"> {title}</span>
            </Button>
          )}
        </div>
      )}
    </Card>
  );
}
