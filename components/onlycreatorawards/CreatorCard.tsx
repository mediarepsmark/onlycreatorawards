import Link from "next/link";
import { ArrowUpRight, BadgeCheck, MapPin, Star } from "lucide-react";

import { CreatorAvatar } from "@/components/onlycreatorawards/CreatorAvatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCreatorStarsLevel } from "@/lib/onlycreatorawards/scoring";
import type { CreatorProfile } from "@/lib/onlycreatorawards/types";

function labelFromSlug(slug: string) {
  return slug
    .replace(/-onlyfans/g, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function publicLocation(creator: CreatorProfile) {
  const { location } = creator;
  if (location.visibility === "HIDDEN") return "Location private";
  if (location.visibility === "CITY" && location.city) return [location.city, location.region, location.country].filter(Boolean).join(", ");
  if (location.visibility === "REGION" && location.region) return [location.region, location.country].filter(Boolean).join(", ");
  return location.country ?? "Location pending";
}

export function CreatorCard({ creator, rank }: { creator: CreatorProfile; rank?: number }) {
  const badge = getCreatorStarsLevel(creator.creatorStarsScore);

  return (
    <Card className="h-full">
      <CardContent className="flex h-full flex-col gap-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <CreatorAvatar creator={creator} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {rank ? <Badge className="bg-amber-50 text-brand-amber">#{rank}</Badge> : null}
                {creator.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-blue">
                    <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                    Verified
                  </span>
                ) : null}
              </div>
              <Link href={`/creator/${creator.slug}`} className="mt-2 block text-xl font-black text-ink hover:text-brand-green">
                {creator.displayName}
              </Link>
              <p className="text-sm font-bold text-muted">{creator.handle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-2xl font-black text-ink">
              <Star className="h-5 w-5 fill-brand-amber text-brand-amber" aria-hidden="true" />
              {creator.creatorStarsScore}
            </div>
            <p className="text-xs font-extrabold uppercase tracking-normal text-muted">{badge}</p>
          </div>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-muted">{creator.bio}</p>
        <div className="flex flex-wrap gap-2">
          {creator.categories.slice(0, 3).map((category) => (
            <Badge key={category} className="min-h-7 bg-slate-100 text-ink">
              {labelFromSlug(category)}
            </Badge>
          ))}
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-muted">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {publicLocation(creator)}
          </span>
          <Link
            href={`/creator/${creator.slug}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-ink px-3 text-sm font-extrabold text-white transition hover:bg-brand-green"
          >
            Profile
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
