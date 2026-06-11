import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, Trophy } from "lucide-react";

import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAwardYears, getAwards } from "@/lib/onlycreatorawards/repository";
import { breadcrumbSchema, buildMetadata, itemListSchema } from "@/lib/onlycreatorawards/seo";

type AwardsYearPageProps = {
  params: Promise<{ year: string }>;
};

export function generateStaticParams() {
  return getAwardYears().map((year) => ({ year: String(year) }));
}

export async function generateMetadata({ params }: AwardsYearPageProps) {
  const { year } = await params;
  const numericYear = Number(year);
  const awards = getAwards(numericYear);

  return buildMetadata({
    title: `${year} Creator Awards | OnlyCreatorAwards`,
    description: `Browse ${year} creator award categories, nominees, voting windows, eligibility rules, comments, and badge embeds.`,
    path: `/awards/${year}`,
    index: awards.length > 0
  });
}

export default async function AwardsYearPage({ params }: AwardsYearPageProps) {
  const { year } = await params;
  const numericYear = Number(year);
  const awards = getAwards(numericYear);
  if (!Number.isInteger(numericYear) || awards.length === 0) notFound();

  return (
    <SiteShell>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: "Awards", href: "/awards" },
            { name: `${year} Awards`, href: `/awards/${year}` }
          ]),
          itemListSchema(
            `${year} Creator Awards`,
            awards.map((award) => ({ name: award.title, href: `/awards/${award.year}/${award.slug}` }))
          )
        ]}
      />
      <PageHeader
        eyebrow={`${year} awards`}
        title={`${year} Creator Awards`}
        description="Vote in open awards, browse nominees, review eligibility criteria, and share award badges for approved nominees, finalists, and winners."
      />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {awards.map((award) => (
            <Link key={award.id} href={`/awards/${award.year}/${award.slug}`}>
              <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-panel">
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <Trophy className="h-8 w-8 text-brand-amber" aria-hidden="true" />
                    <Badge className="bg-slate-100 text-ink">{award.status.replace(/_/g, " ")}</Badge>
                  </div>
                  <h2 className="mt-5 text-2xl font-black text-ink">{award.title}</h2>
                  <p className="mt-3 leading-7 text-muted">{award.description}</p>
                  {award.votingEndsAt ? (
                    <p className="mt-4 flex items-center gap-2 text-sm font-black text-muted">
                      <Calendar className="h-4 w-4" aria-hidden="true" />
                      Voting ends {award.votingEndsAt}
                    </p>
                  ) : null}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
