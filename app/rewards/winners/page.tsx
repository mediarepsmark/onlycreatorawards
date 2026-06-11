import { Trophy } from "lucide-react";

import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentRewardCampaign, getFanRewardScores } from "@/lib/onlycreatorawards/repository";
import { buildMetadata } from "@/lib/onlycreatorawards/seo";

export const metadata = buildMetadata({
  title: "Fan Rewards Winners | OnlyCreatorAwards",
  description: "Published monthly Fan Rewards winners after eligibility review, age verification, and fulfillment checks.",
  path: "/rewards/winners"
});

export default function RewardWinnersPage() {
  const campaign = getCurrentRewardCampaign();
  const tentativeWinners = getFanRewardScores()
    .filter((score) => score.isEligible)
    .slice(0, campaign.numberOfWinners);

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Winner publication"
        title="Fan Rewards winners"
        description="Winners can be published after admin eligibility review, age verification where required, selected creator approval, and fulfillment checks."
      />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent>
              <Badge className="bg-slate-100 text-ink">{campaign.status}</Badge>
              <h2 className="mt-4 text-2xl font-black text-ink">{campaign.title}</h2>
              <div className="mt-6 divide-y divide-line rounded-lg border border-line bg-white">
                {tentativeWinners.map((winner) => (
                  <div key={winner.userId} className="flex flex-wrap items-center justify-between gap-4 p-4">
                    <div className="flex items-center gap-3">
                      <Trophy className="h-6 w-6 text-brand-amber" aria-hidden="true" />
                      <div>
                        <p className="font-black text-ink">Rank #{winner.rank}</p>
                        <p className="text-sm font-bold text-muted">Winner identity can be hidden publicly if required.</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-50 text-brand-green">Pending fulfillment</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
