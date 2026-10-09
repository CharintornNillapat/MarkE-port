import type { ComponentType } from "react";
import * as motion from "framer-motion/client";
import { ExternalLink, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CopyButton } from "@/components/ui/CopyButton";
import { GithubIcon } from "@/components/ui/icons";
import { contact, ui } from "@/content/site";
import { reveal, revealItem } from "@/lib/motion";

type Icon = ComponentType<{ className?: string; "aria-hidden"?: boolean }>;

// Icon and copy label per channel, keyed by label like the Footer's GitHub lookup.
// A new channel in site.ts needs an entry here, or the build fails while prerendering.
const channelUi: Record<string, { Icon: Icon; copy: string; open: string }> = {
  Email: { Icon: Mail, copy: ui.copy.email, open: ui.contact.open.email },
  GitHub: { Icon: GithubIcon, copy: ui.copy.github, open: ui.contact.open.github },
};

export function Contact() {
  return (
    // A single item: it triggers itself and fades up as one piece (revealItem's variants replace the group's).
    <motion.div {...reveal} {...revealItem} className="mt-10">
      <Card>
        <h3 className="text-lg font-medium text-text">{ui.contact.heading}</h3>
        <p className="mt-2 text-sm leading-relaxed text-text-muted">{ui.contact.line}</p>
        <ul className="mt-6 divide-y divide-border border-t border-border">
          {contact.map(({ label, display, href }) => {
            const { Icon, copy, open } = channelUi[label];

            return (
              <li
                key={label}
                className="flex flex-col gap-3 py-4 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <p className="flex min-w-0 items-center gap-3 text-sm text-text">
                  <Icon aria-hidden className="size-5 shrink-0 text-text-muted" />
                  <span className="wrap-anywhere">{display}</span>
                </p>
                <div className="flex gap-2">
                  {/* Email copies the bare address; links copy the full URL. */}
                  <CopyButton value={href.replace(/^mailto:/, "")} label={copy} />
                  <Button href={href} variant="secondary">
                    <ExternalLink
                      aria-hidden
                      className="motion-safe:group-hover:translate-x-0.5 motion-safe:group-hover:-translate-y-0.5"
                    />
                    {open}
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>
    </motion.div>
  );
}
