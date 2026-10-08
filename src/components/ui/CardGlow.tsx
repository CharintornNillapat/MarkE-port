"use client";

import { useEffect } from "react";

// One listener for every Card: writes the mouse position into the hovered card's --glow-x/--glow-y,
// which the [data-glow]::before gradient in globals.css follows. Touch and pen are ignored.
export function CardGlow() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const card = (e.target as Element).closest<HTMLElement>("[data-glow]");
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--glow-x", `${e.clientX - box.left}px`);
      card.style.setProperty("--glow-y", `${e.clientY - box.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
