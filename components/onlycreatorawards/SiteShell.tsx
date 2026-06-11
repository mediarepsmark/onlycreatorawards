import Link from "next/link";
import type { ReactNode } from "react";
import { Award, BadgeCheck, LayoutDashboard, Search, ShieldCheck, Star, Trophy } from "lucide-react";

import { siteConfig } from "@/lib/onlycreatorawards/repository";

const primaryNav = [
  { href: "/creators", label: "Creators" },
  { href: "/awards/2026", label: "Awards" },
  { href: "/creatorstars", label: "CreatorStars" },
  { href: "/categories", label: "Categories" },
  { href: "/rewards", label: "Rewards" }
];

const footerNav = [
  { href: "/methodology", label: "Methodology" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/content-policy", label: "Content Policy" },
  { href: "/removal-request", label: "Removal Request" },
  { href: "/age-verification", label: "Age Verification" }
];

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f7f8f5] text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-black tracking-normal text-ink">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white">
              <Trophy className="h-5 w-5" aria-hidden="true" />
            </span>
            <span className="leading-tight">
              OnlyCreator
              <span className="block text-sm font-extrabold text-brand-amber">Awards</span>
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex" aria-label="Primary navigation">
            {primaryNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-bold text-muted transition hover:bg-slate-100 hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/claim-profile"
              className="hidden min-h-10 items-center gap-2 rounded-lg border border-line bg-white px-3 text-sm font-extrabold text-ink transition hover:bg-slate-50 sm:inline-flex"
            >
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              Claim
            </Link>
            <Link
              href="/login"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-brand-green px-3 text-sm font-extrabold text-white transition hover:bg-emerald-800"
            >
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              Login
            </Link>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="border-t border-line bg-ink text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.3fr_1fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3 font-black">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-ink">
                <Award className="h-5 w-5" aria-hidden="true" />
              </span>
              {siteConfig.domain}
            </div>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75">{siteConfig.disclaimer}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/creators" className="flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white">
              <Search className="h-4 w-4" aria-hidden="true" />
              Creator search
            </Link>
            <Link href="/admin" className="flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white">
              <LayoutDashboard className="h-4 w-4" aria-hidden="true" />
              Admin
            </Link>
            <Link href="/creator-dashboard" className="flex items-center gap-2 text-sm font-bold text-white/80 hover:text-white">
              <Star className="h-4 w-4" aria-hidden="true" />
              Creator dashboard
            </Link>
            {footerNav.map((item) => (
              <Link key={item.href} href={item.href} className="text-sm font-bold text-white/70 hover:text-white">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
