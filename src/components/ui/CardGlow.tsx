"use client";

import { useEffect } from "react";

// One listener for every Card: writes the mouse position into the hovered card's --mouse-x/--mouse-y.
// Both spotlight layers in globals.css follow them, and the registered properties ease over 120ms,
// so the light glides instead of jumping. Touch and pen are ignored.
export function CardGlow() {
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const card = (e.target as Element).closest<HTMLElement>("[data-glow]");
      if (!card) return;
      const box = card.getBoundingClientRect();
      card.style.setProperty("--mouse-x", `${e.clientX - box.left}px`);
      card.style.setProperty("--mouse-y", `${e.clientY - box.top}px`);
    };
    document.addEventListener("pointermove", onMove, { passive: true });
    return () => document.removeEventListener("pointermove", onMove);
  }, []);

  return null;
}
