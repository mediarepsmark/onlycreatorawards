import Link from "next/link";
import { ArrowUpRight, BadgeCheck, MousePointerClick, Users } from "lucide-react";

import { ModelImage } from "@/components/onlycreatorawards/ModelImage";
import { Badge } from "@/components/ui/badge";
import { getImportedModelAudienceStat, type ImportedModel } from "@/lib/onlycreatorawards/modelDirectory";

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
  const audience = getImportedModelAudienceStat(model);
  const audienceText = audience.value ? `${compactNumber(audience.value)} ${audience.label.toLowerCase()}` : "Feed profile";

  return (
    <article
      className="group h-full overflow-hidden rounded-lg border border-white/10 !bg-[#080b12] text-white shadow-[0_24px_80px_rgba(0,0,0,0.22)] transition hover:-translate-y-1 hover:border-brand-amber/60"
      style={{ backgroundColor: "#080b12", color: "#fff" }}
    >
      <Link href={`/model/${model.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden bg-[#05070d]">
          <ModelImage
            src={model.profileImageUrl}
            alt={model.imageAltText || `${model.displayName} profile`}
            className="h-full w-full object-cover object-top brightness-110 contrast-110 saturate-125 transition duration-500 group-hover:scale-[1.025]"
          />
          {rank ? (
            <Badge className="absolute left-3 top-3 border-brand-amber/50 bg-black/70 text-brand-amber shadow-gold-glow">
              #{rank}
            </Badge>
          ) : null}
        </div>
      </Link>
      <div className="space-y-4 !bg-[#080b12] p-5" style={{ backgroundColor: "#080b12" }}>
        <div>
          <Badge className="mb-3 max-w-full truncate border-brand-cyan/40 bg-brand-cyan/10 text-brand-cyan">
            {primaryCategory(model)}
          </Badge>
          <Link href={`/model/${model.slug}`} className="text-xl font-black text-white transition hover:text-brand-amber">
            {model.displayName}
          </Link>
          {model.handle ? <p className="mt-1 text-sm font-bold text-white/70">{model.handle}</p> : null}
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-black text-white/85">
          <div className="rounded-lg border border-white/10 !bg-[#0e1420] p-2" style={{ backgroundColor: "#0e1420" }}>
            <Users className="mb-1 h-4 w-4 text-brand-amber" aria-hidden="true" />
            {audienceText}
          </div>
          <div className="rounded-lg border border-white/10 !bg-[#0e1420] p-2" style={{ backgroundColor: "#0e1420" }}>
            <MousePointerClick className="mb-1 h-4 w-4 text-brand-cyan" aria-hidden="true" />
            {compactNumber(model.clickCount)} clicks
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {model.categoryLabels.slice(0, 3).map((label, index) => (
            <Badge key={`${model.slug}-${label}-${index}`} className="border-white/10 bg-white/[0.08] text-white/85">
              {label}
            </Badge>
          ))}
        </div>
        <div className="flex gap-2">
          <Link
            href={`/model/${model.slug}`}
            className="inline-flex min-h-10 flex-1 items-center justify-center rounded-lg border border-white/10 !bg-[#0e1420] px-3 text-sm font-black text-white transition hover:border-brand-amber/60 hover:text-brand-amber"
            style={{ backgroundColor: "#0e1420" }}
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
            <span className="inline-flex min-h-10 items-center justify-center rounded-lg border border-white/10 px-3 text-sm font-black text-white/50">
              <BadgeCheck className="h-4 w-4" aria-hidden="true" />
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
