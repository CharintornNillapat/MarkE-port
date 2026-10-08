"use client";

import { useEffect, useState } from "react";
import { visibleSections } from "@/content/site";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  linkClassName?: string;
  onNavigate?: () => void;
};

export function NavLinks({ className, linkClassName, onNavigate }: Props) {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    // Active = the section crossing a thin band just above the middle of the viewport.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          setActive((cur) => (isIntersecting ? target.id : cur === target.id ? undefined : cur));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const { id } of visibleSections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

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
