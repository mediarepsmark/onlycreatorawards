import Link from "next/link";
import { notFound } from "next/navigation";
import { Award, BadgeCheck, CalendarDays, Flag, LinkIcon, ShieldCheck, Star } from "lucide-react";

import { CommentSection } from "@/components/onlycreatorawards/CommentSection";
import { CreatorAvatar } from "@/components/onlycreatorawards/CreatorAvatar";
import { CreatorCard } from "@/components/onlycreatorawards/CreatorCard";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { VotePanel } from "@/components/onlycreatorawards/VotePanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  absoluteUrl,
  getAwards,
  getCreatorBySlug,
  getCreatorComments,
  getCreators,
  getSimilarCreators
} from "@/lib/onlycreatorawards/repository";
import { formatScore, getCreatorStarsLevel, shouldIndexCreator } from "@/lib/onlycreatorawards/scoring";
import { breadcrumbSchema, buildMetadata } from "@/lib/onlycreatorawards/seo";
import { platformLabels } from "@/lib/onlycreatorawards/types";

type CreatorPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCreators().map((creator) => ({ slug: creator.slug }));
}

export async function generateMetadata({ params }: CreatorPageProps) {
  const { slug } = await params;
  const creator = getCreatorBySlug(slug);

  if (!creator) {
    return buildMetadata({
      title: "Creator Not Found | OnlyCreatorAwards",
      description: "This creator profile could not be found.",
      path: `/creator/${slug}`,
      index: false
    });
  }

  return buildMetadata({
    title: `${creator.displayName} Creator Profile | OnlyCreatorAwards`,
    description: `${creator.displayName} profile, CreatorStars score, awards, categories, voting, comments, safe links, and creator claim options.`,
    path: `/creator/${creator.slug}`,
    index: shouldIndexCreator(creator)
  });
}

function publicLocationText(slug: string) {
  const creator = getCreatorBySlug(slug);
  if (!creator) return "Location pending";
  const { location } = creator;
  if (location.visibility === "HIDDEN") return "Location private";
  if (location.visibility === "CITY" && location.city) return [location.city, location.region, location.country].filter(Boolean).join(", ");
  if (location.visibility === "REGION" && location.region) return [location.region, location.country].filter(Boolean).join(", ");
  return location.country ?? "Location pending";
}

export default async function CreatorProfilePage({ params }: CreatorPageProps) {
  const { slug } = await params;
  const creator = getCreatorBySlug(slug);
  if (!creator) notFound();

  const similarCreators = getSimilarCreators(creator.slug);
  const comments = getCreatorComments(creator.slug);
  const creatorAwards = getAwards().filter((award) =>
    award.nominees.some((nomination) => nomination.creatorSlug === creator.slug)
  );
  const links = Object.entries({ ...creator.platformLinks, ...creator.socialLinks }).filter((entry): entry is [keyof typeof platformLabels, string] =>
    Boolean(entry[1])
  );

  return (
    <SiteShell>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Creators", href: "/creators" },
            { name: creator.displayName, href: `/creator/${creator.slug}` }
          ]),
          {
            "@context": "https://schema.org",
            "@type": "ProfilePage",
            name: `${creator.displayName} Creator Profile`,
            url: absoluteUrl(`/creator/${creator.slug}`),
            about: {
              "@type": "Person",
              name: creator.displayName,
              alternateName: creator.handle
            }
          }
        ]}
      />
      <section className="border-b border-line bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
            <div className="flex flex-col gap-6 sm:flex-row">
              <CreatorAvatar creator={creator} size="lg" />
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  {creator.isVerified ? (
                    <Badge className="bg-emerald-50 text-brand-green">
                      <BadgeCheck className="mr-1 h-4 w-4" aria-hidden="true" />
                      Verified creator
                    </Badge>
                  ) : null}
                  <Badge className="bg-amber-50 text-brand-amber">{getCreatorStarsLevel(creator.creatorStarsScore)}</Badge>
                  {!shouldIndexCreator(creator) ? <Badge className="bg-slate-100 text-muted">Noindex until enriched</Badge> : null}
                </div>
                <h1 className="mt-4 text-4xl font-black tracking-normal text-ink sm:text-5xl">{creator.displayName}</h1>
                <p className="mt-2 text-lg font-bold text-muted">{creator.handle}</p>
                <p className="mt-5 max-w-3xl text-lg leading-8 text-muted">{creator.bio}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <Link
                    href="/claim-profile"
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-green px-4 font-extrabold text-white transition hover:bg-emerald-800"
                  >
                    <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                    Claim profile
                  </Link>
                  <Link
                    href="/removal-request"
                    className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-4 font-extrabold text-ink transition hover:bg-slate-50"
                  >
                    <Flag className="h-4 w-4" aria-hidden="true" />
                    Report or correct
                  </Link>
                </div>
              </div>
            </div>
            <Card>
              <CardContent>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-normal text-muted">CreatorStars</p>
                    <p className="mt-2 text-5xl font-black text-ink">{formatScore(creator.creatorStarsScore)}</p>
                  </div>
                  <Star className="h-12 w-12 fill-brand-amber text-brand-amber" aria-hidden="true" />
                </div>
                <dl className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <dt className="font-bold text-muted">Votes</dt>
                    <dd className="text-xl font-black text-ink">{creator.totalVotes.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-muted">Comments</dt>
                    <dd className="text-xl font-black text-ink">{creator.totalComments.toLocaleString()}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-muted">Quality</dt>
                    <dd className="text-xl font-black text-ink">{creator.indexQualityScore}</dd>
                  </div>
                  <div>
                    <dt className="font-bold text-muted">Location</dt>
                    <dd className="text-base font-black text-ink">{publicLocationText(creator.slug)}</dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="space-y-6">
            <Card>
              <CardContent>
                <h2 className="text-2xl font-black text-ink">Links and categories</h2>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {links.map(([platform, href]) => (
                    <a
                      key={`${platform}-${href}`}
                      href={href}
                      rel="nofollow noopener noreferrer"
                      target="_blank"
                      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line bg-white px-4 font-extrabold text-ink transition hover:bg-slate-50"
                    >
                      <LinkIcon className="h-4 w-4" aria-hidden="true" />
                      {platformLabels[platform]}
                    </a>
                  ))}
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {creator.categories.map((category) => (
                    <Link key={category} href={`/category/${category}`}>
                      <Badge className="bg-slate-100 text-ink">{category.replace(/-/g, " ")}</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-brand-amber" aria-hidden="true" />
                  <h2 className="text-2xl font-black text-ink">Awards</h2>
                </div>
                <div className="mt-5 grid gap-3">
                  {creatorAwards.length > 0 ? (
                    creatorAwards.map((award) => (
                      <Link
                        key={award.id}
                        href={`/awards/${award.year}/${award.slug}`}
                        className="rounded-lg border border-line bg-white p-4 transition hover:bg-slate-50"
                      >
                        <p className="font-black text-ink">{award.title}</p>
                        <p className="mt-1 text-sm font-bold text-muted">{award.status.replace(/_/g, " ")}</p>
                      </Link>
                    ))
                  ) : (
                    <p className="text-muted">No approved nominations yet.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="flex items-center gap-2">
                  <CalendarDays className="h-5 w-5 text-brand-blue" aria-hidden="true" />
                  <h2 className="text-2xl font-black text-ink">Profile freshness</h2>
                </div>
                <p className="mt-3 text-muted">Last updated {creator.updatedAt}. Last data refresh {creator.lastDataRefreshAt}.</p>
              </CardContent>
            </Card>

            <CommentSection targetType="creator" targetSlug={creator.slug} comments={comments} />
          </div>

          <aside className="space-y-6">
            <VotePanel creatorSlug={creator.slug} context="creator" />
            <Card>
              <CardContent>
                <h2 className="text-xl font-black text-ink">Shareable badge</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Badge embeds should link back to the creator profile or award page for attribution and discovery.
                </p>
                <textarea
                  readOnly
                  className="mt-4 h-28 w-full rounded-lg border border-line bg-slate-50 p-3 text-xs text-ink"
                  value={`<a href="${absoluteUrl(`/creator/${creator.slug}`)}">${creator.displayName} - ${getCreatorStarsLevel(
                    creator.creatorStarsScore
                  )}</a>`}
                />
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>

      <section className="bg-white py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-black text-ink">Similar creators</h2>
          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            {similarCreators.map((similarCreator) => (
              <CreatorCard key={similarCreator.id} creator={similarCreator} />
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
