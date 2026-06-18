import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowUpRight, Crown, Sparkles, Trophy, Vote } from "lucide-react";

import {
  AwardCard,
  CategoryCard,
  LeaderboardCard,
  RewardsCTASection,
  SectionHeader,
  SpotlightCreatorCard,
  StatCard,
  heroTrustItems,
  homepageAwardVisuals,
  homepageCategories,
  homepageStats
} from "@/components/onlycreatorawards/HomeVisuals";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { SearchPanel } from "@/components/onlycreatorawards/SearchPanel";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { getAwardYears, getAwards, getCreators, siteConfig } from "@/lib/onlycreatorawards/repository";
import { buildMetadata, organizationSchema, websiteSchema } from "@/lib/onlycreatorawards/seo";

export const metadata = buildMetadata({
  title: "OnlyCreatorAwards | Creator Awards and Discovery Engine",
  description:
    "Vote, discover creator rankings, browse awards, explore CreatorStars scores, and claim public creator profiles on a PG creator-safe platform.",
  path: "/"
});

export default function HomePage() {
  const creators = getCreators()
    .filter((creator) => creator.status === "PUBLISHED")
    .sort((first, second) => second.creatorStarsScore - first.creatorStarsScore);
  const trendingCreators = creators.slice(0, 6);
  const leaderboardCreators = creators.slice(0, 5);
  const awards = getAwards(2026).slice(0, 5);
  const awardYear = getAwardYears()[0] ?? 2026;

  return (
    <SiteShell>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <section className="relative overflow-hidden border-b border-white/10 bg-midnight text-white">
        <div className="absolute inset-0">
          <Image
            src={siteConfig.heroImage}
            alt="Cinematic awards stage for OnlyCreatorAwards"
            fill
            priority
            className="object-cover opacity-72"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_66%_34%,rgba(244,201,93,0.16),transparent_14rem),linear-gradient(90deg,#05060d_0%,rgba(5,6,13,0.92)_32%,rgba(5,6,13,0.45)_70%,#05060d_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-midnight to-transparent" />
        </div>
        <div className="relative mx-auto grid min-h-[720px] max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:px-8">
          <div>
            <Badge className="border-brand-amber/[0.45] bg-black/[0.35] text-brand-amber backdrop-blur">
              <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
              Celebrating creativity. Powering discovery.
            </Badge>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-[0.96] tracking-normal text-white sm:text-6xl lg:text-7xl">
              The Creator{" "}
              <span className="bg-gradient-to-r from-brand-amber via-brand-rose to-brand-cyan bg-clip-text text-transparent">
                Awards & Discovery Engine
              </span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg font-bold leading-8 text-white/[0.74]">
              Discover the world&apos;s top creators across every category. Vote in the annual awards and crown your favorites.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={`/awards/${awardYear}`}
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-brand-amber bg-gradient-to-b from-[#ffe49a] to-brand-amber px-5 font-black text-ink shadow-gold-glow transition hover:-translate-y-0.5 hover:from-white hover:to-[#f7c85c]"
              >
                <Trophy className="h-5 w-5" aria-hidden="true" />
                Vote Now
              </Link>
              <Link
                href="/creators"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-brand-amber/50 bg-black/[0.26] px-5 font-black text-white transition hover:bg-brand-amber/10 hover:text-brand-amber"
              >
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                Explore Creators
              </Link>
            </div>
            <div className="mt-8 max-w-[520px]">
              <SearchPanel compact />
            </div>
            <div className="mt-6 grid max-w-3xl gap-2 sm:grid-cols-2">
              {heroTrustItems.map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-sm font-bold text-white/[0.64]">
                  <Icon className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <div className="relative ml-auto aspect-[0.9] max-w-[440px] rounded-lg border border-brand-amber/30 bg-black/[0.28] p-6 shadow-purple-glow backdrop-blur">
              <div className="absolute -left-10 top-12 h-36 w-36 rounded-full bg-brand-purple/20 blur-3xl" />
              <div className="absolute -right-10 bottom-12 h-36 w-36 rounded-full bg-brand-cyan/[0.15] blur-3xl" />
              <div className="relative flex h-full flex-col justify-between rounded-lg border border-white/10 bg-white/[0.04] p-6">
                <div className="flex items-center justify-between">
                  <Badge className="border-brand-cyan/[0.45] bg-brand-cyan/10 text-brand-cyan">Live awards season</Badge>
                  <Crown className="h-8 w-8 text-brand-amber" aria-hidden="true" />
                </div>
                <div className="mx-auto flex h-44 w-44 items-center justify-center rounded-lg border border-brand-amber/[0.45] bg-brand-amber/10 shadow-gold-glow">
                  <Trophy className="h-24 w-24 text-brand-amber" aria-hidden="true" />
                </div>
                <div className="rounded-lg border border-brand-purple/[0.45] bg-black/[0.38] p-5">
                  <p className="text-2xl font-black uppercase leading-tight text-white">
                    Creators inspire.
                    <span className="block text-brand-rose">Communities ignite.</span>
                  </p>
                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                      <p className="text-xs font-bold text-white/[0.48]">Top Score</p>
                      <p className="text-2xl font-black text-brand-amber">{leaderboardCreators[0]?.creatorStarsScore ?? 98}</p>
                    </div>
                    <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                      <p className="text-xs font-bold text-white/[0.48]">Voting</p>
                      <p className="text-2xl font-black text-brand-cyan">Open</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative bg-midnight px-4 sm:px-6 lg:px-8">
        <div className="mx-auto -mt-12 grid max-w-7xl overflow-hidden rounded-lg border border-brand-amber/[0.42] bg-black/[0.54] shadow-gold-glow backdrop-blur md:grid-cols-4">
          {homepageStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="bg-midnight py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Featured awards" title="2026 award categories" href="/awards/2026" linkLabel="View All Awards" />
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {awards.map((award) => {
              const visual = homepageAwardVisuals[award.slug] ?? {
                icon: AwardIcon,
                accent: "gold" as const,
                description: award.description
              };
              return <AwardCard key={award.id} award={award} {...visual} />;
            })}
          </div>
        </div>
      </section>

      <section className="bg-midnight py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Trending creators"
            title="Creators moving the room"
            description="A PG-safe spotlight powered by CreatorStars, verified links, fan votes, award momentum, and profile quality."
            href="/creators"
            linkLabel="Explore All Creators"
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {trendingCreators.map((creator, index) => (
              <SpotlightCreatorCard key={creator.id} creator={creator} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-midnight py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="CreatorStars leaderboard"
            title="The premium scorecard"
            description="CreatorStars ranks creators across fan votes, profile completeness, verification, engagement, freshness, and award performance."
            href="/creatorstars"
            linkLabel="See Full Leaderboard"
          />
          <div className="mt-6 grid gap-4 lg:grid-cols-5">
            {leaderboardCreators.map((creator, index) => (
              <LeaderboardCard key={creator.id} creator={creator} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-midnight py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader eyebrow="Browse by category" title="Find the next fan favorite" href="/categories" linkLabel="Browse Categories" />
          <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
            {homepageCategories.map((category) => (
              <CategoryCard key={category.title} {...category} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-midnight px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <RewardsCTASection />
        </div>
      </section>
    </SiteShell>
  );
}

function AwardIcon(props: ComponentProps<typeof Trophy>) {
  return <Vote {...props} />;
}
