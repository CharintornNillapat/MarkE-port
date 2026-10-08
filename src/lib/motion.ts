import type { Variants } from "framer-motion";

// DESIGN.MD §6 entrance. Spread `reveal` on a group and `revealItem` on each child: the group fires once
// when its top passes 90% of the viewport and starts its items 60ms apart (last of 4 ends at 580ms).
// Plain objects, so server components can hand them to `framer-motion/client` elements.
// Reduced motion: <MotionConfig reducedMotion="user"> in layout.tsx drops the y offset, leaving the fade.
export const reveal = {
  initial: "hidden",
  whileInView: "show",
  viewport: { once: true, margin: "0px 0px -10% 0px" },
  variants: { hidden: {}, show: { transition: { staggerChildren: 0.06 } } } satisfies Variants,
} as const;

// `data-reveal` lets the <noscript> rule in layout.tsx un-hide items when JS never runs.
export const revealItem = {
  "data-reveal": "",
  variants: {
    hidden: { opacity: 0, y: 8 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  } satisfies Variants,
};

// Hairline that draws in left → right inside a `reveal` group (origin-left on the element).
// Reduced motion skips the scale, so the line is simply there.
export const revealLine = {
  "data-reveal": "",
  variants: {
    hidden: { scaleX: 0 },
    show: { scaleX: 1, transition: { duration: 0.6, ease: [0.2, 0.9, 0.2, 1] } },
  } satisfies Variants,
};

// DESIGN.MD §6 spring for pointer-driven motion (tilt, magnetic CTAs).
export const spring = { stiffness: 150, damping: 20 };
