import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  CalendarCheck2,
  ChevronRight,
  Clapperboard,
  Crown,
  Drama,
  Dumbbell,
  Gamepad2,
  Gem,
  Gift,
  Globe2,
  GraduationCap,
  Heart,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Ticket,
  Trophy,
  Users,
  Vote,
  Zap
} from "lucide-react";

import { CreatorAvatar } from "@/components/onlycreatorawards/CreatorAvatar";
import { Badge } from "@/components/ui/badge";
import { getCreatorStarsLevel } from "@/lib/onlycreatorawards/scoring";
import type { Award as AwardType, CreatorProfile } from "@/lib/onlycreatorawards/types";

type Accent = "gold" | "purple" | "rose" | "cyan" | "blue";

const accentStyles: Record<Accent, { border: string; text: string; bg: string; glow: string; button: string }> = {
  gold: {
    border: "border-brand-amber/[0.55]",
    text: "text-brand-amber",
    bg: "bg-brand-amber/10",
    glow: "shadow-gold-glow",
    button: "from-[#ffe49a] to-brand-amber text-ink"
  },
  purple: {
    border: "border-brand-purple/[0.55]",
    text: "text-[#d8b4fe]",
    bg: "bg-brand-purple/[0.12]",
    glow: "shadow-purple-glow",
    button: "from-brand-purple to-[#d946ef] text-white"
  },
  rose: {
    border: "border-brand-rose/[0.55]",
    text: "text-brand-rose",
    bg: "bg-brand-rose/[0.12]",
    glow: "shadow-purple-glow",
    button: "from-brand-rose to-[#f973b7] text-white"
  },
  cyan: {
    border: "border-brand-cyan/[0.55]",
    text: "text-brand-cyan",
    bg: "bg-brand-cyan/10",
    glow: "shadow-cyan-glow",
    button: "from-brand-cyan to-[#14b8a6] text-ink"
  },
  blue: {
    border: "border-brand-blue/[0.55]",
    text: "text-brand-blue",
    bg: "bg-brand-blue/10",
    glow: "shadow-cyan-glow",
    button: "from-brand-blue to-[#2563eb] text-white"
  }
};

function labelFromSlug(slug: string) {
  return slug
    .replace(/-onlyfans/g, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(" Creators", "");
}

export function SectionHeader({
  eyebrow,
  title,
  description,
  href,
  linkLabel
}: {
  eyebrow: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <div className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-white">
          <Star className="h-4 w-4 fill-brand-amber text-brand-amber" aria-hidden="true" />
          {eyebrow}
        </div>
        <h2 className="mt-3 text-3xl font-black tracking-normal text-white sm:text-4xl">{title}</h2>
        {description ? <p className="mt-3 max-w-2xl text-sm leading-6 text-white/[0.62] sm:text-base">{description}</p> : null}
      </div>
      {href && linkLabel ? (
        <Link href={href} className="inline-flex items-center gap-2 text-sm font-black text-brand-amber transition hover:text-white">
          {linkLabel}
          <ChevronRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      ) : null}
    </div>
  );
}

export function StatCard({ icon: Icon, value, label, accent }: { icon: LucideIcon; value: string; label: string; accent: Accent }) {
  const style = accentStyles[accent];

  return (
    <div className="flex min-h-20 items-center justify-center gap-4 border-white/10 px-4 py-4 sm:border-r last:border-r-0">
      <Icon className={`h-8 w-8 ${style.text}`} aria-hidden="true" />
      <div>
        <div className={`text-2xl font-black ${style.text}`}>{value}</div>
        <div className="text-sm font-bold text-white/[0.68]">{label}</div>
      </div>
    </div>
  );
}

export function AwardCard({
  award,
  icon: Icon,
  accent,
  description
}: {
  award: AwardType;
  icon: LucideIcon;
  accent: Accent;
  description: string;
}) {
  const style = accentStyles[accent];

  return (
    <Link href={`/awards/${award.year}/${award.slug}`} className="group block h-full">
      <article className={`flex h-full flex-col rounded-lg border ${style.border} bg-white/[0.045] p-5 text-center transition hover:-translate-y-1 ${style.glow}`}>
        <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-lg border ${style.border} ${style.bg}`}>
          <Icon className={`h-9 w-9 ${style.text}`} aria-hidden="true" />
        </div>
        <h3 className={`mt-5 text-xl font-black uppercase leading-tight ${style.text}`}>{award.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-white/[0.62]">{description}</p>
        <span className={`mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-gradient-to-b px-4 text-sm font-black transition group-hover:scale-[1.02] ${style.button}`}>
          Vote Now
        </span>
      </article>
    </Link>
  );
}

export function SpotlightCreatorCard({ creator, rank }: { creator: CreatorProfile; rank: number }) {
  const primaryCategory = creator.categories[0] ? labelFromSlug(creator.categories[0]) : "Creator";

  return (
    <Link href={`/creator/${creator.slug}`} className="group block">
      <article className="relative min-h-[230px] overflow-hidden rounded-lg border border-white/[0.12] bg-white/[0.045] p-4 transition hover:-translate-y-1 hover:border-brand-cyan/60 hover:shadow-cyan-glow">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(168,85,247,0.28),transparent_18rem)] opacity-70" />
        <div className="relative flex items-start justify-between gap-3">
          <Badge className="min-h-7 border-brand-green/[0.45] bg-brand-green/[0.12] text-brand-green">#{rank}</Badge>
          {creator.isVerified ? <BadgeCheck className="h-5 w-5 fill-brand-blue text-white" aria-label="Verified creator" /> : null}
        </div>
        <div className="relative mt-8 flex items-end justify-between gap-4">
          <div>
            <Badge className="min-h-7 border-brand-purple/[0.45] bg-brand-purple/[0.16] text-[#e9d5ff]">{primaryCategory}</Badge>
            <h3 className="mt-3 text-xl font-black text-white transition group-hover:text-brand-amber">{creator.displayName}</h3>
            <p className="mt-1 text-sm font-bold text-white/[0.58]">{creator.totalVotes.toLocaleString()} votes</p>
          </div>
          <CreatorAvatar creator={creator} size="lg" />
        </div>
        <div className="relative mt-5 flex items-center justify-between border-t border-white/10 pt-4 text-sm font-bold text-white/[0.62]">
          <span>{creator.handle}</span>
          <span className="inline-flex items-center gap-1 text-brand-amber">
            <Star className="h-4 w-4 fill-brand-amber" aria-hidden="true" />
            {creator.creatorStarsScore}
          </span>
        </div>
      </article>
    </Link>
  );
}

export function LeaderboardCard({ creator, rank }: { creator: CreatorProfile; rank: number }) {
  const isWinnerSlot = rank <= 3;
  const badge = getCreatorStarsLevel(creator.creatorStarsScore);

  return (
    <Link href={`/creator/${creator.slug}`} className="group block">
      <article
        className={`grid min-h-24 grid-cols-[42px_52px_1fr_auto] items-center gap-3 rounded-lg border bg-white/[0.045] p-3 transition hover:-translate-y-0.5 ${
          isWinnerSlot ? "border-brand-amber/[0.55] shadow-gold-glow" : "border-white/[0.14] hover:border-brand-cyan/[0.55]"
        }`}
      >
        <div className={`flex h-full items-start justify-center rounded-lg pt-2 text-xl font-black ${isWinnerSlot ? "bg-brand-amber text-ink" : "bg-white/[0.08] text-white"}`}>
          {rank}
        </div>
        <CreatorAvatar creator={creator} size="sm" />
        <div className="min-w-0">
          <h3 className="truncate font-black text-white group-hover:text-brand-amber">{creator.displayName}</h3>
          <p className="truncate text-xs font-bold text-white/50">{badge}</p>
        </div>
        <div className="text-right">
          <div className="text-xl font-black text-white">{creator.creatorStarsScore}</div>
          <div className="inline-flex items-center gap-1 text-xs font-bold text-brand-amber">
            <Star className="h-3.5 w-3.5 fill-brand-amber" aria-hidden="true" />
            Score
          </div>
        </div>
      </article>
    </Link>
  );
}

export function CategoryCard({
  title,
  href,
  icon: Icon,
  accent
}: {
  title: string;
  href: string;
  icon: LucideIcon;
  accent: Accent;
}) {
  const style = accentStyles[accent];

  return (
    <Link href={href} className="group block">
      <article className={`flex min-h-28 flex-col items-center justify-center rounded-lg border ${style.border} bg-white/[0.035] p-4 text-center transition hover:-translate-y-1 ${style.glow}`}>
        <Icon className={`h-9 w-9 ${style.text}`} aria-hidden="true" />
        <h3 className={`mt-3 text-sm font-black uppercase ${style.text}`}>{title}</h3>
      </article>
    </Link>
  );
}

export function RewardsCTASection() {
  const features = [
    { icon: CalendarCheck2, title: "Vote Every Month", body: "New voting opens every month." },
    { icon: Gift, title: "Earn Rewards", body: "Unlock points, badges, and rewards." },
    { icon: Ticket, title: "Win VIP Perks", body: "Top voters get VIP experiences." }
  ];

  return (
    <section className="rounded-lg border border-brand-amber/40 bg-[radial-gradient(circle_at_8%_50%,rgba(236,72,153,0.35),transparent_15rem),linear-gradient(90deg,rgba(168,85,247,0.14),rgba(244,201,93,0.08))] p-5 shadow-purple-glow sm:p-7">
      <div className="grid gap-6 lg:grid-cols-[1.1fr_1.4fr_auto] lg:items-center">
        <div className="flex items-center gap-5">
          <div className="hidden h-24 w-24 items-center justify-center rounded-lg border border-brand-rose/[0.55] bg-brand-rose/[0.12] sm:flex">
            <Heart className="h-14 w-14 text-brand-rose" aria-hidden="true" />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-brand-amber">Your vote. Real impact.</p>
            <h2 className="mt-2 text-3xl font-black text-white">
              Vote Monthly. <span className="text-brand-amber">Win Rewards.</span>
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-white/[0.66]">
              Support your favorite creators and unlock rewards, badges, and exclusive experiences every month.
            </p>
          </div>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {features.map(({ icon: Icon, title, body }) => (
            <div key={title} className="flex items-start gap-3 rounded-lg border border-white/10 bg-black/20 p-3">
              <Icon className="h-6 w-6 shrink-0 text-brand-amber" aria-hidden="true" />
              <div>
                <h3 className="text-sm font-black text-white">{title}</h3>
                <p className="mt-1 text-xs leading-5 text-white/[0.56]">{body}</p>
              </div>
            </div>
          ))}
        </div>
        <Link
          href="/awards/2026"
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-gradient-to-b from-[#ffe49a] to-brand-amber px-4 text-sm font-black text-ink transition hover:from-white hover:to-[#f7c85c]"
        >
          Start Voting Now
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export const homepageStats = [
  { icon: Users, value: "25.7K+", label: "Creators", accent: "gold" as const },
  { icon: Ticket, value: "3.2M+", label: "Votes Cast", accent: "purple" as const },
  { icon: Trophy, value: "24", label: "Awards", accent: "cyan" as const },
  { icon: Star, value: "18", label: "Categories", accent: "rose" as const }
];

export const homepageAwardVisuals: Record<string, { icon: LucideIcon; accent: Accent; description: string }> = {
  "creator-of-the-year": {
    icon: Crown,
    accent: "gold",
    description: "The ultimate honor. One creator rises above the field."
  },
  "rising-star": {
    icon: Sparkles,
    accent: "purple",
    description: "Honoring breakthrough creators making waves."
  },
  "fan-favorite": {
    icon: Heart,
    accent: "rose",
    description: "Chosen by the community. Powered by your votes."
  },
  "best-fitness-creator": {
    icon: Dumbbell,
    accent: "blue",
    description: "Celebrating strength, consistency, and impact."
  },
  "best-cosplay-creator": {
    icon: Drama,
    accent: "cyan",
    description: "Where creativity becomes legendary."
  }
};

export const homepageCategories = [
  { title: "Fitness", href: "/category/fitness-creators", icon: Dumbbell, accent: "cyan" as const },
  { title: "Cosplay", href: "/category/cosplay-creators", icon: Drama, accent: "rose" as const },
  { title: "Gamer", href: "/category/gamer-creators", icon: Gamepad2, accent: "blue" as const },
  { title: "Lifestyle", href: "/category/lifestyle-creators", icon: Gem, accent: "rose" as const },
  { title: "Alternative", href: "/top-alternative-onlyfans-creators", icon: Zap, accent: "purple" as const },
  { title: "Entertainment", href: "/awards/2026", icon: Clapperboard, accent: "gold" as const },
  { title: "International", href: "/top-international-onlyfans-creators", icon: Globe2, accent: "cyan" as const },
  { title: "Education", href: "/categories", icon: GraduationCap, accent: "purple" as const }
];

export const heroTrustItems = [
  { icon: ShieldCheck, label: "PG-safe public profiles" },
  { icon: Award, label: "Annual awards hub" },
  { icon: Vote, label: "Verified fan voting" },
  { icon: Search, label: "Creator discovery" }
];
