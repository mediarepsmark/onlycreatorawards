import Link from "next/link";
import { Trophy } from "lucide-react";

import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAwardYears, getAwards } from "@/lib/onlycreatorawards/repository";
import { buildMetadata } from "@/lib/onlycreatorawards/seo";

export const metadata = buildMetadata({
  title: "Creator Awards | OnlyCreatorAwards",
  description:
    "Annual creator award hubs with categories, nominees, eligibility, voting status, finalists, winners, comments, and shareable badges.",
  path: "/awards"
});

export default function AwardsPage() {
  const years = getAwardYears();
  const awards = getAwards();

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Annual awards"
        title="Creator awards hub"
        description="Awards are the moat: annual hubs, category pages, nominations, verified voting, finalists, winners, public rules, and badge embeds."
      />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[300px_1fr] lg:px-8">
          <div className="space-y-3">
            {years.map((year) => (
              <Link
                key={year}
                href={`/awards/${year}`}
                className="flex min-h-12 items-center justify-between rounded-lg border border-line bg-white px-4 font-black text-ink transition hover:bg-slate-50"
              >
                {year} Awards
                <Trophy className="h-4 w-4 text-brand-amber" aria-hidden="true" />
              </Link>
            ))}
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {awards.map((award) => (
              <Link key={award.id} href={`/awards/${award.year}/${award.slug}`}>
                <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-panel">
                  <CardContent>
                    <Badge className="bg-amber-50 text-brand-amber">{award.status.replace(/_/g, " ")}</Badge>
                    <h2 className="mt-4 text-2xl font-black text-ink">{award.title}</h2>
                    <p className="mt-3 leading-7 text-muted">{award.description}</p>
                    <p className="mt-4 text-sm font-black text-muted">{award.nominees.length} nominees</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
