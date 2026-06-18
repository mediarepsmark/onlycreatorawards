import { Bot, Megaphone, SearchCheck, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Card, CardContent } from "@/components/ui/card";
import { buildMetadata } from "@/lib/onlycreatorawards/seo";

export const metadata = buildMetadata({
  title: "SEO and AI Search Criteria | OnlyCreatorAwards",
  description:
    "OnlyCreatorAwards criteria for search visibility, AI answer quality, category pages, model profiles, blog content, and marketing workflows.",
  path: "/seo-ai-criteria",
  index: true
});

const criteria = [
  {
    title: "Search criteria",
    Icon: SearchCheck,
    points: [
      "One clear search intent per page.",
      "Canonical URL, descriptive title, and useful meta description.",
      "Index only pages with enough model/profile depth.",
      "Link category blogs to live model sections and individual profiles."
    ]
  },
  {
    title: "AI answer criteria",
    Icon: Bot,
    points: [
      "State ranking criteria in plain language.",
      "Expose dates, source refresh cadence, and manual override rules.",
      "Use structured lists, FAQs, and consistent entity names.",
      "Avoid unsupported claims about income, private identity, or subscriber totals."
    ]
  },
  {
    title: "Marketing criteria",
    Icon: Megaphone,
    points: [
      "Frame posts around awards, watchlists, and fan momentum.",
      "Use internal links to voting, rewards, profiles, and categories.",
      "Update high-impression pages after each import and award cycle.",
      "Build newsletters and social posts from the same category hubs."
    ]
  },
  {
    title: "Trust criteria",
    Icon: ShieldCheck,
    points: [
      "Preserve the imported source order for the main directory.",
      "Disclose that category top-three placements can be manually pinned.",
      "Keep correction, removal, and claim pathways visible.",
      "Use nofollow/sponsored attributes on outbound commercial links."
    ]
  }
];

export default function SeoAiCriteriaPage() {
  return (
    <SiteShell>
      <PageHeader
        eyebrow="Growth criteria"
        title="SEO and AI search criteria"
        description="The operating basis for ranking pages, model profiles, blogs, and marketing content that can earn visibility without becoming thin or confusing."
      />
      <section className="bg-[#05070d] py-10 text-white">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {criteria.map(({ title, Icon, points }) => (
            <Card key={title} className="border-white/10 bg-white/[0.045] text-white">
              <CardContent>
                <Icon className="h-8 w-8 text-brand-amber" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-black">{title}</h2>
                <ul className="mt-5 space-y-3 text-sm leading-6 text-white/65">
                  {points.map((point) => (
                    <li key={point} className="rounded-lg border border-white/10 bg-black/25 p-3">
                      {point}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}
