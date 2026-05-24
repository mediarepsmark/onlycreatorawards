"use client";

import { csvToArray } from "@/lib/campaignMapper";
import type { CampaignStepProps } from "@/types/campaign";

const deviceOptions = ["desktop", "mobile", "tablet"];

const toggleValue = (items: string[], value: string) =>
  items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

export function TargetingStep({ draft, updateDraft }: CampaignStepProps) {
  return (
    <div className="grid gap-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <CsvField
          label="Geo targets"
          value={draft.geoTargets}
          onChange={(value) => updateDraft({ geoTargets: value })}
        />
        <CsvField
          label="Language targets"
          value={draft.languageTargets}
          onChange={(value) => updateDraft({ languageTargets: value })}
        />
      </div>

      <div className="rounded-lg border border-line bg-slate-50 p-4">
        <span className="text-sm font-extrabold uppercase text-muted">Devices</span>
        <div className="mt-3 flex flex-wrap gap-3">
          {deviceOptions.map((device) => (
            <label key={device} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-white px-3">
              <input
                className="h-4 w-4 accent-brand-green"
                checked={draft.deviceTargets.includes(device)}
                type="checkbox"
                onChange={() => updateDraft({ deviceTargets: toggleValue(draft.deviceTargets, device) })}
              />
              <span className="font-semibold capitalize">{device}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CsvField
          label="Operating systems"
          value={draft.operatingSystems}
          onChange={(value) => updateDraft({ operatingSystems: value })}
        />
        <CsvField
          label="Browsers"
          value={draft.browsers}
          onChange={(value) => updateDraft({ browsers: value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <CsvField
          label="Carriers"
          value={draft.carriers}
          onChange={(value) => updateDraft({ carriers: value })}
        />
        <CsvField
          label="Zone targeting"
          value={draft.zoneTargeting}
          onChange={(value) => updateDraft({ zoneTargeting: value })}
        />
      </div>

      <CsvField
        label="Keywords"
        value={draft.keywords}
        textarea
        onChange={(value) => updateDraft({ keywords: value })}
      />
    </div>
  );
}

function CsvField({
  label,
  onChange,
  textarea = false,
  value
}: {
  label: string;
  onChange: (value: string[]) => void;
  textarea?: boolean;
  value: string[];
}) {
  const className =
    "rounded-lg border border-line bg-white px-3 py-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100";
  const stringValue = value.join(", ");

  return (
    <label className="grid gap-2">
      <span className="text-sm font-extrabold uppercase text-muted">{label}</span>
      {textarea ? (
        <textarea
          className={`${className} min-h-28`}
          value={stringValue}
          onChange={(event) => onChange(csvToArray(event.target.value))}
        />
      ) : (
        <input
          className={`${className} min-h-11`}
          value={stringValue}
          onChange={(event) => onChange(csvToArray(event.target.value))}
        />
      )}
    </label>
  );
}
