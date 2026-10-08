import { useEffect, useState } from "react";
import { visibleSections } from "@/content/site";

// Id of the section crossing a thin band just above the middle of the viewport (undefined over the hero).
// Shared by the nav links (active colour) and the scroll ruler (section number).
export function useActiveSection() {
  const [active, setActive] = useState<string>();

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const { target, isIntersecting } of entries) {
          setActive((cur) => (isIntersecting ? target.id : cur === target.id ? undefined : cur));
        }
      },
      { rootMargin: "-40% 0px -55% 0px" },
    );
    for (const { id } of visibleSections) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  return active;
}
