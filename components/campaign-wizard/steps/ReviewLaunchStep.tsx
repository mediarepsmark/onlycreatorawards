"use client";

import { useMemo, useState } from "react";
import { BarChart3, CheckCircle2, Clipboard, Rocket, TriangleAlert } from "lucide-react";

import type {
  CampaignDraft,
  CampaignStepProps,
  TrafficHausPayload,
  ValidationResult
} from "@/types/campaign";

interface ReviewLaunchStepProps extends CampaignStepProps {
  isLaunching: boolean;
  launchState: {
    status: "idle" | "success" | "error";
    message: string;
    response?: unknown;
  };
  onLaunch: () => void;
  payload: TrafficHausPayload;
  validation: ValidationResult;
}

const isoDate = (date: Date) => date.toISOString().slice(0, 10);

const defaultStartDate = () => {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return isoDate(date);
};

const partnerLabels: Record<CampaignDraft["partnerChannels"][number], string> = {
  google: "Google",
  instagram: "Instagram",
  snapchat: "Snapchat",
  outbrain: "Outbrain",
  taboola: "Taboola",
  nativo: "Nativo",
  traffichaus: "TrafficHaus"
};

export function ReviewLaunchStep({
  draft,
  isLaunching,
  launchState,
  onLaunch,
  payload,
  validation
}: ReviewLaunchStepProps) {
  const [copied, setCopied] = useState(false);
  const [statsStartDate, setStatsStartDate] = useState<string>(() => defaultStartDate());
  const [statsEndDate, setStatsEndDate] = useState(() => isoDate(new Date()));
  const [statsCampaigns, setStatsCampaigns] = useState("");
  const [statsState, setStatsState] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
    response?: unknown;
  }>({ status: "idle", message: "No stats loaded." });

  const payloadJson = useMemo(() => JSON.stringify(payload, null, 2), [payload]);

  const copyPayload = async () => {
    await navigator.clipboard.writeText(payloadJson);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const loadStats = async () => {
    setStatsState({ status: "loading", message: "Loading advertiser stats..." });
    const params = new URLSearchParams({
      start_date: statsStartDate,
      end_date: statsEndDate,
      group_by: "campaign,date",
      format: "1"
    });
    if (statsCampaigns.trim()) params.set("campaigns", statsCampaigns.trim());

    try {
      const response = await fetch(`/api/traffichaus/stats?${params.toString()}`);
      const result = await response.json();

      setStatsState({
        status: response.ok && result.ok ? "success" : "error",
        message: result.message || "Stats request complete.",
        response: result.data || result.errors || result
      });
    } catch (error) {
      setStatsState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to load advertiser stats."
      });
    }
  };

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-line bg-slate-50 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-brand-green">Launch readiness</p>
            <h2 className="text-lg font-extrabold">
              {validation.valid ? "Generated click campaign is ready." : "Required fields are missing."}
            </h2>
          </div>
          {validation.valid ? (
            <CheckCircle2 className="h-6 w-6 text-brand-green" />
          ) : (
            <TriangleAlert className="h-6 w-6 text-brand-amber" />
          )}
        </div>

        {!validation.valid && (
          <ul className="mt-4 list-inside list-disc rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            {validation.errors.map((error) => (
              <li key={error}>{error}</li>
            ))}
          </ul>
        )}

        <button
          className="mt-4 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg bg-brand-green px-5 font-extrabold text-white hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
          disabled={isLaunching || !validation.valid}
          type="button"
          onClick={onLaunch}
        >
          <Rocket className="h-4 w-4" />
          {isLaunching
            ? "Submitting..."
            : draft.customerApprovalMode === "review_first"
              ? "Generate Approval Packet"
              : "Run Click Campaign"}
        </button>

        <div
          className={[
            "mt-4 rounded-lg border p-3 text-sm leading-6",
            launchState.status === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : launchState.status === "error"
                ? "border-rose-200 bg-rose-50 text-rose-900"
                : "border-line bg-white text-muted"
          ].join(" ")}
        >
          <strong className="block text-ink">{launchState.message}</strong>
          {launchState.response ? (
            <pre className="mt-2 max-h-72 overflow-auto rounded-lg bg-white/70 p-3 text-xs text-ink">
              {JSON.stringify(launchState.response, null, 2)}
            </pre>
          ) : null}
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white">
        <div className="flex flex-col gap-3 border-b border-line p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-extrabold uppercase text-brand-green">Payload preview</p>
            <h2 className="text-lg font-extrabold">Connected partner request</h2>
          </div>
          <button
            className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg border border-line bg-white px-3 font-extrabold text-ink hover:bg-slate-50"
            type="button"
            onClick={copyPayload}
          >
            <Clipboard className="h-4 w-4" />
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="max-h-[520px] overflow-auto bg-[#101816] p-4 text-sm leading-6 text-emerald-100">
          {payloadJson}
        </pre>
      </section>

      <section className="rounded-lg border border-line bg-white p-4">
        <p className="text-xs font-extrabold uppercase text-brand-green">CPCAdvertising run plan</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <InfoTile label="Product URL" value={draft.landingPageUrl || "Missing"} />
          <InfoTile label="Product" value={draft.productName || "Missing"} />
          <InfoTile label="Max CPC" value={`$${draft.bidAmount || "0"}`} />
          <InfoTile
            label="Approval"
            value={draft.customerApprovalMode === "review_first" ? "Review ads first" : "Run for clicks"}
          />
          <InfoTile
            label="Partners"
            value={draft.partnerChannels.map((partner) => partnerLabels[partner]).join(", ") || "None selected"}
          />
        </div>
      </section>

      <section className="rounded-lg border border-line bg-white p-4">
        <div className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-brand-blue" />
          <div>
            <p className="text-xs font-extrabold uppercase text-brand-green">Advertiser stats</p>
            <h2 className="text-lg font-extrabold">TrafficHaus stats lookup</h2>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="grid gap-2">
            <span className="text-sm font-extrabold uppercase text-muted">Start date</span>
            <input
              className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
              type="date"
              value={statsStartDate}
              onChange={(event) => setStatsStartDate(event.target.value)}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-extrabold uppercase text-muted">End date</span>
            <input
              className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
              type="date"
              value={statsEndDate}
              onChange={(event) => setStatsEndDate(event.target.value)}
            />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-extrabold uppercase text-muted">Campaign IDs</span>
            <input
              className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
              placeholder="12345, 67890"
              value={statsCampaigns}
              onChange={(event) => setStatsCampaigns(event.target.value)}
            />
          </label>
        </div>

        <button
          className="mt-4 inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-line bg-white px-4 font-extrabold text-ink hover:bg-slate-50"
          disabled={statsState.status === "loading"}
          type="button"
          onClick={loadStats}
        >
          <BarChart3 className="h-4 w-4" />
          {statsState.status === "loading" ? "Loading..." : "Load Stats"}
        </button>

        <div
          className={[
            "mt-4 rounded-lg border p-3 text-sm",
            statsState.status === "success"
              ? "border-emerald-200 bg-emerald-50"
              : statsState.status === "error"
                ? "border-rose-200 bg-rose-50"
                : "border-line bg-slate-50"
          ].join(" ")}
        >
          <strong className="block text-ink">{statsState.message}</strong>
          {statsState.response ? (
            <pre className="mt-2 max-h-72 overflow-auto rounded-lg bg-white/70 p-3 text-xs text-ink">
              {JSON.stringify(statsState.response, null, 2)}
            </pre>
          ) : null}
        </div>
      </section>
    </div>
  );
}

function InfoTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-3">
      <p className="text-sm font-extrabold uppercase text-muted">{label}</p>
      <p className="mt-1 break-words font-semibold text-ink">{value}</p>
    </div>
  );
}
