"use client";

import type { CampaignStepProps } from "@/types/campaign";

// TODO: Confirm exact TrafficHaus enum values from the advertiser account UI.
const adLocationOptions = ["Native", "Banner", "Pop", "Video"];

// TODO: Confirm exact TrafficHaus enum values from the advertiser account UI.
const adTypeOptions = ["Native Model Widget", "Native Banner", "Display Banner", "Video Pre-Roll"];

// TODO: Confirm exact TrafficHaus enum values from the advertiser account UI.
const siteTargetingOptions = ["Run-of-Network", "Site List", "Zone Targeting"];

// TODO: Confirm exact TrafficHaus enum values from the advertiser account UI.
const creativeTypeOptions = ["banners", "native", "video"];

export function AdFormatStep({ draft, updateDraft }: CampaignStepProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Ad location"
          value={draft.adLocation}
          values={adLocationOptions}
          onChange={(value) => updateDraft({ adLocation: value })}
        />
        <SelectField
          label="Ad type"
          value={draft.adType}
          values={adTypeOptions}
          onChange={(value) => updateDraft({ adType: value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Site targeting"
          value={draft.siteTargeting}
          values={siteTargetingOptions}
          onChange={(value) => updateDraft({ siteTargeting: value })}
        />
        <SelectField
          label="Creative type"
          value={draft.creativeType}
          values={creativeTypeOptions}
          onChange={(value) => updateDraft({ creativeType: value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-extrabold uppercase text-muted">Frequency cap type</span>
          <input
            className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
            value={draft.frequencyCapType}
            onChange={(event) => updateDraft({ frequencyCapType: event.target.value })}
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-extrabold uppercase text-muted">Frequency cap value</span>
          <input
            className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
            min={1}
            type="number"
            value={draft.frequencyCapValue}
            onChange={(event) => updateDraft({ frequencyCapValue: Number(event.target.value) })}
          />
        </label>
      </div>
    </div>
  );
}

function SelectField({
  label,
  onChange,
  value,
  values
}: {
  label: string;
  onChange: (value: string) => void;
  value: string;
  values: string[];
}) {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold uppercase text-muted">{label}</span>
      <select
        className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {values.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
