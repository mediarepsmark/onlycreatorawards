import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { CreatorCard } from "@/components/onlycreatorawards/CreatorCard";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { SearchPanel } from "@/components/onlycreatorawards/SearchPanel";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { getCreators } from "@/lib/onlycreatorawards/repository";
import { buildMetadata, itemListSchema } from "@/lib/onlycreatorawards/seo";

export const metadata = buildMetadata({
  title: "Creator Directory | OnlyCreatorAwards",
  description:
    "Search safe public creator profiles by name, handle, category, platform, location, awards, and CreatorStars level.",
  path: "/creators",
  index: true
});

type CreatorsPageProps = {
  searchParams: Promise<{ query?: string }>;
};

export default async function CreatorsPage({ searchParams }: CreatorsPageProps) {
  const { query = "" } = await searchParams;
  const normalizedQuery = query.trim().toLowerCase();
  const creators = getCreators()
    .filter((creator) => creator.status !== "REMOVED")
    .filter((creator) => {
      if (!normalizedQuery) return true;
      return [
        creator.displayName,
        creator.handle,
        creator.primaryPlatform,
        creator.location.country,
        creator.location.region,
        ...creator.categories,
        ...creator.attributes
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(normalizedQuery);
    })
    .sort((first, second) => second.creatorStarsScore - first.creatorStarsScore);

  return (
    <SiteShell>
      <JsonLd
        data={itemListSchema(
          "Creator Directory",
          creators.map((creator) => ({
            name: creator.displayName,
            href: `/creator/${creator.slug}`
          }))
        )}
      />
      <PageHeader
        eyebrow="Creator directory"
        title="Search public creator profiles"
        description="Browse safe, PG creator profiles with categories, verified links, awards, votes, comments, profile claims, and CreatorStars scores."
      >
        <SearchPanel compact />
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
