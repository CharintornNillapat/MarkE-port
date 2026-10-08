"use client";

import { visibleSections } from "@/content/site";
import { useActiveSection } from "@/lib/useActiveSection";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

export function NavLinks({ className, linkClassName, onNavigate }: Props) {
  const active = useActiveSection();

  return (
    <ul className={className}>
      {visibleSections.map(({ id, label }) => (
        <li key={id}>
          <a
            href={`#${id}`}
            aria-current={active === id ? "true" : undefined}
            onClick={onNavigate}
            className={cn(
              // Not transition-colors: it would also fade the focus ring's outline-color in over 150ms.
              "text-text-muted transition-[color,background-color] duration-150 hover:text-text aria-[current=true]:text-accent",
              linkClassName,
            )}
          >
            {label}
          </a>
        </li>
      ))}
    </ul>
  );
}
