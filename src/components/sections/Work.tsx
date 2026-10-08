import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { GithubIcon } from "@/components/ui/icons";
import { projects, ui, type Project } from "@/content/site";

// DESIGN.MD §5 lg spans, by position. When projects are added or removed, update this list and the
// DESIGN table together: every row sums to 6 and featured cards span at least 3.
const lgSpans = ["lg:col-span-3", "lg:col-span-3", "lg:col-span-4", "lg:col-span-2"];

export function Work() {
  return (
    <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
      {projects.map((project, i) => (
        <li key={project.title} className={lgSpans[i]}>
          <ProjectCard project={project} />
        </li>
      ))}
    </ul>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const { title, category, featured, oneLiner, description, highlight, stack, demo, repo } = project;

  return (
    <Card className="flex h-full flex-col">
      <p className="font-mono text-xs uppercase tracking-widest text-text-muted">{category}</p>
      <h3 className="mt-3 text-lg font-medium text-text">{title}</h3>
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
              <ExternalLink aria-hidden />
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
