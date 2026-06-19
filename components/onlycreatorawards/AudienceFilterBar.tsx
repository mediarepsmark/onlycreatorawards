"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { BadgeCheck, RotateCcw, Sparkles, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import {
  isDefaultModelAudienceSelection,
  modelAudienceValues,
  parseModelAudienceParam,
  serializeModelAudienceSelection,
  type ModelAudience
} from "@/lib/onlycreatorawards/audience";
import { cn } from "@/lib/utils";

const audienceOptions: Array<{ value: ModelAudience; label: string; Icon: LucideIcon }> = [
  { value: "women", label: "Women", Icon: Users },
  { value: "men", label: "Men", Icon: BadgeCheck },
  { value: "trans", label: "Trans", Icon: Sparkles }
];

function ordered(selection: ModelAudience[]) {
  return modelAudienceValues.filter((value) => selection.includes(value));
}

function nextSelection(current: ModelAudience[], value: ModelAudience) {
  const next = current.includes(value) ? current.filter((item) => item !== value) : [...current, value];
  return ordered(next.length ? next : [value]);
}

export function AudienceFilterBar({
  className,
  compact = false
}: {
  className?: string;
  compact?: boolean;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname.startsWith("/admin")) return null;

  const current = parseModelAudienceParam(searchParams.get("audience"));

  function hrefFor(selection: ModelAudience[]) {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");

    if (isDefaultModelAudienceSelection(selection)) {
      params.delete("audience");
    } else {
      params.set("audience", serializeModelAudienceSelection(selection));
    }

    const query = params.toString();
    return query ? `${pathname}?${query}` : pathname;
  }

  const resetHref = hrefFor(["women"]);

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="text-xs font-black uppercase tracking-[0.16em] text-white/45">Show</span>
      <div className="flex flex-wrap gap-2">
        {audienceOptions.map(({ value, label, Icon }) => {
          const active = current.includes(value);
          const selection = nextSelection(current, value);

          return (
            <Link
              key={value}
              href={hrefFor(selection)}
              className={cn(
                "inline-flex min-h-9 items-center gap-2 rounded-lg border px-3 text-sm font-black transition",
                active
                  ? "border-brand-amber/70 bg-brand-amber text-ink shadow-gold-glow"
                  : "border-white/10 bg-white/[0.045] text-white/72 hover:border-brand-cyan/55 hover:text-brand-cyan",
                compact && "min-h-8 px-2.5 text-xs"
              )}
              aria-label={`${active ? "Remove" : "Add"} ${label} audience filter`}
            >
              <Icon className="h-4 w-4" aria-hidden="true" />
              {label}
            </Link>
          );
        })}
      </div>
      {!isDefaultModelAudienceSelection(current) ? (
        <Link
          href={resetHref}
          className={cn(
            "inline-flex min-h-9 items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-3 text-sm font-black text-white/65 transition hover:border-brand-amber/60 hover:text-brand-amber",
            compact && "min-h-8 px-2.5 text-xs"
          )}
        >
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Reset
        </Link>
      ) : null}
    </div>
  );
}
