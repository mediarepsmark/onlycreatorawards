import { notFound } from "next/navigation";

import { CreatorCard } from "@/components/onlycreatorawards/CreatorCard";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCategories, getCategoryBySlug, getCreatorsForCategory } from "@/lib/onlycreatorawards/repository";
import { buildMetadata, itemListSchema } from "@/lib/onlycreatorawards/seo";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getCategories().map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    return buildMetadata({
      title: "Category Not Found | OnlyCreatorAwards",
      description: "This category could not be found.",
      path: `/category/${slug}`,
      index: false
    });
  }

  const creators = getCreatorsForCategory(slug);

  return buildMetadata({
    title: `${category.name} | OnlyCreatorAwards`,
    description: category.description,
    path: `/category/${category.slug}`,
    index: category.isIndexable && creators.length >= 1
  });
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) notFound();

  const creators = getCreatorsForCategory(category.slug).sort(
    (first, second) => second.creatorStarsScore - first.creatorStarsScore
  );

  return (
    <SiteShell>
      <JsonLd
        data={itemListSchema(
          category.name,
          creators.map((creator) => ({ name: creator.displayName, href: `/creator/${creator.slug}` }))
        )}
      />
      <PageHeader eyebrow={category.type} title={category.name} description={category.description}>
        <Card>
          <CardContent>
            <Badge className={category.isSensitive ? "bg-amber-50 text-brand-amber" : "bg-emerald-50 text-brand-green"}>
              {category.isSensitive ? "Creator-submitted tags required" : "Indexable category"}
            </Badge>
            <p className="mt-3 text-sm leading-6 text-muted">
              Thin categories should remain noindex until enough approved creator profiles exist.
            </p>
          </CardContent>
        </Card>
      </PageHeader>
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {creators.map((creator, index) => (
            <CreatorCard key={creator.id} creator={creator} rank={index + 1} />
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
