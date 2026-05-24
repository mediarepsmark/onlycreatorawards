"use client";

import type { CampaignStepProps } from "@/types/campaign";

export function OfferStep({ draft, updateDraft }: CampaignStepProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-extrabold uppercase text-muted">Landing page URL</span>
          <input
            className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
            inputMode="url"
            value={draft.landingPageUrl}
            onChange={(event) => updateDraft({ landingPageUrl: event.target.value })}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-extrabold uppercase text-muted">Display URL</span>
          <input
            className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
            value={draft.displayUrl}
            onChange={(event) => updateDraft({ displayUrl: event.target.value })}
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-extrabold uppercase text-muted">Offer description</span>
        <textarea
          className="min-h-32 rounded-lg border border-line bg-white px-3 py-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
          value={draft.offerDescription}
          onChange={(event) => updateDraft({ offerDescription: event.target.value })}
        />
      </label>
    </div>
  );
}
