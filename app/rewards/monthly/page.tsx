import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { RewardLeaderboard } from "@/components/onlycreatorawards/RewardLeaderboard";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentRewardCampaign, getFanRewardScores } from "@/lib/onlycreatorawards/repository";
import { buildMetadata } from "@/lib/onlycreatorawards/seo";

export const metadata = buildMetadata({
  title: "Monthly CreatorStars Rewards | OnlyCreatorAwards",
  description:
    "Current monthly fan rewards leaderboard, scoring formula, point caps, eligibility rules, and anti-abuse review state.",
  path: "/rewards/monthly"
});

export default function MonthlyRewardsPage() {
  const campaign = getCurrentRewardCampaign();
  const scores = getFanRewardScores();

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Monthly rewards"
        title={campaign.title}
        description={campaign.noPurchaseNecessaryText}
      />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          <RewardLeaderboard campaign={campaign} scores={scores} />
          <Card>
            <CardContent>
              <h2 className="text-2xl font-black text-ink">Default scoring formula</h2>
              <div className="mt-4 grid gap-3 text-sm leading-6 text-muted md:grid-cols-5">
                <p>40% valid award votes</p>
                <p>20% nominations submitted</p>
                <p>15% approved useful comments</p>
                <p>15% creator profile shares</p>
                <p>10% account trust score</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
