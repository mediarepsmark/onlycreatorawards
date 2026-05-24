"use client";

import type { CampaignStepProps } from "@/types/campaign";

// TODO: Confirm exact TrafficHaus enum values from the advertiser account UI.
const bidTypeOptions = ["cpm", "cpc"];

export function BudgetStep({ draft, updateDraft }: CampaignStepProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-extrabold uppercase text-muted">Bid type</span>
          <select
            className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
            value={draft.bidType}
            onChange={(event) => updateDraft({ bidType: event.target.value })}
          >
            {bidTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option.toUpperCase()}
              </option>
            ))}
          </select>
        </label>

        <CurrencyField
          label="Bid amount"
          value={draft.bidAmount}
          onChange={(value) => updateDraft({ bidAmount: value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CurrencyField
          label="Daily budget"
          value={draft.dailyBudget}
          onChange={(value) => updateDraft({ dailyBudget: value })}
        />
        <CurrencyField
          label="Total budget"
          value={draft.totalBudget}
          onChange={(value) => updateDraft({ totalBudget: value })}
        />
      </div>
    </div>
  );
}

function CurrencyField({
  label,
  onChange,
  value
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold uppercase text-muted">{label}</span>
      <input
        className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
        min="0"
        step="0.01"
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}
