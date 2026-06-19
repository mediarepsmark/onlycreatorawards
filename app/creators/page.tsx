import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { CreatorCard } from "@/components/onlycreatorawards/CreatorCard";
import { ImportedModelCard } from "@/components/onlycreatorawards/ImportedModelCard";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { SearchPanel } from "@/components/onlycreatorawards/SearchPanel";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { getImportedModels, type ImportedModel } from "@/lib/onlycreatorawards/modelDirectory";
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

function searchableModelText(model: ImportedModel) {
  return [
    model.slug,
    model.displayName,
    model.sourceName,
    model.username,
    model.handle,
    model.rawCategory,
    model.rawDetails,
    model.country,
    model.region,
    model.city,
    ...model.sourceKeywords,
    ...model.categorySlugs,
    ...model.categoryLabels
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function modelSearchRank(model: ImportedModel, query: string) {
  const exactTerms = [model.slug, model.username, model.handle?.replace(/^@/, ""), model.displayName, model.sourceName]
    .filter(Boolean)
    .map((term) => String(term).toLowerCase());

  if (exactTerms.includes(query)) return 0;
  if (exactTerms.some((term) => term.startsWith(query))) return 1;
  return 2;
}

function getModelMatches(query: string, limit = 24) {
  if (!query) return [];

  const matches = getImportedModels()
    .filter((model) => searchableModelText(model).includes(query))
    .sort(
      (first, second) =>
        modelSearchRank(first, query) - modelSearchRank(second, query) ||
        second.clickCount - first.clickCount ||
        second.popularityScore - first.popularityScore ||
        first.sourceOrder - second.sourceOrder
    );
  const seenSlugs = new Set<string>();
  const uniqueMatches: ImportedModel[] = [];

  for (const model of matches) {
    if (seenSlugs.has(model.slug)) continue;
    seenSlugs.add(model.slug);
    uniqueMatches.push(model);
    if (uniqueMatches.length >= limit) break;
  }

  return uniqueMatches;
}

export default async function CreatorsPage({ searchParams }: CreatorsPageProps) {
  const { query = "" } = await searchParams;
  const trimmedQuery = query.trim();
  const normalizedQuery = trimmedQuery.toLowerCase();
  const modelMatches = getModelMatches(normalizedQuery);
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
          normalizedQuery ? `Creator search results for ${trimmedQuery}` : "Creator Directory",
          [
            ...modelMatches.map((model) => ({
              name: model.displayName,
              href: `/model/${model.slug}`
            })),
            ...creators.map((creator) => ({
              name: creator.displayName,
              href: `/creator/${creator.slug}`
            }))
          ]
        )}
      />
      <PageHeader
        eyebrow="Creator directory"
        title={normalizedQuery ? `Search results for "${trimmedQuery}"` : "Search public creator profiles"}
        description="Browse creator and model profiles with categories, verified links, awards, votes, comments, profile claims, and CreatorStars scores."
      >
        <SearchPanel compact defaultQuery={trimmedQuery} />
      </PageHeader>
      <section className="bg-[#05070d] py-10 text-white">
        <div className="mx-auto max-w-7xl space-y-10 px-4 sm:px-6 lg:px-8">
          {normalizedQuery ? (
            <>
              <div>
                <div className="mb-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-cyan">Imported model matches</p>
                    <h2 className="mt-2 text-2xl font-black">{modelMatches.length.toLocaleString()} models found</h2>
                  </div>
                </div>
                {modelMatches.length ? (
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {modelMatches.map((model, index) => (
                      <ImportedModelCard key={model.id} model={model} rank={index + 1} />
                    ))}
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6 text-sm font-bold text-white/70">
                    No imported model profiles matched this search.
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-amber">Creator profile matches</p>
                <h2 className="mt-2 text-2xl font-black">{creators.length.toLocaleString()} creators found</h2>
              </div>
            </>
          ) : null}

          {creators.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {creators.map((creator, index) => (
                <CreatorCard key={creator.id} creator={creator} rank={index + 1} />
              ))}
            </div>
          ) : normalizedQuery && !modelMatches.length ? (
            <div className="rounded-lg border border-white/10 bg-white/[0.045] p-6">
              <h2 className="text-2xl font-black">No results found</h2>
              <p className="mt-2 text-sm font-bold text-white/65">Try searching by creator name, handle, category, or model keyword.</p>
            </div>
          ) : null}
        </div>
      </section>
    </SiteShell>
  );
}
