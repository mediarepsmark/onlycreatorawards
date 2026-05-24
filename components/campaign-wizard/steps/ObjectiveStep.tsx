"use client";

import type { CampaignObjective, CampaignStepProps } from "@/types/campaign";

const objectives: Array<{ id: CampaignObjective; title: string; copy: string }> = [
  { id: "traffic", title: "Traffic", copy: "Prioritize visits and top-funnel scale." },
  { id: "conversions", title: "Conversions", copy: "Optimize toward signups, purchases, or leads." },
  { id: "lead_generation", title: "Lead generation", copy: "Focus the setup around form fills or booked calls." },
  { id: "retargeting", title: "Retargeting", copy: "Aim the campaign at known audiences and return visits." }
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
          <span className="block font-extrabold">NSFW inventory</span>
          <span className="block text-sm text-muted">Maps to TrafficHaus is_nsfw.</span>
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
