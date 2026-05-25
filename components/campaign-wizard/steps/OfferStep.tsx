"use client";

import type { CampaignStepProps } from "@/types/campaign";

const toDisplayUrl = (value: string) =>
  value
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

export function OfferStep({ draft, updateDraft }: CampaignStepProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-extrabold uppercase text-muted">Product URL</span>
          <input
            className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
            inputMode="url"
            placeholder="https://yourstore.com/product"
            value={draft.landingPageUrl}
            onChange={(event) =>
              updateDraft({
                landingPageUrl: event.target.value,
                displayUrl: toDisplayUrl(event.target.value)
              })
            }
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-extrabold uppercase text-muted">Display domain</span>
          <input
            className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
            value={draft.displayUrl}
            onChange={(event) => updateDraft({ displayUrl: event.target.value })}
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-extrabold uppercase text-muted">Product / offer notes</span>
        <textarea
          className="min-h-32 rounded-lg border border-line bg-white px-3 py-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
          placeholder="What is the product, who should click, and what makes it worth attention?"
          value={draft.offerDescription}
          onChange={(event) => updateDraft({ offerDescription: event.target.value })}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-extrabold uppercase text-muted">Restrictions</span>
        <textarea
          className="min-h-24 rounded-lg border border-line bg-white px-3 py-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
          placeholder="Claims to avoid, geos to exclude, compliance notes, brand rules, or audience restrictions."
          value={draft.restrictions}
          onChange={(event) => updateDraft({ restrictions: event.target.value })}
        />
      </label>

      <section className="rounded-lg border border-line bg-slate-50 p-4">
        <span className="text-sm font-extrabold uppercase text-muted">Creative approval</span>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            className={[
              "rounded-lg border p-4 text-left transition",
              draft.customerApprovalMode === "auto_run"
                ? "border-brand-green bg-emerald-50"
                : "border-line bg-white hover:border-emerald-200"
            ].join(" ")}
            type="button"
            onClick={() => updateDraft({ customerApprovalMode: "auto_run" })}
          >
            <strong className="block">Run for clicks</strong>
            <span className="mt-2 block text-sm leading-6 text-muted">
              CPCAdvertising.com generates ads and starts driving clicks without extra sign-off.
            </span>
          </button>
          <button
            className={[
              "rounded-lg border p-4 text-left transition",
              draft.customerApprovalMode === "review_first"
                ? "border-brand-green bg-emerald-50"
                : "border-line bg-white hover:border-emerald-200"
            ].join(" ")}
            type="button"
            onClick={() => updateDraft({ customerApprovalMode: "review_first" })}
          >
            <strong className="block">Review ads first</strong>
            <span className="mt-2 block text-sm leading-6 text-muted">
              Generate ad options for customer approval before partner-platform submission.
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
