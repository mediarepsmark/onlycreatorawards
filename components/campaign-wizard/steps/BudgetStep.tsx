"use client";

import type { CampaignStepProps } from "@/types/campaign";

// TODO: Confirm exact TrafficHaus enum values from the advertiser account UI.
const bidTypeOptions = ["cpm", "cpc"];

export function BudgetStep({ draft, updateDraft }: CampaignStepProps) {
  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
        <p className="text-xs font-extrabold uppercase text-brand-green">Customer chooses the click price</p>
        <h3 className="mt-1 text-lg font-extrabold">Set the max CPC and click budget</h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          CPCAdvertising.com generates and runs the ads, then optimizes partner placements around the amount
          the customer is willing to pay for each click.
        </p>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-extrabold uppercase text-muted">Pricing model</span>
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
          label={draft.bidType === "cpc" ? "Max cost per click" : "Bid amount"}
          value={draft.bidAmount}
          onChange={(value) => updateDraft({ bidAmount: value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CurrencyField
          label="Daily click budget"
          value={draft.dailyBudget}
          onChange={(value) => updateDraft({ dailyBudget: value })}
        />
        <CurrencyField
          label="Total click budget"
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
