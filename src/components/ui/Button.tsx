import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-text text-bg hover:opacity-90",
  secondary: "border border-border text-text hover:border-border-strong hover:bg-surface-2",
};

type Props = ComponentProps<"a"> & { href: string; variant?: keyof typeof variants };

// A link styled as a button: every button so far navigates. External hrefs open in a new tab (DESIGN.MD §7).
export function Button({ href, variant = "primary", className, ...props }: Props) {
  const external = href.startsWith("http");

  return (
    <a
      href={href}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] px-4 text-sm font-medium transition-[color,background-color,border-color,opacity] duration-150 md:h-10 [&_svg]:size-4 [&_svg]:shrink-0",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
