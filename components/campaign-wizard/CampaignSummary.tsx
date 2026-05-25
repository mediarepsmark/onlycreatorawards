"use client";

import { CheckCircle2, TriangleAlert } from "lucide-react";

import type { CampaignDraft, TrafficHausPayload, ValidationResult } from "@/types/campaign";

interface CampaignSummaryProps {
  draft: CampaignDraft;
  payload: TrafficHausPayload;
  validation: ValidationResult;
}

export function CampaignSummary({ draft, payload, validation }: CampaignSummaryProps) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-extrabold uppercase text-brand-green">Summary</p>
          <h2 className="text-base font-extrabold">Launch readiness</h2>
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
            <dt className="font-bold text-muted">Max CPC</dt>
            <dd className="mt-1 font-semibold text-ink">
              ${payload.bid_amount || "0"}
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="font-bold text-muted">Daily</dt>
            <dd className="mt-1 font-semibold text-ink">${payload.daily_budget || "0"}</dd>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="font-bold text-muted">Approval</dt>
            <dd className="mt-1 font-semibold text-ink">
              {draft.customerApprovalMode === "review_first" ? "Review first" : "Auto-run"}
            </dd>
          </div>
          <div className="rounded-lg bg-slate-50 p-3">
            <dt className="font-bold text-muted">Partners</dt>
            <dd className="mt-1 font-semibold text-ink">{draft.partnerChannels.length}</dd>
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
