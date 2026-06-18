import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CalendarDays, Link2 } from "lucide-react";

import { ImportedModelCard } from "@/components/onlycreatorawards/ImportedModelCard";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getBlogPostBySlug, getBlogPosts } from "@/lib/onlycreatorawards/blog";
import { getModelDirectorySectionBySlug, getModelsForSection } from "@/lib/onlycreatorawards/modelDirectory";
import { breadcrumbSchema, buildMetadata } from "@/lib/onlycreatorawards/seo";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);

  return buildMetadata({
    title: post ? `${post.title} | OnlyCreatorAwards` : "Blog Post | OnlyCreatorAwards",
    description: post?.description ?? "OnlyCreatorAwards editorial guide.",
    path: `/blog/${slug}`,
    index: Boolean(post)
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const linkedSections = post.categorySlugs.map((sectionSlug) => getModelDirectorySectionBySlug(sectionSlug));
  const spotlightModels = post.categorySlugs.flatMap((sectionSlug) => getModelsForSection(sectionSlug, 2)).slice(0, 4);

  return (
    <SiteShell>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", href: "/" },
          { name: "Blog", href: "/blog" },
          { name: post.title, href: `/blog/${post.slug}` }
        ])}
      />
      <PageHeader eyebrow="Editorial guide" title={post.title} description={post.description}>
        <Card className="border-white/10 bg-white/[0.06] text-white">
          <CardContent>
            <CalendarDays className="h-7 w-7 text-brand-amber" aria-hidden="true" />
            <p className="mt-3 text-sm font-black uppercase tracking-[0.16em] text-white/45">Published</p>
            <p className="mt-1 text-xl font-black">{new Date(post.publishedAt).toLocaleDateString()}</p>
          </CardContent>
        </Card>
      </PageHeader>
      <section className="bg-[#05070d] py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <article className="rounded-xl border border-white/10 bg-white/[0.045] p-6 md:p-8">
            <div className="space-y-6 text-lg leading-8 text-white/70">
              {post.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <Link
              href={post.ctaHref}
              className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-lg bg-brand-amber px-5 font-black text-ink transition hover:bg-white"
            >
              {post.ctaLabel}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </article>

          <aside className="space-y-5">
            <Card className="border-white/10 bg-white/[0.045] text-white">
              <CardContent>
                <Link2 className="h-7 w-7 text-brand-cyan" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-black">Live section links</h2>
                <div className="mt-4 grid gap-2">
                  {linkedSections.map((section) => (
                    <Link
                      key={section.slug}
                      href={section.slug === "all" ? "/models" : `/models/category/${section.slug}`}
                      className="rounded-lg border border-white/10 bg-white/[0.05] px-3 py-2 text-sm font-black text-white/70 transition hover:border-brand-cyan/60 hover:text-brand-cyan"
                    >
                      {section.label}
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="border-white/10 bg-white/[0.045] text-white">
              <CardContent>
                <h2 className="text-xl font-black">Content criteria</h2>
                <p className="mt-3 text-sm leading-6 text-white/62">
                  Each post should link to a live category, cite ranking criteria, and include profile links when the cache has relevant models.
                </p>
                <Link href="/seo-ai-criteria" className="mt-4 inline-flex text-sm font-black text-brand-amber hover:text-white">
                  SEO and AI criteria
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>

        {spotlightModels.length ? (
          <div className="mx-auto mt-10 max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
              <div>
                <Badge className="border-brand-amber/40 bg-brand-amber/10 text-brand-amber">Profile links</Badge>
                <h2 className="mt-3 text-3xl font-black">Creators to reference</h2>
              </div>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {spotlightModels.map((model, index) => (
                <ImportedModelCard key={`${post.slug}-${model.slug}`} model={model} rank={index + 1} />
              ))}
            </div>
          </div>
        ) : null}
      </section>
    </SiteShell>
  );
}
