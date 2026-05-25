"use client";

import { CheckCircle2 } from "lucide-react";

import type { CampaignStepProps, PartnerChannel } from "@/types/campaign";

const partnerOptions: Array<{ id: PartnerChannel; label: string; copy: string }> = [
  { id: "google", label: "Google", copy: "Search and display intent." },
  { id: "instagram", label: "Instagram", copy: "Visual social discovery." },
  { id: "snapchat", label: "Snapchat", copy: "Mobile-first attention." },
  { id: "outbrain", label: "Outbrain", copy: "Native content clicks." },
  { id: "taboola", label: "Taboola", copy: "Recommendation traffic." },
  { id: "nativo", label: "Nativo", copy: "Publisher native ads." },
  { id: "traffichaus", label: "TrafficHaus", copy: "Connected launch partner." }
];

// TODO: Confirm exact TrafficHaus enum values from the advertiser account UI.
const adLocationOptions = ["Native", "Banner", "Pop", "Video"];

// TODO: Confirm exact TrafficHaus enum values from the advertiser account UI.
const adTypeOptions = ["Native Model Widget", "Native Banner", "Display Banner", "Video Pre-Roll"];

// TODO: Confirm exact TrafficHaus enum values from the advertiser account UI.
const siteTargetingOptions = ["Run-of-Network", "Site List", "Zone Targeting"];

// TODO: Confirm exact TrafficHaus enum values from the advertiser account UI.
const creativeTypeOptions = ["banners", "native", "video"];

const togglePartner = (items: PartnerChannel[], value: PartnerChannel) =>
  items.includes(value) ? items.filter((item) => item !== value) : [...items, value];

export function AdFormatStep({ draft, updateDraft }: CampaignStepProps) {
  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-line bg-slate-50 p-4">
        <div className="flex flex-col gap-1">
          <p className="text-xs font-extrabold uppercase text-brand-green">Partner routing</p>
          <h3 className="text-lg font-extrabold">Choose where CPCAdvertising.com should buy the clicks.</h3>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {partnerOptions.map((partner) => {
            const selected = draft.partnerChannels.includes(partner.id);
            return (
              <button
                key={partner.id}
                className={[
                  "min-h-28 rounded-lg border p-4 text-left transition",
                  selected
                    ? "border-brand-blue bg-[#eef6ff] shadow-sm"
                    : "border-line bg-white hover:border-brand-blue/30"
                ].join(" ")}
                type="button"
                onClick={() => updateDraft({ partnerChannels: togglePartner(draft.partnerChannels, partner.id) })}
              >
                <span className="flex items-center justify-between gap-3">
                  <strong>{partner.label}</strong>
                  {selected ? <CheckCircle2 className="h-5 w-5 text-brand-blue" /> : null}
                </span>
                <span className="mt-2 block text-sm leading-6 text-muted">{partner.copy}</span>
              </button>
            );
          })}
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Initial placement"
          value={draft.adLocation}
          values={adLocationOptions}
          onChange={(value) => updateDraft({ adLocation: value })}
        />
        <SelectField
          label="Initial ad format"
          value={draft.adType}
          values={adTypeOptions}
          onChange={(value) => updateDraft({ adType: value })}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <SelectField
          label="Traffic source"
          value={draft.siteTargeting}
          values={siteTargetingOptions}
          onChange={(value) => updateDraft({ siteTargeting: value })}
        />
        <SelectField
          label="Creative package"
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
