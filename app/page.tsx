import Image from "next/image";
import Link from "next/link";
import type { ComponentProps } from "react";
import { ArrowUpRight, Crown, Sparkles, Trophy, Vote } from "lucide-react";

import {
  AwardCard,
  FeaturedModelPhotoCard,
  LeaderboardCard,
  ModelHeroStack,
  ModelLeaderboardCard,
  ModelSectionPhotoCard,
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
import {
  getFeaturedModelForSection,
  getHomepageModelPlacements,
  getModelDirectorySections,
  getModelDirectoryStats,
} from "@/lib/onlycreatorawards/modelDirectory";
import { getAwardYears, getAwards, getCreators, siteConfig } from "@/lib/onlycreatorawards/repository";
import { buildMetadata, organizationSchema, websiteSchema } from "@/lib/onlycreatorawards/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "OnlyCreatorAwards | Creator Awards and Discovery Engine",
  description:
    "Vote, discover creator rankings, browse awards, explore CreatorStars scores, and claim public creator profiles on a PG creator-safe platform.",
  path: "/"
});

export default function HomePage() {
  const modelStats = getModelDirectoryStats();
  const homepageModels = getHomepageModelPlacements();
  const featuredModels = homepageModels.featured;
  const heroModels = homepageModels.hero;
  const modelLeaderboard = homepageModels.leaderboard;
  const modelSections = getModelDirectorySections()
    .filter((section) => section.count >= 5)
    .slice(0, 8)
    .map((section) => ({
      section,
      model: getFeaturedModelForSection(section.slug)
    }));
  const creators = getCreators()
    .filter((creator) => creator.status === "PUBLISHED")
    .sort((first, second) => second.creatorStarsScore - first.creatorStarsScore);
  const trendingCreators = creators.slice(0, 6);
  const leaderboardCreators = creators.slice(0, 5);
  const awards = getAwards(2026).slice(0, 5);
  const awardYear = getAwardYears()[0] ?? 2026;
  const dynamicStats = homepageStats.map((stat) => {
    if (stat.label === "Creators" && modelStats.parsedCount) {
      return { ...stat, value: `${Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(modelStats.parsedCount)}+` };
    }

    if (stat.label === "Categories" && modelStats.sectionCount) {
      return { ...stat, value: String(modelStats.sectionCount) };
    }

    return stat;
  });

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
        <div className="relative mx-auto grid min-h-[720px] max-w-7xl gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.92fr] lg:items-center lg:px-8 lg:py-14">
          <div className="order-2 lg:order-1">
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
                href="/models"
                className="inline-flex min-h-12 items-center gap-2 rounded-lg border border-brand-amber/50 bg-black/[0.26] px-5 font-black text-white transition hover:bg-brand-amber/10 hover:text-brand-amber"
              >
                <ArrowUpRight className="h-5 w-5" aria-hidden="true" />
                Explore Models
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
          <div className="order-1 pb-4 pt-2 lg:order-2 lg:pb-10 lg:pt-0">
            {heroModels.length ? <ModelHeroStack models={heroModels} /> : null}
          </div>
        </div>
      </section>

      <section className="relative bg-midnight px-4 sm:px-6 lg:px-8">
        <div className="mx-auto -mt-12 grid max-w-7xl overflow-hidden rounded-lg border border-brand-amber/[0.42] bg-black/[0.54] shadow-gold-glow backdrop-blur md:grid-cols-4">
          {dynamicStats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>
      </section>

      <section className="bg-midnight py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Live model profiles"
            title="Featured from the feed"
            description="Imported profiles now sit front and center, with images, categories, popularity signals, and direct profile pages."
            href="/models"
            linkLabel="Explore All Models"
          />
          {featuredModels.length ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {featuredModels.slice(0, 8).map((model, index) => (
                <FeaturedModelPhotoCard key={model.id} model={model} rank={index + 1} />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {trendingCreators.map((creator, index) => (
                <SpotlightCreatorCard key={creator.id} creator={creator} rank={index + 1} />
              ))}
            </div>
          )}
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
            eyebrow="Trending models"
            title="Profiles getting attention"
            description="A live spotlight powered by the imported feed, source popularity, clicks, views, and category relevance."
            href="/models"
            linkLabel="Explore All Models"
          />
          {featuredModels.length ? (
            <div className="mt-6 grid gap-4 lg:grid-cols-5">
              {modelLeaderboard.map((model, index) => (
                <ModelLeaderboardCard key={model.id} model={model} rank={index + 1} />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {trendingCreators.map((creator, index) => (
                <SpotlightCreatorCard key={creator.id} creator={creator} rank={index + 1} />
              ))}
            </div>
          )}
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
          <SectionHeader
            eyebrow="Browse by section"
            title="Popular sections"
            description="Click a large model photo to enter each section, with the label and count kept in a clean panel below."
            href="/models"
            linkLabel="Browse Model Sections"
          />
          {modelSections.length ? (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {modelSections.map(({ section, model }) => (
                <ModelSectionPhotoCard key={section.slug} section={section} model={model} />
              ))}
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-8">
              {homepageCategories.map((category) => (
                <Link key={category.title} href={category.href} className="rounded-lg border border-white/10 bg-white/[0.04] p-4 text-sm font-black text-white">
                  {category.title}
                </Link>
              ))}
            </div>
          )}
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
