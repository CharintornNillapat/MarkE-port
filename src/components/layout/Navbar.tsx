import { Button } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { identity, ui } from "@/content/site";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

export function Navbar() {
  return (
    <header className="fixed inset-x-4 top-4 z-40 md:inset-x-0 md:mx-auto md:w-fit">
      <nav className="flex items-center gap-2 rounded-full border border-border bg-surface/70 p-1.5 backdrop-blur-md md:gap-4">
        <a
          href="#top"
          className="inline-flex h-11 items-center justify-center rounded-full px-3 text-sm font-semibold tracking-wider text-text md:h-10"
        >
          {identity.logo}
          <span className="sr-only"> {identity.name}</span>
        </a>
        <NavLinks
          className="hidden items-center gap-1 md:flex"
          linkClassName="rounded-full px-3 py-2 text-sm"
        />
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <Magnetic>
            <Button href={ui.nav.cta.href} className="rounded-full">
              {ui.nav.cta.label}
            </Button>
          </Magnetic>
          <div className="md:hidden">
            <MobileMenu />
          </div>
        </div>
      </nav>
    </header>
  );
}
