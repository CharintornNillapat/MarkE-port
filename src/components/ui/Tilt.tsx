"use client";

import type { PointerEvent, ReactNode } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";
import { spring } from "@/lib/motion";

const MAX_DEG = 4;

// DESIGN.MD §6: a featured card leans toward the mouse (max 4°) on a spring and settles flat on leave.
// Mouse only; with reduced motion the handlers do nothing, so the card stays flat.
export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const rotateX = useSpring(0, spring);
  const rotateY = useSpring(0, spring);

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const box = e.currentTarget.getBoundingClientRect();
    rotateY.set(((e.clientX - box.left) / box.width - 0.5) * 2 * MAX_DEG);
    rotateX.set(-((e.clientY - box.top) / box.height - 0.5) * 2 * MAX_DEG);
  };
  const settle = () => {
    rotateX.set(0);
    rotateY.set(0);
  };

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onPointerMove={onPointerMove}
      onPointerLeave={settle}
    >
      {children}
    </motion.div>
  );
}
