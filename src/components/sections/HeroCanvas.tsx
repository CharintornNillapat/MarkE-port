"use client";

import { useEffect, useRef } from "react";

// DESIGN.MD §6 hero constellation. The canvas code is fetched only when motion is allowed, and the scene
// is torn down as soon as reduced motion turns on, or on unmount.
export function HeroCanvas() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)");
    let teardown: (() => void) | undefined;
    let run = 0; // bumped on every change, so an import still in flight can't mount a stale scene

    const sync = () => {
      const current = ++run;
      teardown?.();
      teardown = undefined;
      if (reduce.matches) return;
      import("@/lib/constellation").then(({ mountConstellation }) => {
        if (current === run) teardown = mountConstellation(container);
      });
    };

    sync();
    reduce.addEventListener("change", sync);
    return () => {
      run++;
      reduce.removeEventListener("change", sync);
      teardown?.();
    };
  }, []);

  return <div ref={ref} className="absolute inset-0" />;
}
