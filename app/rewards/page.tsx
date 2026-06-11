import Link from "next/link";
import { Gift, ShieldCheck, Trophy } from "lucide-react";

import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { RewardLeaderboard } from "@/components/onlycreatorawards/RewardLeaderboard";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentRewardCampaign, getFanRewardScores } from "@/lib/onlycreatorawards/repository";
import { buildMetadata } from "@/lib/onlycreatorawards/seo";

export const metadata = buildMetadata({
  title: "CreatorStars Fan Rewards | OnlyCreatorAwards",
  description:
    "Monthly fan voter rewards with no purchase necessary, 18+ eligibility, age verification before fulfillment, and admin-controlled anti-abuse review.",
  path: "/rewards"
});

export default function RewardsPage() {
  const campaign = getCurrentRewardCampaign();
  const scores = getFanRewardScores();

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Fan rewards"
        title="CreatorStars Fan Rewards"
        description="Eligible verified voters can earn monthly points by voting, nominating creators, commenting, sharing creator profiles, and participating in awards."
      />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="space-y-6">
            <RewardLeaderboard campaign={campaign} scores={scores} />
            <div className="grid gap-5 md:grid-cols-3">
              {[
                ["Vote", "Award votes are the largest rewards signal, with daily caps and abuse review."],
                ["Nominate", "Creator nominations can earn points after moderation and eligibility checks."],
                ["Comment", "Only approved useful comments count toward monthly rewards."]
              ].map(([title, body]) => (
                <Card key={title}>
                  <CardContent>
                    <Gift className="h-7 w-7 text-brand-amber" aria-hidden="true" />
                    <h2 className="mt-4 text-xl font-black text-ink">{title}</h2>
                    <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <aside className="space-y-5">
            <Card>
              <CardContent>
                <Badge className="bg-amber-50 text-brand-amber">No purchase necessary</Badge>
                <h2 className="mt-4 text-xl font-black text-ink">Eligibility</h2>
                <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                  {campaign.eligibilityRules.map((rule) => (
                    <li key={rule} className="flex gap-2">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-green" aria-hidden="true" />
                      {rule}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <Trophy className="h-8 w-8 text-brand-amber" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-black text-ink">Monthly pass</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Winners can receive up to ${campaign.prizeValueCap} in creator subscription credit toward a
                  participating verified creator of their choice.
                </p>
                <div className="mt-4 grid gap-3">
                  <Link href="/rewards/monthly" className="font-black text-brand-blue hover:text-ink">
                    View monthly leaderboard
                  </Link>
                  <Link href="/rewards/rules" className="font-black text-brand-blue hover:text-ink">
                    Official rules
                  </Link>
                  <Link href="/dashboard/rewards" className="font-black text-brand-blue hover:text-ink">
                    My rewards
                  </Link>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </SiteShell>
  );
}
