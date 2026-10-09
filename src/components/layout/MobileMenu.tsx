"use client";

import { useState } from "react";
import { Dialog } from "radix-ui";
import { Menu, X } from "lucide-react";
import { ui } from "@/content/site";
import { NavLinks } from "./NavLinks";

const iconButton =
  "inline-flex size-11 items-center justify-center text-text-muted transition-[color,background-color] duration-150 hover:bg-text hover:text-bg";

// Radix Dialog gives focus trap, Esc/overlay close and focus return to the trigger.
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={iconButton} aria-label={ui.nav.menu}>
        <Menu className="size-5" aria-hidden />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-bg/80 duration-200 data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        {/* Slide only when motion is allowed; reduced motion gets the fade alone. */}
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed inset-y-0 right-0 z-50 flex w-3/4 max-w-xs flex-col gap-4 border-l border-border bg-surface p-4 duration-200 data-open:animate-in data-open:fade-in-0 motion-safe:data-open:slide-in-from-right data-closed:animate-out data-closed:fade-out-0 motion-safe:data-closed:slide-out-to-right"
        >
          <div className="flex items-center justify-between">
            <Dialog.Title className="pl-3 font-mono text-xs uppercase tracking-widest text-text-muted">
              {ui.nav.menu}
            </Dialog.Title>
            <Dialog.Close className={iconButton} aria-label={ui.nav.close}>
              <X className="size-5" aria-hidden />
            </Dialog.Close>
          </div>
          <NavLinks
            className="flex flex-col gap-1"
            linkClassName="flex min-h-11 items-center px-3 text-base"
            onNavigate={() => setOpen(false)}
          />
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
