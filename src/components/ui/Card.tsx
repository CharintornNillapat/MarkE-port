import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// DESIGN.MD §4. `data-glow` opts into the cursor glow (globals.css + CardGlow); `isolate` keeps it behind the content.
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-glow
      className={cn(
        "relative isolate rounded-2xl border border-border bg-surface p-6 transition-colors duration-150 hover:border-border-strong",
        className,
      )}
      {...props}
    />
  );
}
