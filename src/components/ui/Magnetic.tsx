"use client";

import type { PointerEvent, ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { spring } from "@/lib/motion";

const MAX_PX = 6;

// DESIGN.MD §6: a primary CTA drifts up to 6px toward the mouse and springs back on leave.
// The outer span is a hover-only zone 8px wider than the button (md+, not clickable), so the pull
// starts just outside it; the inner span moves. Mouse only; nothing moves with reduced motion.
export function Magnetic({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion();
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);

  const onPointerMove = (e: PointerEvent<HTMLSpanElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    x.set(((e.clientX - box.left) / box.width - 0.5) * 2 * MAX_PX);
    y.set(((e.clientY - box.top) / box.height - 0.5) * 2 * MAX_PX);
  };
  const release = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <span className="inline-flex md:-m-2 md:p-2" onPointerMove={onPointerMove} onPointerLeave={release}>
      <motion.span className="inline-flex" style={{ x, y }}>
        {children}
      </motion.span>
    </span>
  );
}
