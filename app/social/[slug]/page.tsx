import { notFound } from "next/navigation";

import { CreatorCard } from "@/components/onlycreatorawards/CreatorCard";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { RankingTable } from "@/components/onlycreatorawards/RankingTable";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { VotePanel } from "@/components/onlycreatorawards/VotePanel";
import { Card, CardContent } from "@/components/ui/card";
import { getRankingCreators, getRankingPageBySlug, getRankingPages } from "@/lib/onlycreatorawards/repository";
import { buildMetadata, faqSchema, itemListSchema } from "@/lib/onlycreatorawards/seo";

type SocialPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getRankingPages("SOCIAL").map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: SocialPageProps) {
  const { slug } = await params;
  const page = getRankingPageBySlug(slug);

  return buildMetadata({
    title: page ? `${page.title} | OnlyCreatorAwards` : "Social Creator Directory | OnlyCreatorAwards",
    description: page?.description ?? "Social crossover creator directory.",
    path: `/social/${slug}`,
    index: Boolean(page?.isIndexable)
  });
}

export default async function SocialPage({ params }: SocialPageProps) {
  const { slug } = await params;
  const page = getRankingPageBySlug(slug);
  if (!page || page.pageType !== "SOCIAL") notFound();

  const rows = getRankingCreators(page);

  return (
    <SiteShell>
      <JsonLd
        data={[
          itemListSchema(
            page.title,
            rows.map(({ creator }) => ({ name: creator.displayName, href: `/creator/${creator.slug}` }))
          ),
          faqSchema(page.faqs)
        ]}
      />
      <PageHeader eyebrow="Social crossover" title={page.title} description={page.description}>
        <Card>
          <CardContent>
            <p className="text-sm leading-6 text-muted">
              Social crossover pages are curated and should not infer private, sensitive, or unverified claims.
            </p>
          </CardContent>
        </Card>
      </PageHeader>
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="space-y-6">
            <RankingTable rows={rows} />
            <div className="grid gap-5 lg:grid-cols-2">
              {rows.slice(0, 4).map(({ creator, entry }) => (
                <CreatorCard key={creator.id} creator={creator} rank={entry.rank} />
              ))}
            </div>
          </div>
          <VotePanel context="ranking" />
        </div>
      </section>
    </SiteShell>
  );
}
