import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

// DESIGN.MD §4. `data-glow` opts into the two-layer cursor spotlight (globals.css + CardGlow);
// `isolate` keeps the surface layer behind the content, `relative` anchors it and any border beam.
export function Card({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-glow
      className={cn(
        "relative isolate border border-border bg-surface p-6 transition-colors duration-150 hover:border-border-strong",
        className,
      )}
      {...props}
    />
  );
}

// DESIGN.MD §4 card strip: a mono header bar across the card's top edge, label left, number right.
export function CardStrip({ label, index, as: Label = "p" }: { label: string; index: number; as?: "p" | "h3" }) {
  return (
    <div className="-mx-6 -mt-6 mb-6 flex items-baseline justify-between gap-4 border-b border-border px-6 py-3 font-mono text-xs tracking-widest text-text-muted uppercase">
      <Label>{label}</Label>
      <span aria-hidden>{String(index).padStart(2, "0")}</span>
    </div>
  );
}
