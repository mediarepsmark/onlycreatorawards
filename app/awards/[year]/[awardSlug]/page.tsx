import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, CalendarDays, Code, Trophy } from "lucide-react";

import { CommentSection } from "@/components/onlycreatorawards/CommentSection";
import { CreatorAvatar } from "@/components/onlycreatorawards/CreatorAvatar";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { VotePanel } from "@/components/onlycreatorawards/VotePanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { absoluteUrl, getAward, getAwards, getCreatorBySlug } from "@/lib/onlycreatorawards/repository";
import { breadcrumbSchema, buildMetadata, itemListSchema } from "@/lib/onlycreatorawards/seo";

type AwardPageProps = {
  params: Promise<{ year: string; awardSlug: string }>;
};

export function generateStaticParams() {
  return getAwards().map((award) => ({ year: String(award.year), awardSlug: award.slug }));
}

export async function generateMetadata({ params }: AwardPageProps) {
  const { year, awardSlug } = await params;
  const award = getAward(Number(year), awardSlug);

  if (!award) {
    return buildMetadata({
      title: "Award Not Found | OnlyCreatorAwards",
      description: "This award page could not be found.",
      path: `/awards/${year}/${awardSlug}`,
      index: false
    });
  }

  return buildMetadata({
    title: `${award.year} ${award.title} | OnlyCreatorAwards`,
    description: `${award.description} View nominees, voting status, methodology, comments, and badge embed code.`,
    path: `/awards/${award.year}/${award.slug}`,
    index: true
  });
}

export default async function AwardDetailPage({ params }: AwardPageProps) {
  const { year, awardSlug } = await params;
  const award = getAward(Number(year), awardSlug);
  if (!award) notFound();

  const nominees = award.nominees
    .map((nomination) => ({
      nomination,
      creator: getCreatorBySlug(nomination.creatorSlug)
    }))
    .filter((row): row is { nomination: (typeof award.nominees)[number]; creator: NonNullable<ReturnType<typeof getCreatorBySlug>> } =>
      Boolean(row.creator)
    );

  return (
    <SiteShell>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Awards", href: "/awards" },
            { name: `${award.year} Awards`, href: `/awards/${award.year}` },
            { name: award.title, href: `/awards/${award.year}/${award.slug}` }
          ]),
          itemListSchema(
            award.title,
            nominees.map(({ creator }) => ({ name: creator.displayName, href: `/creator/${creator.slug}` }))
          )
        ]}
      />
      <PageHeader eyebrow={`${award.year} awards`} title={award.title} description={award.description}>
        <Card>
          <CardContent>
            <Badge className="bg-amber-50 text-brand-amber">{award.status.replace(/_/g, " ")}</Badge>
            <div className="mt-4 space-y-2 text-sm font-bold text-muted">
              {award.votingStartsAt ? (
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  Voting starts {award.votingStartsAt}
                </p>
              ) : null}
              {award.votingEndsAt ? (
                <p className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" aria-hidden="true" />
                  Voting ends {award.votingEndsAt}
                </p>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </PageHeader>

      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="space-y-6">
            <Card>
              <CardContent>
                <h2 className="text-2xl font-black text-ink">Eligibility and methodology</h2>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-muted sm:grid-cols-2">
                  <p>Profiles must be public, safe, creator-safe, and free of explicit hosted content.</p>
                  <p>Votes require login and can be voided for suspicious account, IP, or device velocity.</p>
                  <p>CreatorStars can influence eligibility but should not replace editorial review.</p>
                  <p>Winner status should be published only after admin review and award close.</p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <h2 className="text-2xl font-black text-ink">Nominees</h2>
              {nominees.map(({ nomination, creator }) => (
                <Card key={`${award.id}-${creator.slug}`}>
                  <CardContent className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                    <Link href={`/creator/${creator.slug}`} className="flex items-center gap-4">
                      <CreatorAvatar creator={creator} />
                      <div>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-slate-100 text-ink">{nomination.status}</Badge>
                          {creator.isVerified ? (
                            <Badge className="bg-emerald-50 text-brand-green">
                              <BadgeCheck className="mr-1 h-4 w-4" aria-hidden="true" />
                              Verified
                            </Badge>
                          ) : null}
                        </div>
                        <h3 className="mt-2 text-xl font-black text-ink">{creator.displayName}</h3>
                        <p className="text-sm font-bold text-muted">{nomination.nominationReason}</p>
                      </div>
                    </Link>
                    <div className="text-left sm:text-right">
                      <p className="text-2xl font-black text-ink">{nomination.voteCount.toLocaleString()}</p>
                      <p className="text-sm font-bold text-muted">approved votes</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <CommentSection targetType="award" targetSlug={award.slug} comments={[]} />
          </div>

          <aside className="space-y-6">
            <VotePanel awardSlug={award.slug} context="award" />
            <Card>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-brand-blue" aria-hidden="true" />
                  <h2 className="text-xl font-black text-ink">Nominee badge embed</h2>
                </div>
                <textarea
                  readOnly
                  className="mt-4 h-28 w-full rounded-lg border border-line bg-slate-50 p-3 text-xs text-ink"
                  value={`<a href="${absoluteUrl(`/awards/${award.year}/${award.slug}`)}">${award.year} ${award.title} Nominee</a>`}
                />
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Trophy className="h-8 w-8 text-brand-amber" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-black text-ink">Public totals</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Public vote counts can stay hidden until voting closes. Admin controls decide visibility by award.
                </p>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
