export function StatusPill({ label }: { label: string }) {
  return (
    <p className="relative inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-sm text-text-muted">
      {/* Border beam and pulse are both off for reduced motion (DESIGN.MD §6). */}
      <span aria-hidden className="border-beam" />
      <span aria-hidden className="size-2 rounded-full bg-success motion-safe:animate-pulse" />
      {label}
    </p>
  );
}
