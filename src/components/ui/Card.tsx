import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// DESIGN.MD §4. The cursor-following glow is added in ROADMAP Phase 5.
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-6 transition-colors duration-150 hover:border-border-strong",
        className,
      )}
      {...props}
    />
  );
}
