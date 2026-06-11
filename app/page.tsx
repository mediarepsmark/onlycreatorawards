import Image from "next/image";
import Link from "next/link";
import { Award, BadgeCheck, MapPin, ShieldCheck, Sparkles, Star, Trophy, Vote } from "lucide-react";

import { CreatorCard } from "@/components/onlycreatorawards/CreatorCard";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { SearchPanel } from "@/components/onlycreatorawards/SearchPanel";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAwardYears, getAwards, getCategories, getCreators, getRankingPages, siteConfig } from "@/lib/onlycreatorawards/repository";
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
    .sort((first, second) => second.creatorStarsScore - first.creatorStarsScore)
    .slice(0, 3);
  const awards = getAwards(2026).slice(0, 5);
  const categories = getCategories().slice(0, 10);
  const geoPages = getRankingPages("GEO").slice(0, 7);
  const awardYear = getAwardYears()[0] ?? 2026;

  return (
    <SiteShell>
      <JsonLd data={[organizationSchema(), websiteSchema()]} />
      <section className="relative min-h-[74vh] overflow-hidden bg-ink text-white">
        <Image
          src={siteConfig.heroImage}
          alt="OnlyCreatorAwards trophy and creator ranking dashboard"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/70 to-ink/20" />
        <div className="relative mx-auto flex min-h-[74vh] max-w-7xl flex-col justify-center px-4 py-16 sm:px-6 lg:px-8">
          <Badge className="mb-6 w-fit bg-white/15 text-white ring-1 ring-white/25">
            <Sparkles className="mr-1 h-4 w-4" aria-hidden="true" />
            PG creator awards, rankings, and rewards
          </Badge>
          <h1 className="max-w-3xl text-5xl font-black tracking-normal sm:text-6xl lg:text-7xl">OnlyCreatorAwards</h1>
          <p className="mt-5 max-w-2xl text-xl font-bold leading-8 text-white/85">
            The Creator Awards & Discovery Engine for public creator profiles, annual awards, fan voting,
            CreatorStars rankings, and creator-safe discovery.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/awards/${awardYear}`}
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-brand-amber px-5 font-black text-ink transition hover:bg-amber-400"
            >
              <Vote className="h-5 w-5" aria-hidden="true" />
              Vote now
            </Link>
            <Link
              href="/claim-profile"
              className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-white px-5 font-black text-ink transition hover:bg-slate-100"
            >
              <BadgeCheck className="h-5 w-5" aria-hidden="true" />
              Claim your profile
            </Link>
          </div>
          <div className="mt-9 max-w-3xl">
            <SearchPanel compact />
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8f5] py-12">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <Card>
            <CardContent>
              <Trophy className="h-8 w-8 text-brand-amber" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black text-ink">Annual awards</h2>
              <p className="mt-3 leading-7 text-muted">
                Award hubs, nominees, voting status, finalists, winners, comments, and badge embeds are built as
                first-class platform objects.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <Star className="h-8 w-8 text-brand-blue" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black text-ink">CreatorStars</h2>
              <p className="mt-3 leading-7 text-muted">
                A visible 0 to 100 score powers badges, rankings, eligibility, trending pages, and monthly fan rewards.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <ShieldCheck className="h-8 w-8 text-brand-green" aria-hidden="true" />
              <h2 className="mt-4 text-2xl font-black text-ink">Creator-safe SEO</h2>
              <p className="mt-3 leading-7 text-muted">
                Strong pages can index. Weak profiles, search filters, account pages, and thin programmatic pages stay
                noindex until enriched.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge className="bg-amber-50 text-brand-amber">Featured awards</Badge>
              <h2 className="mt-3 text-3xl font-black text-ink">2026 award categories</h2>
            </div>
            <Link href="/awards/2026" className="font-black text-brand-blue hover:text-ink">
              View awards
            </Link>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            {awards.map((award) => (
              <Link key={award.id} href={`/awards/${award.year}/${award.slug}`}>
                <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-panel">
                  <CardContent>
                    <Award className="h-6 w-6 text-brand-amber" aria-hidden="true" />
                    <h3 className="mt-4 font-black text-ink">{award.title}</h3>
                    <p className="mt-2 text-sm font-bold text-muted">{award.status.replace(/_/g, " ")}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8f5] py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <Badge className="bg-emerald-50 text-brand-green">Trending creators</Badge>
              <h2 className="mt-3 text-3xl font-black text-ink">CreatorStars leaders</h2>
            </div>
            <Link href="/creators" className="font-black text-brand-blue hover:text-ink">
              Browse creators
            </Link>
          </div>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {creators.map((creator, index) => (
              <CreatorCard key={creator.id} creator={creator} rank={index + 1} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_1fr] lg:px-8">
          <div>
            <Badge className="bg-slate-100 text-ink">Top categories</Badge>
            <div className="mt-5 flex flex-wrap gap-3">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/category/${category.slug}`}
                  className="inline-flex min-h-11 items-center rounded-lg border border-line bg-white px-4 font-extrabold text-ink transition hover:bg-slate-50"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <Badge className="bg-slate-100 text-ink">
              <MapPin className="mr-1 h-4 w-4" aria-hidden="true" />
              Top locations
            </Badge>
            <div className="mt-5 flex flex-wrap gap-3">
              {geoPages.map((page) => (
                <Link
                  key={page.id}
                  href={`/${page.slug}`}
                  className="inline-flex min-h-11 items-center rounded-lg border border-line bg-white px-4 font-extrabold text-ink transition hover:bg-slate-50"
                >
                  {page.title.replace("Top OnlyFans Creators in ", "")}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
