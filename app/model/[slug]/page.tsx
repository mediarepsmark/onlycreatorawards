import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, BadgeCheck, CalendarClock, MapPin, MousePointerClick, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { ImportedModelCard } from "@/components/onlycreatorawards/ImportedModelCard";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getImportedModelBySlug,
  getImportedModels,
  getModelsForSection
} from "@/lib/onlycreatorawards/modelDirectory";
import { breadcrumbSchema, buildMetadata } from "@/lib/onlycreatorawards/seo";

type ModelPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return getImportedModels()
    .slice(0, 100)
    .map((model) => ({ slug: model.slug }));
}

export async function generateMetadata({ params }: ModelPageProps) {
  const { slug } = await params;
  const model = getImportedModelBySlug(slug);

  return buildMetadata({
    title: model ? `${model.displayName} OnlyFans Profile | OnlyCreatorAwards` : "Model Profile | OnlyCreatorAwards",
    description: model
      ? `${model.displayName} model profile, source keywords, popularity signals, category rankings, and OnlyFans link.`
      : "Imported model profile.",
    path: `/model/${slug}`,
    index: Boolean(model)
  });
}

function locationFor(model: NonNullable<ReturnType<typeof getImportedModelBySlug>>) {
  return [model.city, model.region, model.country].filter(Boolean).join(", ");
}

export default async function ModelProfilePage({ params }: ModelPageProps) {
  const { slug } = await params;
  const model = getImportedModelBySlug(slug);
  if (!model) notFound();

  const outboundUrl = model.onlyfansUrl || model.clickUrl;
  const relatedSection = model.categorySlugs[0] ?? "all";
  const related = getModelsForSection(relatedSection, 5).filter((item) => item.slug !== model.slug).slice(0, 4);
  const location = locationFor(model);
  const statCards: Array<{ Icon: LucideIcon; label: string; value: string }> = [
    { Icon: Users, label: "Fans", value: model.sourceFanCount.toLocaleString() },
    { Icon: MousePointerClick, label: "Clicks", value: model.clickCount.toLocaleString() },
    { Icon: BadgeCheck, label: "Popularity", value: model.popularityScore.toLocaleString() }
  ];

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Models", href: "/models" },
          { name: model.displayName, href: `/model/${model.slug}` }
        ])}
      />
      <PageHeader
        eyebrow="Model profile"
        title={model.displayName}
        description="Imported model profile with source-feed ordering, popularity signals, category links, and outbound OnlyFans destination."
      />

      <section className="bg-[#05070d] py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[420px_1fr] lg:px-8">
          <Card className="overflow-hidden border-white/10 bg-white/[0.045] text-white">
            <CardContent className="p-0">
              <div className="relative aspect-[4/5] bg-gradient-to-br from-brand-purple/30 via-black to-brand-cyan/20">
                {model.profileImageUrl ? (
                  <img
                    src={model.profileImageUrl}
                    alt={model.imageAltText || `${model.displayName} profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Sparkles className="h-16 w-16 text-brand-amber" aria-hidden="true" />
                  </div>
                )}
                <Badge className="absolute left-4 top-4 border-brand-amber/50 bg-black/70 text-brand-amber">
                  Source #{model.sourceOrder}
                </Badge>
              </div>
              <div className="space-y-4 p-5">
                {model.handle ? <p className="text-lg font-black text-white/70">{model.handle}</p> : null}
                {outboundUrl ? (
                  <a
                    href={outboundUrl}
                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand-amber px-4 font-black text-ink transition hover:bg-white"
                    rel="nofollow sponsored noopener noreferrer"
                    target="_blank"
                  >
                    Visit OnlyFans
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </a>
                ) : null}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-white/10 bg-white/[0.045] text-white">
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-3">
                  {statCards.map(({ Icon, label, value }) => (
                    <div key={label} className="rounded-lg border border-white/10 bg-black/25 p-4">
                      <Icon className="h-6 w-6 text-brand-cyan" aria-hidden="true" />
                      <p className="mt-3 text-sm font-black uppercase tracking-[0.16em] text-white/45">{label}</p>
                      <p className="mt-1 text-2xl font-black">{value}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/[0.045] text-white">
              <CardContent>
                <h2 className="text-2xl font-black">Directory details</h2>
                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  {model.price ? <Detail label="Price" value={model.price} /> : null}
                  {location ? <Detail label="Location" value={location} Icon={MapPin} /> : null}
                  <Detail label="Feed sort" value={String(model.sourceSort)} />
                  <Detail label="Last imported" value={new Date(model.lastImportedAt).toLocaleString()} Icon={CalendarClock} />
                </div>
                <div className="mt-6">
                  <h3 className="text-sm font-black uppercase tracking-[0.18em] text-brand-amber">Source keywords</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {model.sourceKeywords.length ? (
                      model.sourceKeywords.map((keyword, index) => (
                        <Link
                          key={`${model.slug}-${keyword}-${index}`}
                          href={`/models/category/${model.categorySlugs[index] ?? "uncategorized"}`}
                          className="rounded-lg border border-white/10 bg-white/[0.06] px-3 py-2 text-sm font-black text-white/70 transition hover:border-brand-cyan/60 hover:text-brand-cyan"
                        >
                          {keyword}
                        </Link>
                      ))
                    ) : (
                      <Badge className="border-white/10 bg-white/[0.06] text-white/55">Uncategorized</Badge>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {related.length ? (
              <div>
                <div className="mb-4 flex items-center justify-between gap-4">
                  <h2 className="text-2xl font-black">Related models</h2>
                  <Link href={`/models/category/${relatedSection}`} className="text-sm font-black text-brand-amber hover:text-white">
                    View section
                  </Link>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {related.map((relatedModel, index) => (
                    <ImportedModelCard key={relatedModel.id} model={relatedModel} rank={index + 1} />
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}

function Detail({
  label,
  value,
  Icon
}: {
  label: string;
  value: string;
  Icon?: LucideIcon;
}) {
  return (
    <div className="rounded-lg border border-white/10 bg-black/25 p-4">
      {Icon ? <Icon className="mb-2 h-5 w-5 text-brand-amber" aria-hidden="true" /> : null}
      <p className="text-xs font-black uppercase tracking-[0.16em] text-white/45">{label}</p>
      <p className="mt-1 font-black text-white">{value}</p>
    </div>
  );
}
