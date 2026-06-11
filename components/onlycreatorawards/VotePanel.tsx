import { Heart, ShieldAlert, Star, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

type VotePanelProps = {
  creatorSlug?: string;
  awardSlug?: string;
  context: "creator" | "award" | "ranking" | "rewards";
};

export function VotePanel({ creatorSlug, awardSlug, context }: VotePanelProps) {
  return (
    <Card>
      <CardContent className="space-y-5">
        <div>
          <h2 className="text-xl font-black text-ink">Fan voting</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Login is required. Votes are checked for duplicate accounts, suspicious velocity, and device/IP abuse before
            they influence rankings or rewards.
          </p>
        </div>
        <form action="/api/votes" method="post" className="grid gap-3">
          <input type="hidden" name="creatorSlug" value={creatorSlug ?? ""} />
          <input type="hidden" name="awardSlug" value={awardSlug ?? ""} />
          <input type="hidden" name="context" value={context} />
          <button
            type="submit"
            name="voteType"
            value="CREATOR_STAR"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-green px-4 font-extrabold text-white transition hover:bg-emerald-800"
          >
            <Star className="h-4 w-4" aria-hidden="true" />
            CreatorStar vote
          </button>
          <button
            type="submit"
            name="voteType"
            value="FAN_FAVORITE"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 font-extrabold text-ink transition hover:bg-slate-50"
          >
            <Heart className="h-4 w-4" aria-hidden="true" />
            Fan favorite
          </button>
          <button
            type="submit"
            name="voteType"
            value="AWARD_VOTE"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 font-extrabold text-ink transition hover:bg-slate-50"
          >
            <Trophy className="h-4 w-4" aria-hidden="true" />
            Award vote
          </button>
        </form>
        <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-muted">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-brand-amber" aria-hidden="true" />
          Public vote totals can be hidden until award close. Admins can void suspicious votes.
        </div>
      </CardContent>
    </Card>
  );
}
