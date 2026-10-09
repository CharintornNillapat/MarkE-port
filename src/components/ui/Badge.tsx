import type { ReactNode } from "react";

// DESIGN.MD §4.
export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block border border-border px-2 py-0.5 font-mono text-xs text-text-muted">
      {children}
    </span>
  );
}
