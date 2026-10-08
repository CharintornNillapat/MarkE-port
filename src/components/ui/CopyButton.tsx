"use client";

import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { buttonClass } from "@/components/ui/Button";
import { ui } from "@/content/site";

// DESIGN.MD §4. The Check icon and "Copied" appear only after the clipboard write succeeds,
// so a blocked copy never claims success. `clipboard` is missing outside secure contexts, hence `?.`.
export function CopyButton({ value, label }: { value: string; label: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);

  const Icon = copied ? Check : Copy;

  return (
    <>
      <button
        type="button"
        aria-label={label}
        onClick={() =>
          navigator.clipboard?.writeText(value).then(
            () => setCopied(true),
            () => {}, // Denied: nothing to announce; the text and Open link still work.
          )
        }
        className={buttonClass("secondary", "w-11 px-0 md:w-10")}
      >
        <Icon aria-hidden />
      </button>
      <span aria-live="polite" className="sr-only">
        {copied ? ui.copy.done : ""}
      </span>
    </>
  );
}
