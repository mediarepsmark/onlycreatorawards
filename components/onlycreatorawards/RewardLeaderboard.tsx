import { ShieldCheck, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { FanRewardScore, RewardCampaign } from "@/lib/onlycreatorawards/types";

export function RewardLeaderboard({
  campaign,
  scores
}: {
  campaign: RewardCampaign;
  scores: FanRewardScore[];
}) {
  return (
    <Card>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="bg-amber-50 text-brand-amber">{campaign.status}</Badge>
            <h2 className="mt-3 text-2xl font-black text-ink">{campaign.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{campaign.noPurchaseNecessaryText}</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4 text-right">
            <p className="text-sm font-bold text-muted">Prize cap</p>
            <p className="text-2xl font-black text-ink">${campaign.prizeValueCap}</p>
          </div>
        </div>
        <div className="overflow-hidden rounded-lg border border-line">
          <div className="grid grid-cols-[70px_1fr_120px_120px] gap-3 bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-normal text-muted max-md:hidden">
            <span>Rank</span>
            <span>Fan</span>
            <span>Score</span>
            <span>Eligible</span>
          </div>
          <div className="divide-y divide-line">
            {scores.map((score) => (
              <div
                key={score.userId}
                className="grid gap-3 px-4 py-4 md:grid-cols-[70px_1fr_120px_120px] md:items-center"
              >
                <div className="flex items-center gap-2 text-xl font-black text-ink">
                  <Trophy className="h-4 w-4 text-brand-amber" aria-hidden="true" />#{score.rank}
                </div>
                <div>
                  <p className="font-black text-ink">{score.displayName}</p>
                  <p className="text-sm text-muted">
                    Votes {score.votePoints} | Comments {score.commentPoints} | Shares {score.sharePoints}
                  </p>
                </div>
                <div className="text-xl font-black text-ink">{score.totalScore}</div>
                <div>
                  {score.isEligible ? (
                    <Badge className="bg-emerald-50 text-brand-green">
                      <ShieldCheck className="mr-1 h-4 w-4" aria-hidden="true" />
                      Eligible
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-50 text-brand-rose">Review</Badge>
                  )}
                  {score.ineligibilityReason ? (
                    <p className="mt-2 text-xs font-bold text-muted">{score.ineligibilityReason}</p>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
