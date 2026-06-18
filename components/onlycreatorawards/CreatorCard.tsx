import Link from "next/link";
import { ArrowUpRight, BadgeCheck, MapPin, Sparkles, Star, Vote } from "lucide-react";

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
  const primaryCategory = creator.categories[0] ? labelFromSlug(creator.categories[0]).replace(" Creators", "") : "Creator";

  return (
    <Card className="group h-full overflow-hidden border-white/[0.12] bg-white/[0.045] text-white shadow-none transition hover:-translate-y-1 hover:border-brand-amber/[0.55] hover:shadow-gold-glow">
      <CardContent className="relative flex h-full flex-col gap-5 p-4">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-brand-purple/[0.18] to-transparent opacity-0 transition group-hover:opacity-100" />
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <CreatorAvatar creator={creator} />
            <div>
              <div className="flex flex-wrap items-center gap-2">
                {rank ? <Badge className="min-h-7 border-brand-amber/50 bg-brand-amber/[0.14] text-brand-amber">#{rank}</Badge> : null}
                <Badge className="min-h-7 border-brand-purple/[0.45] bg-brand-purple/[0.12] text-[#e9d5ff]">{primaryCategory}</Badge>
                {creator.isVerified ? (
                  <span className="inline-flex items-center gap-1 text-sm font-bold text-brand-cyan">
                    <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                    Verified
                  </span>
                ) : null}
              </div>
              <Link href={`/creator/${creator.slug}`} className="mt-2 block text-xl font-black text-white transition hover:text-brand-amber">
                {creator.displayName}
              </Link>
              <p className="text-sm font-bold text-white/[0.55]">{creator.handle}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center justify-end gap-1 text-2xl font-black text-white">
              <Star className="h-5 w-5 fill-brand-amber text-brand-amber" aria-hidden="true" />
              {creator.creatorStarsScore}
            </div>
            <p className="text-xs font-extrabold uppercase tracking-normal text-white/[0.48]">{badge}</p>
          </div>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-white/[0.62]">{creator.bio}</p>
        <div className="flex flex-wrap gap-2">
          {creator.categories.slice(0, 3).map((category) => (
            <Badge key={category} className="min-h-7 border-white/10 bg-white/[0.04] text-white/70">
              {labelFromSlug(category)}
            </Badge>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-3 rounded-lg border border-white/10 bg-black/[0.24] p-3 text-sm">
          <span className="inline-flex items-center gap-2 font-bold text-white/[0.68]">
            <Vote className="h-4 w-4 text-brand-rose" aria-hidden="true" />
            {creator.totalVotes.toLocaleString()} votes
          </span>
          <span className="inline-flex items-center gap-2 font-bold text-white/[0.68]">
            <Sparkles className="h-4 w-4 text-brand-cyan" aria-hidden="true" />
            {badge.replace(" Creator", "")}
          </span>
        </div>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
          <span className="inline-flex items-center gap-2 text-sm font-bold text-white/[0.55]">
            <MapPin className="h-4 w-4" aria-hidden="true" />
            {publicLocation(creator)}
          </span>
          <Link
            href={`/creator/${creator.slug}`}
            className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-brand-amber/[0.55] bg-brand-amber/10 px-3 text-sm font-extrabold text-brand-amber transition hover:bg-brand-amber hover:text-ink"
          >
            Profile
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
