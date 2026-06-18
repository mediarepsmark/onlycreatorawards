import Link from "next/link";
import { ArrowUpRight, BadgeCheck, MousePointerClick, Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { ImportedModel } from "@/lib/onlycreatorawards/modelDirectory";

function compactNumber(value: number) {
  return Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1
  }).format(value);
}

function primaryCategory(model: ImportedModel) {
  return model.categoryLabels[0] ?? "Creator";
}

export function ImportedModelCard({ model, rank }: { model: ImportedModel; rank?: number }) {
  const outboundUrl = model.onlyfansUrl || model.clickUrl;

  return (
    <Card className="group h-full overflow-hidden border-white/10 bg-[#080b12] text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-brand-amber/60">
      <CardContent className="p-0">
        <Link href={`/model/${model.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-brand-purple/30 via-black to-brand-cyan/20">
            {model.profileImageUrl ? (
              <img
                src={model.profileImageUrl}
                alt={model.imageAltText || `${model.displayName} profile`}
                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center">
                <Sparkles className="h-12 w-12 text-brand-amber" aria-hidden="true" />
              </div>
            )}
            <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black via-black/70 to-transparent" />
            {rank ? (
              <Badge className="absolute left-3 top-3 border-brand-amber/50 bg-black/70 text-brand-amber shadow-gold-glow">
                #{rank}
              </Badge>
            ) : null}
            <Badge className="absolute bottom-3 left-3 max-w-[calc(100%-1.5rem)] truncate border-brand-cyan/40 bg-black/70 text-brand-cyan">
              {primaryCategory(model)}
            </Badge>
          </div>
        </Link>
        <div className="space-y-4 p-5">
          <div>
            <Link href={`/model/${model.slug}`} className="text-xl font-black text-white transition hover:text-brand-amber">
              {model.displayName}
            </Link>
            {model.handle ? <p className="mt-1 text-sm font-bold text-white/55">{model.handle}</p> : null}
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs font-black text-white/70">
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2">
              <Users className="mb-1 h-4 w-4 text-brand-amber" aria-hidden="true" />
              {compactNumber(model.sourceFanCount)} fans
            </div>
            <div className="rounded-lg border border-white/10 bg-white/[0.04] p-2">
              <MousePointerClick className="mb-1 h-4 w-4 text-brand-cyan" aria-hidden="true" />
              {compactNumber(model.clickCount)} clicks
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {model.categoryLabels.slice(0, 3).map((label, index) => (
              <Badge key={`${model.slug}-${label}-${index}`} className="border-white/10 bg-white/[0.06] text-white/70">
                {label}
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Link
              href={`/model/${model.slug}`}
              className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-white/10 bg-white/[0.06] px-3 text-sm font-black text-white transition hover:border-brand-amber/60 hover:text-brand-amber"
            >
              Profile
            </Link>
            {outboundUrl ? (
              <a
                href={outboundUrl}
                className="inline-flex min-h-10 items-center justify-center gap-1 rounded-lg bg-brand-amber px-3 text-sm font-black text-ink transition hover:bg-white"
                rel="nofollow sponsored noopener noreferrer"
                target="_blank"
              >
                OnlyFans
                <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
              </a>
            ) : (
              <span className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 px-3 text-sm font-black text-white/40">
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
