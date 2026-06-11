import Link from "next/link";
import { FolderKanban } from "lucide-react";

import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCategories, getCreatorsForCategory } from "@/lib/onlycreatorawards/repository";
import { buildMetadata } from "@/lib/onlycreatorawards/seo";

export const metadata = buildMetadata({
  title: "Creator Categories | OnlyCreatorAwards",
  description:
    "Browse curated creator categories, niches, attributes, platforms, and social crossover directories with SEO quality controls.",
  path: "/categories"
});

export default function CategoriesPage() {
  const categories = getCategories();

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Category directories"
        title="Browse creator categories"
        description="Category pages act as curated SEO hubs and browsing surfaces. Sensitive or demographic tags should come from creator submissions, claims, or obvious public branding."
      />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {categories.map((category) => (
            <Link key={category.id} href={`/category/${category.slug}`}>
              <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-panel">
                <CardContent>
                  <div className="flex items-start justify-between gap-4">
                    <FolderKanban className="h-8 w-8 text-brand-blue" aria-hidden="true" />
                    <Badge className={category.isSensitive ? "bg-amber-50 text-brand-amber" : "bg-emerald-50 text-brand-green"}>
                      {category.type}
                    </Badge>
                  </div>
                  <h2 className="mt-5 text-2xl font-black text-ink">{category.name}</h2>
                  <p className="mt-3 leading-7 text-muted">{category.description}</p>
                  <p className="mt-4 text-sm font-black text-muted">
                    {getCreatorsForCategory(category.slug).length} launch profiles
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
