import Link from "next/link";
import type { ReactNode } from "react";
import {
  ChevronRight,
  Instagram,
  LogIn,
  MessageCircle,
  Send,
  Sparkles,
  Star,
  Trophy,
  Twitch,
  UserPlus,
  Youtube
} from "lucide-react";

import { siteConfig } from "@/lib/onlycreatorawards/repository";

const primaryNav = [
  { href: "/creators", label: "Creators" },
  { href: "/models", label: "Models" },
  { href: "/creatorstars", label: "Rankings" },
  { href: "/awards/2026", label: "Awards" },
  { href: "/awards/2026", label: "Vote" },
  { href: "/claim-profile", label: "Claim Profile" }
];

const exploreLinks = [
  { href: "/creators", label: "Creators" },
  { href: "/models", label: "Models" },
  { href: "/creatorstars", label: "Rankings" },
  { href: "/awards", label: "Awards" },
  { href: "/categories", label: "Categories" },
  { href: "/blog", label: "Blog" },
  { href: "/rewards", label: "Rewards" }
];

const participateLinks = [
  { href: "/awards/2026", label: "Vote Now" },
  { href: "/methodology", label: "How It Works" },
  { href: "/claim-profile", label: "Claim Profile" },
  { href: "/creator-dashboard", label: "Creator Resources" },
  { href: "/rewards/rules", label: "Voting FAQ" }
];

const aboutLinks = [
  { href: "/content-policy", label: "Content Policy" },
  { href: "/seo-ai-criteria", label: "SEO Criteria" },
  { href: "/removal-request", label: "Removal Request" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/age-verification", label: "Age Verification" }
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-3">
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-brand-amber/[0.60] bg-brand-amber/10 shadow-gold-glow">
        <Star className="absolute h-8 w-8 fill-brand-amber/[0.20] text-brand-amber" aria-hidden="true" />
        <Trophy className="relative h-5 w-5 text-brand-amber" aria-hidden="true" />
      </span>
      <span className="leading-[0.9] tracking-wide text-white">
        <span className="block text-sm font-black uppercase">Only</span>
        <span className="block text-sm font-black uppercase">Creator</span>
        {!compact ? <span className="block text-sm font-black uppercase text-brand-amber">Awards</span> : null}
      </span>
    </span>
  );
}

export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen overflow-hidden bg-midnight text-white">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/[0.72] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="rounded-lg outline-none ring-brand-amber/[0.40] transition focus-visible:ring-4" aria-label="OnlyCreatorAwards home">
            <BrandMark />
          </Link>
          <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary navigation">
            {primaryNav.map((item) => (
              <Link
                key={`${item.href}-${item.label}`}
                href={item.href}
                className="rounded-lg px-3 py-2 text-sm font-extrabold text-white/[0.82] transition hover:bg-white/[0.08] hover:text-brand-amber"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="hidden min-h-10 items-center gap-2 rounded-lg border border-brand-amber/[0.60] bg-black/30 px-4 text-sm font-extrabold text-white transition hover:bg-brand-amber/10 hover:text-brand-amber sm:inline-flex"
            >
              <LogIn className="h-4 w-4" aria-hidden="true" />
              Sign In
            </Link>
            <Link
              href="/register"
              className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-brand-amber bg-gradient-to-b from-[#ffe49a] to-brand-amber px-4 text-sm font-black text-ink shadow-gold-glow transition hover:-translate-y-0.5 hover:from-white hover:to-[#f6c45a]"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              Join Now
            </Link>
          </div>
        </div>
        <nav className="border-t border-white/10 px-4 py-2 lg:hidden" aria-label="Mobile navigation">
          <div className="mx-auto flex max-w-7xl gap-2 overflow-x-auto">
            {primaryNav.map((item) => (
              <Link
                key={`mobile-${item.href}-${item.label}`}
                href={item.href}
                className="whitespace-nowrap rounded-lg border border-white/10 bg-white/[0.035] px-3 py-2 text-xs font-black text-white/[0.78] transition hover:border-brand-amber/[0.60] hover:text-brand-amber"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="relative border-t border-white/10 bg-[#04050a] text-white">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-amber/70 to-transparent" />
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1.25fr_2fr_1.2fr] lg:px-8">
          <div>
            <BrandMark />
            <p className="mt-5 max-w-sm text-sm leading-6 text-white/[0.66]">
              The global home of creator recognition, community awards, rankings, and PG-safe discovery.
            </p>
            <p className="mt-5 text-xs leading-5 text-white/[0.48]">{siteConfig.disclaimer}</p>
          </div>
          <div className="grid gap-8 sm:grid-cols-3">
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-brand-amber">Explore</h2>
              <div className="mt-4 grid gap-3">
                {exploreLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="text-sm font-bold text-white/[0.66] transition hover:text-brand-amber">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-brand-rose">Participate</h2>
              <div className="mt-4 grid gap-3">
                {participateLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="text-sm font-bold text-white/[0.66] transition hover:text-brand-rose">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.18em] text-brand-cyan">About</h2>
              <div className="mt-4 grid gap-3">
                {aboutLinks.map((item) => (
                  <Link key={item.href} href={item.href} className="text-sm font-bold text-white/[0.66] transition hover:text-brand-cyan">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-[0.18em] text-white">Stay Connected</h2>
            <p className="mt-4 text-sm leading-6 text-white/[0.66]">Get award updates, creator spotlights, and voting reminders.</p>
            <form action="/register" className="mt-5 flex overflow-hidden rounded-lg border border-white/[0.15] bg-white/[0.05] focus-within:border-brand-amber">
              <label className="sr-only" htmlFor="footer-email">
                Email address
              </label>
              <input
                id="footer-email"
                name="email"
                type="email"
                placeholder="Enter your email"
                className="min-w-0 flex-1 bg-transparent px-3 text-sm font-bold text-white outline-none placeholder:text-white/[0.42]"
              />
              <button type="submit" className="inline-flex min-h-11 w-12 items-center justify-center bg-brand-amber text-ink transition hover:bg-white" aria-label="Join newsletter">
                <Send className="h-4 w-4" aria-hidden="true" />
              </button>
            </form>
            <div className="mt-5 flex gap-3 text-white/[0.66]">
              {[
                { icon: Instagram, label: "Instagram" },
                { icon: Trophy, label: "Awards feed" },
                { icon: Youtube, label: "YouTube" },
                { icon: Twitch, label: "Twitch" },
                { icon: MessageCircle, label: "Community" },
                { icon: Sparkles, label: "Creator updates" }
              ].map(({ icon: Icon, label }) => (
                <Link
                  key={label}
                  href="/social/instagram-models-with-onlyfans"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] transition hover:border-brand-amber/[0.70] hover:text-brand-amber"
                  aria-label={label}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 text-xs font-bold text-white/[0.45] sm:px-6 lg:px-8">
            <span>(c) 2026 OnlyCreatorAwards. All rights reserved.</span>
            <Link href="/methodology" className="inline-flex items-center gap-1 transition hover:text-brand-amber">
              Methodology
              <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
