import Link from "next/link";
import { Button } from "../ui/Button";
import { BrandLogoLink } from "../brand/BrandLogo";
import { SOCIAL_LINKS } from "../../lib/constants/socialLinks";

type FooterProps = {
  locale: "en" | "bn";
};

const links = [
  { label: "Articles", href: "/articles" },
  { label: "Projects", href: "/projects" },
  { label: "Team", href: "/team" },
  { label: "Events", href: "/events" },
  { label: "Campaigns", href: "/campaigns" }
] as const;

const social = [
  { label: "F", href: SOCIAL_LINKS.facebook },
  { label: "in", href: SOCIAL_LINKS.linkedIn },
  { label: "IG", href: SOCIAL_LINKS.instagram }
] as const;

export function Footer({ locale }: FooterProps) {
  const year = new Date().getFullYear();
  return (
    <footer className="texture-overlay relative border-t border-white/30 bg-[#0d1116] text-white">
      <div className="container-shell relative z-10 grid gap-12 py-16 lg:grid-cols-4">
        <div className="lg:col-span-2">
          <BrandLogoLink href={`/${locale}`} size="footer" linkClassName="hover:opacity-90" />
          <p className="mt-4 max-w-md text-sm text-white/80">
            A digital rights organization in Bangladesh defending an open, safe, and rights-respecting internet.
          </p>
          <div className="mt-6 flex gap-3">
            {social.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="inline-flex h-9 w-9 items-center justify-center border border-white/50 text-xs font-semibold hover:bg-white hover:text-[#0d1116]"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/70">Navigation</h3>
          <div className="flex flex-col gap-2 text-sm">
            {links.map((item) => (
              <Link key={item.label} href={`/${locale}${item.href}`} className="hover:text-white/80">
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/70">Newsletter</h3>
          <form className="space-y-3">
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-white/50 bg-transparent px-3 py-2 text-sm placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/60"
            />
            <Button type="submit" className="w-full">
              Subscribe
            </Button>
          </form>
        </div>
      </div>
      <div className="relative z-10 border-t border-white/20">
        <div className="container-shell py-5 text-xs text-white/70">
          ©{" "}
          <span suppressHydrationWarning>{year}</span> Activate Rights. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
