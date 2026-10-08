import { GithubIcon } from "@/components/ui/icons";
import { contact, identity } from "@/content/site";

const github = contact.find((c) => c.label === "GitHub");

// Cache Components rejects a bare `new Date()`; "use cache" bakes the year into the static shell.
export async function Footer() {
  "use cache";
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-6 sm:px-6 lg:pr-tracker">
        <p className="text-sm text-text-muted">
          © {year} {identity.name}
        </p>
        {github && (
          <a
            href={github.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={github.label}
            className="inline-flex size-11 items-center justify-center rounded-[10px] text-text-muted transition-[color,background-color] duration-150 hover:bg-surface-2 hover:text-text"
          >
            <GithubIcon className="size-5" />
          </a>
        )}
      </div>
    </footer>
  );
}
