"use client";

import type { CampaignObjective, CampaignStepProps } from "@/types/campaign";

const objectives: Array<{ id: CampaignObjective; title: string; copy: string }> = [
  { id: "traffic", title: "Paid clicks", copy: "Drive qualified visitors to the product URL at the selected max CPC." },
  { id: "conversions", title: "Purchases", copy: "Drive clicks with stronger buying intent for product sales or checkout starts." },
  { id: "lead_generation", title: "Leads", copy: "Drive clicks from people likely to submit a form or book a call." },
  { id: "retargeting", title: "Retargeting", copy: "Drive return clicks from people who already know the product." }
];

export function ObjectiveStep({ draft, updateDraft }: CampaignStepProps) {
  return (
    <div className="grid gap-5">
      <label className="grid gap-2">
        <span className="text-sm font-extrabold uppercase text-muted">Campaign name</span>
        <input
          className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
          value={draft.campaignName}
          onChange={(event) => updateDraft({ campaignName: event.target.value })}
        />
      </label>

      <div>
        <span className="text-sm font-extrabold uppercase text-muted">Objective</span>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {objectives.map((objective) => {
            const selected = draft.objective === objective.id;
            return (
              <button
                key={objective.id}
                className={[
                  "min-h-28 rounded-lg border p-4 text-left transition",
                  selected
                    ? "border-brand-green bg-emerald-50"
                    : "border-line bg-white hover:border-emerald-200"
                ].join(" ")}
                type="button"
                onClick={() => updateDraft({ objective: objective.id })}
              >
                <strong className="block text-base">{objective.title}</strong>
                <span className="mt-2 block text-sm leading-6 text-muted">{objective.copy}</span>
              </button>
            );
          })}
        </div>
      </div>

      <label className="flex min-h-12 items-center justify-between gap-4 rounded-lg border border-line bg-slate-50 px-4">
        <span>
          <span className="block font-extrabold">Adult or restricted inventory</span>
          <span className="block text-sm text-muted">Allow partner channels that require explicit category approval.</span>
        </span>
        <input
          className="h-5 w-5 accent-brand-green"
          checked={draft.isNsfw}
          type="checkbox"
          onChange={(event) => updateDraft({ isNsfw: event.target.checked })}
        />
      </label>
    </div>
  );
}
