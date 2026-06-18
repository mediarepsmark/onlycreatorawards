import Link from "next/link";
import { DatabaseZap, RefreshCcw, Search, Trophy } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ImportedModelCard } from "@/components/onlycreatorawards/ImportedModelCard";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { ModelSectionPhotoCard } from "@/components/onlycreatorawards/HomeVisuals";
import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getFeaturedModelForSection,
  getImportedModels,
  getModelDirectorySections,
  getModelDirectoryStats
} from "@/lib/onlycreatorawards/modelDirectory";
import { buildMetadata, itemListSchema } from "@/lib/onlycreatorawards/seo";

export const dynamic = "force-dynamic";

export const metadata = buildMetadata({
  title: "OnlyFans Model Directory | OnlyCreatorAwards",
  description:
    "Browse the imported model directory in source-feed order, with creator profiles, category links, popularity signals, and OnlyFans outbound links.",
  path: "/models",
  index: true
});

const featureCards: Array<{ title: string; body: string; Icon: LucideIcon }> = [
  {
    title: "Source order",
    body: "The full directory follows the order received from the JSON feed.",
    Icon: Trophy
  },
  {
    title: "Popularity fill",
    body: "Category pages use views, clicks, source stats, and feed ranking after manual pins.",
    Icon: Search
  },
  {
    title: "Daily refresh",
    body: "Cron updates the cache once per day so sections stay current.",
    Icon: RefreshCcw
  }
];

type ModelsPageProps = {
  searchParams: Promise<{ page?: string }>;
};

function formatDate(value: string) {
  if (!value) return "Pending first import";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
}

export default async function ModelsPage({ searchParams }: ModelsPageProps) {
  const { page: pageParam = "1" } = await searchParams;
  const pageSize = 96;
  const models = getImportedModels();
  const page = Math.max(1, Number.parseInt(pageParam, 10) || 1);
  const totalPages = Math.max(1, Math.ceil(models.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageModels = models.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const stats = getModelDirectoryStats();
  const sections = getModelDirectorySections()
    .filter((section) => section.count >= 5)
    .slice(0, 12)
    .map((section) => ({
      section,
      model: getFeaturedModelForSection(section.slug)
    }));

  return (
    <SiteShell>
      <JsonLd
        data={itemListSchema(
          "OnlyFans Model Directory",
          models.slice(0, 100).map((model) => ({ name: model.displayName, href: `/model/${model.slug}` }))
        )}
      />
      <PageHeader
        eyebrow="Imported model directory"
        title="OnlyFans model discovery feed"
        description="The model directory preserves the source feed order, then powers category pages with manual top-three overrides and popularity-based fill."
      >
        <Card className="border-white/10 bg-white/[0.06] text-white">
          <CardContent className="space-y-3">
            <div className="flex items-center gap-3">
              <DatabaseZap className="h-8 w-8 text-brand-cyan" aria-hidden="true" />
              <div>
                <p className="text-2xl font-black">{stats.parsedCount.toLocaleString()} models</p>
                <p className="text-sm font-bold text-white/60">Last import: {formatDate(stats.importedAt)}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-black">
              <Badge className="border-brand-amber/40 bg-brand-amber/10 text-brand-amber">
                Source order
              </Badge>
              <Badge className="border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan">
                Daily sync
              </Badge>
              <Badge className="border-brand-rose/40 bg-brand-rose/10 text-brand-rose">
                {stats.sectionCount} sections
              </Badge>
            </div>
          </CardContent>
        </Card>
      </PageHeader>

      <section className="bg-[#05070d] py-10 text-white">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-4 md:grid-cols-3">
            {featureCards.map(({ title, body, Icon }) => (
              <Card key={title} className="border-white/10 bg-white/[0.045] text-white">
                <CardContent>
                  <Icon className="h-7 w-7 text-brand-amber" aria-hidden="true" />
                  <h2 className="mt-4 text-xl font-black">{title}</h2>
                  <p className="mt-2 text-sm leading-6 text-white/62">{body}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {sections.length ? (
            <div>
              <div className="mb-4 flex items-center justify-between gap-4">
                <h2 className="text-2xl font-black">Popular sections</h2>
                <Link href="/blog" className="text-sm font-black text-brand-amber hover:text-white">
                  Blog playbooks
                </Link>
              </div>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {sections.map(({ section, model }) => (
                  <ModelSectionPhotoCard key={section.slug} section={section} model={model} />
                ))}
              </div>
            </div>
          ) : null}

          <div>
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-brand-amber">Source feed order</p>
                <h2 className="mt-2 text-3xl font-black">Imported models</h2>
              </div>
              <p className="max-w-xl text-sm leading-6 text-white/55">
                Category and blog pages can reorder by manual top-three pins and popularity. This directory keeps the imported feed sequence intact.
              </p>
            </div>
            {models.length ? (
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {pageModels.map((model, index) => (
                  <ImportedModelCard key={model.id} model={model} rank={(currentPage - 1) * pageSize + index + 1} />
                ))}
              </div>
            ) : (
              <Card className="border-white/10 bg-white/[0.045] text-white">
                <CardContent>
                  <h2 className="text-2xl font-black">No import cache yet</h2>
                  <p className="mt-3 leading-7 text-white/60">
                    Run the daily import script once to populate the directory cache.
                  </p>
                </CardContent>
              </Card>
            )}
            {models.length > pageSize ? (
              <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.045] p-4">
                <p className="text-sm font-black text-white/65">
                  Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()} · {models.length.toLocaleString()} total models
                </p>
                <div className="flex gap-2">
                  {currentPage > 1 ? (
                    <Link
                      href={`/models?page=${currentPage - 1}`}
                      className="inline-flex min-h-10 items-center rounded-lg border border-white/10 px-4 text-sm font-black text-white transition hover:border-brand-amber/60 hover:text-brand-amber"
                    >
                      Previous
                    </Link>
                  ) : null}
                  {currentPage < totalPages ? (
                    <Link
                      href={`/models?page=${currentPage + 1}`}
                      className="inline-flex min-h-10 items-center rounded-lg bg-brand-amber px-4 text-sm font-black text-ink transition hover:bg-white"
                    >
                      Next
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
