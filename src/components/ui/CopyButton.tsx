"use client";

import { useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { ui } from "@/content/site";

// DESIGN.MD §4. Check + "Copied" appear only after the clipboard write succeeds; a blocked write shows
// X + "Copy failed" instead, so the user knows to copy the text by hand. Both reset after 2s.
// `clipboard` is missing outside secure contexts, hence the rejected promise fallback.
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [result, setResult] = useState<"done" | "failed" | null>(null);

  useEffect(() => {
    if (!result) return;
    const timer = setTimeout(() => setResult(null), 2000);
    return () => clearTimeout(timer);
  }, [result]);

  const Icon = result === "done" ? Check : result === "failed" ? X : Copy;

  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={() =>
          (navigator.clipboard?.writeText(value) ?? Promise.reject()).then(
            () => setResult("done"),
            () => setResult("failed"),
          )
        }
        className={buttonClass("secondary", "w-11 px-0 md:w-10")}
      >
        <Icon aria-hidden />
      </button>
      <span aria-live="polite" className="sr-only">
        {result ? ui.copy[result] : ""}
      </span>
    </>
  );
}
