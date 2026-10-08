import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// DESIGN.MD §4. `data-glow` opts into the two-layer cursor spotlight (globals.css + CardGlow);
// `isolate` keeps the surface layer behind the content, `relative` anchors it and any border beam.
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
