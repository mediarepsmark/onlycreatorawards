import Link from "next/link";
import { ArrowDown, ArrowRight, ArrowUp, Star } from "lucide-react";

import { CreatorAvatar } from "@/components/onlycreatorawards/CreatorAvatar";
import { Badge } from "@/components/ui/badge";
import { getCreatorStarsLevel } from "@/lib/onlycreatorawards/scoring";
import type { CreatorProfile, RankingEntry } from "@/lib/onlycreatorawards/types";

type RankingRow = {
  entry: RankingEntry;
  creator: CreatorProfile;
};

function Movement({ movement }: { movement: number }) {
  if (movement > 0) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-black text-brand-green">
        <ArrowUp className="h-4 w-4" aria-hidden="true" />
        {movement}
      </span>
    );
  }

  if (movement < 0) {
    return (
      <span className="inline-flex items-center gap-1 text-sm font-black text-brand-rose">
        <ArrowDown className="h-4 w-4" aria-hidden="true" />
        {Math.abs(movement)}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 text-sm font-black text-muted">
      <ArrowRight className="h-4 w-4" aria-hidden="true" />
      Hold
    </span>
  );
}

export function RankingTable({ rows }: { rows: RankingRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-line bg-white">
      <div className="grid grid-cols-[64px_1fr_120px_120px] gap-3 border-b border-line bg-slate-50 px-4 py-3 text-xs font-black uppercase tracking-normal text-muted max-md:hidden">
        <span>Rank</span>
        <span>Creator</span>
        <span>Score</span>
        <span>Movement</span>
      </div>
      <div className="divide-y divide-line">
        {rows.map(({ entry, creator }) => (
          <div
            key={`${entry.rank}-${creator.slug}`}
            className="grid gap-4 px-4 py-4 md:grid-cols-[64px_1fr_120px_120px] md:items-center"
          >
            <div className="text-2xl font-black text-ink">#{entry.rank}</div>
            <Link href={`/creator/${creator.slug}`} className="flex items-center gap-4">
              <CreatorAvatar creator={creator} size="sm" />
              <div>
                <div className="font-black text-ink">{creator.displayName}</div>
                <div className="text-sm font-bold text-muted">{creator.handle}</div>
              </div>
            </Link>
            <div>
              <div className="flex items-center gap-1 text-lg font-black text-ink">
                <Star className="h-4 w-4 fill-brand-amber text-brand-amber" aria-hidden="true" />
                {entry.score}
              </div>
              <Badge className="mt-1 min-h-7 bg-amber-50 text-brand-amber">{getCreatorStarsLevel(entry.score)}</Badge>
            </div>
            <Movement movement={entry.movement} />
          </div>
        ))}
      </div>
    </div>
  );
}
