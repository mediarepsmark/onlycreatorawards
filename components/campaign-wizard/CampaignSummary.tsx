"use client";

import { CheckCircle2, TriangleAlert } from "lucide-react";

import type { TrafficHausPayload, ValidationResult } from "@/types/campaign";

interface CampaignSummaryProps {
  payload: TrafficHausPayload;
  validation: ValidationResult;
}

export function CampaignSummary({ payload, validation }: CampaignSummaryProps) {
  return (
    <section className="rounded-lg border border-line bg-white/90 p-4 shadow-panel">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase text-brand-green">Summary</p>
          <h2 className="text-base font-extrabold">TrafficHaus payload</h2>
        </div>
        {validation.valid ? (
          <CheckCircle2 className="h-5 w-5 text-brand-green" />
        ) : (
          <TriangleAlert className="h-5 w-5 text-brand-amber" />
        )}
      </div>

      <dl className="mt-4 grid gap-3 text-sm">
        <div className="rounded-lg bg-slate-50 p-3">
          <dt className="font-bold text-muted">Campaign</dt>
          <dd className="mt-1 font-semibold text-ink">{payload.name || "Untitled campaign"}</dd>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="font-bold text-muted">Geo</dt>
            <dd className="mt-1 font-semibold text-ink">{payload.geo || "Missing"}</dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="font-bold text-muted">Devices</dt>
            <dd className="mt-1 font-semibold text-ink">{payload.device_type || "Missing"}</dd>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="font-bold text-muted">Bid</dt>
            <dd className="mt-1 font-semibold text-ink">
              {payload.bid_type.toUpperCase()} ${payload.bid_amount || "0"}
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="font-bold text-muted">Daily</dt>
            <dd className="mt-1 font-semibold text-ink">${payload.daily_budget || "0"}</dd>
          </div>
        </div>
      </dl>

      {!validation.valid && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <strong className="block">Missing fields</strong>
          <ul className="mt-2 list-inside list-disc space-y-1">
            {validation.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
