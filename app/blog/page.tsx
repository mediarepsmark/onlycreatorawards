import Link from "next/link";
import { CalendarDays, FileText } from "lucide-react";

import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getBlogPosts } from "@/lib/onlycreatorawards/blog";
import { buildMetadata } from "@/lib/onlycreatorawards/seo";

export const metadata = buildMetadata({
  title: "Creator Awards Blog | OnlyCreatorAwards",
  description:
    "Original OnlyCreatorAwards editorial guides for category rankings, creator watchlists, voting, rewards, and SEO-friendly creator discovery.",
  path: "/blog",
  index: true
});

export default function BlogPage() {
  const posts = getBlogPosts();

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Editorial hub"
        title="Creator awards blog"
        description="Awards-style guides, category watchlists, and search-friendly creator discovery content with direct links into live sections and profiles."
      />
      <section className="bg-[#05070d] py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="h-full border-white/10 bg-white/[0.045] text-white transition hover:-translate-y-1 hover:border-brand-amber/60">
                <CardContent>
                  <FileText className="h-8 w-8 text-brand-amber" aria-hidden="true" />
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Badge className="border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan">
                      <CalendarDays className="mr-1 h-4 w-4" aria-hidden="true" />
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </Badge>
                  </div>
                  <h2 className="mt-4 text-2xl font-black">{post.title}</h2>
                  <p className="mt-3 leading-7 text-white/62">{post.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
