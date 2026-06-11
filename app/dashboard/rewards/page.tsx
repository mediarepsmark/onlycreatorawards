import Link from "next/link";
import { Gift, ShieldCheck } from "lucide-react";

import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { RewardLeaderboard } from "@/components/onlycreatorawards/RewardLeaderboard";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentRewardCampaign, getFanRewardScores } from "@/lib/onlycreatorawards/repository";
import { buildMetadata } from "@/lib/onlycreatorawards/seo";

export const metadata = buildMetadata({
  title: "My Fan Rewards | OnlyCreatorAwards",
  description: "View monthly reward score, leaderboard rank, eligibility, age verification requirements, and prize status.",
  path: "/dashboard/rewards",
  index: false
});

export default function DashboardRewardsPage() {
  const campaign = getCurrentRewardCampaign();
  const scores = getFanRewardScores();
  const currentUserScore = scores[0];

  return (
    <SiteShell>
      <PageHeader
        eyebrow="User rewards dashboard"
        title="My Fan Rewards"
        description="Registered users can view their monthly rank, eligible actions, age-verification requirements, selected creator status, and reward fulfillment state."
      />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[360px_1fr] lg:px-8">
          <Card>
            <CardContent>
              <Badge className="bg-emerald-50 text-brand-green">Demo user</Badge>
              <h2 className="mt-4 text-2xl font-black text-ink">{currentUserScore.displayName}</h2>
              <dl className="mt-5 grid grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-bold text-muted">Rank</dt>
                  <dd className="text-3xl font-black text-ink">#{currentUserScore.rank}</dd>
                </div>
                <div>
                  <dt className="text-sm font-bold text-muted">Score</dt>
                  <dd className="text-3xl font-black text-ink">{currentUserScore.totalScore}</dd>
                </div>
              </dl>
              <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm leading-6 text-muted">
                Age verification is required only if selected as a winner before prize fulfillment.
              </div>
              <Link
                href="/age-verification"
                className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg border border-line px-4 font-extrabold text-ink transition hover:bg-slate-50"
              >
                <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                Age verification
              </Link>
            </CardContent>
          </Card>
          <div className="space-y-6">
            <RewardLeaderboard campaign={campaign} scores={scores} />
            <Card>
              <CardContent>
                <Gift className="h-8 w-8 text-brand-amber" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-black text-ink">Earn more points</h2>
                <div className="mt-4 grid gap-3 text-sm leading-6 text-muted md:grid-cols-4">
                  <p>Vote in open awards.</p>
                  <p>Nominate eligible creators.</p>
                  <p>Write useful comments that pass moderation.</p>
                  <p>Share creator profiles without spam behavior.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
