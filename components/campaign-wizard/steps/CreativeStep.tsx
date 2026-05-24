"use client";

import type { CampaignStepProps } from "@/types/campaign";

export function CreativeStep({ draft, updateDraft }: CampaignStepProps) {
  return (
    <div className="grid gap-5">
      <label className="grid gap-2">
        <span className="text-sm font-extrabold uppercase text-muted">Creative asset URL</span>
        <input
          className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
          inputMode="url"
          placeholder="https://cdn.example.com/native-creative.png"
          value={draft.creativeUrl}
          onChange={(event) => updateDraft({ creativeUrl: event.target.value })}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-extrabold uppercase text-muted">Headline</span>
        <input
          className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
          maxLength={90}
          value={draft.headline}
          onChange={(event) => updateDraft({ headline: event.target.value })}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-extrabold uppercase text-muted">Description</span>
        <textarea
          className="min-h-32 rounded-lg border border-line bg-white px-3 py-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
          maxLength={160}
          value={draft.description}
          onChange={(event) => updateDraft({ description: event.target.value })}
        />
      </label>

      <section className="rounded-lg border border-line bg-slate-50 p-4">
        <p className="text-xs font-extrabold uppercase text-brand-green">Native preview</p>
        <div className="mt-3 rounded-lg bg-[#101816] p-4 text-white">
          <span className="text-xs font-extrabold uppercase text-emerald-200">Sponsored</span>
          <h3 className="mt-2 text-xl font-extrabold leading-tight">{draft.headline || "Headline"}</h3>
          <p className="mt-2 leading-6 text-white/75">{draft.description || "Description"}</p>
          <span className="mt-3 block font-extrabold text-emerald-200">
            {draft.displayUrl || "display-url.com"}
          </span>
        </div>
      </section>
    </div>
  );
}
