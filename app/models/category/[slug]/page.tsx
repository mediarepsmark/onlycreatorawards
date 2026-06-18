import Link from "next/link";
import { notFound } from "next/navigation";
import { Pin, TrendingUp } from "lucide-react";

import { ImportedModelCard } from "@/components/onlycreatorawards/ImportedModelCard";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { ModelSectionPhotoCard } from "@/components/onlycreatorawards/HomeVisuals";
import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getFeaturedModelForSection,
  getModelDirectorySectionBySlug,
  getModelDirectorySections,
  getModelsForSection
} from "@/lib/onlycreatorawards/modelDirectory";
import { buildMetadata, itemListSchema } from "@/lib/onlycreatorawards/seo";

type ModelCategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getModelDirectorySections()
    .slice(0, 100)
    .map((section) => ({ slug: section.slug }));
}

export async function generateMetadata({ params }: ModelCategoryPageProps) {
  const { slug } = await params;
  const section = getModelDirectorySectionBySlug(slug);
  const models = getModelsForSection(slug);

  return buildMetadata({
    title: `${section.label} Models | OnlyCreatorAwards`,
    description: `Browse ${section.label.toLowerCase()} models ranked by manual top-three overrides, clicks, views, popularity, and source feed signals.`,
    path: `/models/category/${slug}`,
    index: models.length >= 5
  });
}

export default async function ModelCategoryPage({ params, searchParams }: ModelCategoryPageProps) {
  const { slug } = await params;
  const { page: pageParam = "1" } = await searchParams;
  const pageSize = 96;
  const section = getModelDirectorySectionBySlug(slug);
  const models = getModelsForSection(slug);
  const page = Math.max(1, Number.parseInt(pageParam, 10) || 1);
  const totalPages = Math.max(1, Math.ceil(models.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageModels = models.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const topModel = getFeaturedModelForSection(slug);

  if (!section || (!models.length && slug !== "uncategorized")) notFound();

  return (
    <SiteShell>
      <JsonLd
        data={itemListSchema(
          `${section.label} Models`,
          models.slice(0, 100).map((model) => ({ name: model.displayName, href: `/model/${model.slug}` }))
        )}
      />
      <PageHeader
        eyebrow="Model section"
        title={`${section.label} models`}
        description="Sections can pin up to three models manually. The remaining results fill by popularity signals, clicks, views, source stats, and feed order."
      >
        {topModel ? (
          <ModelSectionPhotoCard section={section} model={topModel} href={`/model/${topModel.slug}`} />
        ) : (
          <Card className="border-white/10 bg-white/[0.06] text-white">
            <CardContent>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-8 w-8 text-brand-cyan" aria-hidden="true" />
                <div>
                  <p className="text-2xl font-black">{models.length.toLocaleString()}</p>
                  <p className="text-sm font-bold text-white/60">models in this section</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </PageHeader>

      <section className="bg-[#05070d] py-10 text-white">
        <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="border-brand-amber/40 bg-brand-amber/10 text-brand-amber">
                <Pin className="mr-1 h-4 w-4" aria-hidden="true" />
                Top 3 can be manually pinned
              </Badge>
              <Badge className="border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan">
                Popularity fill
              </Badge>
            </div>
            <Link href="/models" className="text-sm font-black text-brand-amber hover:text-white">
              Back to all models
            </Link>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {pageModels.map((model, index) => (
              <ImportedModelCard key={model.id} model={model} rank={(currentPage - 1) * pageSize + index + 1} />
            ))}
          </div>
          {models.length > pageSize ? (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-white/[0.045] p-4">
              <p className="text-sm font-black text-white/65">
                Page {currentPage.toLocaleString()} of {totalPages.toLocaleString()} · {models.length.toLocaleString()} total models
              </p>
              <div className="flex gap-2">
                {currentPage > 1 ? (
                  <Link
                    href={`/models/category/${slug}?page=${currentPage - 1}`}
                    className="inline-flex min-h-10 items-center rounded-lg border border-white/10 px-4 text-sm font-black text-white transition hover:border-brand-amber/60 hover:text-brand-amber"
                  >
                    Previous
                  </Link>
                ) : null}
                {currentPage < totalPages ? (
                  <Link
                    href={`/models/category/${slug}?page=${currentPage + 1}`}
                    className="inline-flex min-h-10 items-center rounded-lg bg-brand-amber px-4 text-sm font-black text-ink transition hover:bg-white"
                  >
                    Next
                  </Link>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </SiteShell>
  );
}
