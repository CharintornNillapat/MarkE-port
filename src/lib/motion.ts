import type { MotionProps, Variants } from "framer-motion";

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

// DESIGN.MD §6 hero intro, once on load: the CN mark shows alone, the name's letters rise in, then the
// rest of the hero fades up, `INTRO_REST` + 80ms per item. Reduced motion keeps only the fades.
export const INTRO_MARK: MotionProps = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 1.05] },
  transition: { duration: 1.1, times: [0, 0.3, 0.7, 1], ease: "easeInOut" },
};

export const introLetter = (k: number) => ({
  "data-reveal": "",
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.75 + k * 0.025, duration: 0.5, ease: [0.2, 0.9, 0.2, 1] },
}) as const;

const INTRO_REST = 1.2;
export const introItem = (i: number) => ({
  "data-reveal": "",
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: INTRO_REST + i * 0.08, duration: 0.4, ease: "easeOut" },
}) as const;

// DESIGN.MD §6 spring for pointer-driven motion (magnetic CTAs).
export const spring = { stiffness: 150, damping: 20 };
