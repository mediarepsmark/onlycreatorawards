"use client";

import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDollarSign,
  Globe2,
  MessageSquareText,
  Plus,
  Rocket,
  Search,
  Send,
  Sparkles,
  ShieldCheck,
  Wand2,
  X
} from "lucide-react";

import { AIAssistantPanel } from "@/components/campaign-wizard/AIAssistantPanel";
import { CampaignSummary } from "@/components/campaign-wizard/CampaignSummary";
import { AdFormatStep } from "@/components/campaign-wizard/steps/AdFormatStep";
import { BudgetStep } from "@/components/campaign-wizard/steps/BudgetStep";
import { CreativeStep } from "@/components/campaign-wizard/steps/CreativeStep";
import { ObjectiveStep } from "@/components/campaign-wizard/steps/ObjectiveStep";
import { OfferStep } from "@/components/campaign-wizard/steps/OfferStep";
import { ReviewLaunchStep } from "@/components/campaign-wizard/steps/ReviewLaunchStep";
import { TargetingStep } from "@/components/campaign-wizard/steps/TargetingStep";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  defaultCampaignDraft,
  mapCampaignToTrafficHausPayload,
  validateTrafficHausPayload
} from "@/lib/campaignMapper";
import type {
  ApiResult,
  CampaignDraft,
  CampaignWizardStep,
  TrafficHausCreateResponse
} from "@/types/campaign";

const steps: Array<{ id: CampaignWizardStep; label: string }> = [
  { id: "objective", label: "Campaign Objective" },
  { id: "offer", label: "Offer / Landing Page" },
  { id: "targeting", label: "Targeting" },
  { id: "ad-format", label: "Ad Format" },
  { id: "budget", label: "Budget & Bid" },
  { id: "creative", label: "Creative" },
  { id: "review", label: "Review & Launch" }
];

type LaunchState = {
  status: "idle" | "success" | "error";
  message: string;
  response?: unknown;
};

export function CampaignWizard() {
  const [draft, setDraft] = useState<CampaignDraft>(defaultCampaignDraft);
  const [activeStep, setActiveStep] = useState<CampaignWizardStep>("objective");
  const [prompt, setPrompt] = useState(
    "Generate creatives, targeting, budget, and a TrafficHaus-ready native campaign for CPC Advertising."
  );
  const [isLaunching, setIsLaunching] = useState(false);
  const [launchState, setLaunchState] = useState<LaunchState>({
    status: "idle",
    message: "Waiting for launch review."
  });

  const activeIndex = steps.findIndex((step) => step.id === activeStep);
  const payload = useMemo(() => mapCampaignToTrafficHausPayload(draft), [draft]);
  const validation = useMemo(() => validateTrafficHausPayload(payload), [payload]);

  const updateDraft = (patch: Partial<CampaignDraft>) => {
    setDraft((current) => ({ ...current, ...patch }));
    setLaunchState({ status: "idle", message: "Campaign changed. Review before launching." });
  };

  const goToStep = (step: CampaignWizardStep) => setActiveStep(step);
  const goNext = () => setActiveStep(steps[Math.min(activeIndex + 1, steps.length - 1)].id);
  const goBack = () => setActiveStep(steps[Math.max(activeIndex - 1, 0)].id);

  const applyPrompt = () => {
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt) return;

    updateDraft({
      campaignName: cleanPrompt.length > 70 ? `${cleanPrompt.slice(0, 67)}...` : cleanPrompt,
      offerDescription: cleanPrompt,
      headline: "Launch smarter paid traffic in minutes",
      description:
        "Plan, target, and submit TrafficHaus-ready native campaigns from one focused advertising workspace.",
      keywords: Array.from(
        new Set([...draft.keywords, "campaign setup", "native demand", "performance advertising"])
      )
    });
    setActiveStep("offer");
  };

  const applyQuickAction = (action: "creative" | "targeting" | "budget") => {
    if (action === "creative") {
      updateDraft({
        headline: `${draft.campaignName.replace(/\s+-\s+.*/, "")}: campaign setup that moves faster`,
        description:
          "Turn a campaign brief into TrafficHaus-ready targeting, bidding, and native creative without extra handoff.",
        keywords: Array.from(
          new Set([...draft.keywords, "buyer intent", "campaign automation", "native advertising"])
        )
      });
      setActiveStep("creative");
    }

    if (action === "targeting") {
      updateDraft({
        geoTargets: ["united states"],
        deviceTargets: ["desktop", "mobile", "tablet"],
        languageTargets: ["english"],
        browsers: ["chrome", "firefox", "safari", "edge"]
      });
      setActiveStep("targeting");
    }

    if (action === "budget") {
      updateDraft({
        bidType: "cpm",
        bidAmount: "1.30",
        dailyBudget: "100",
        totalBudget: "1000",
        frequencyCapType: "site",
        frequencyCapValue: 2
      });
      setActiveStep("budget");
    }
  };

  const launchCampaign = async () => {
    if (!validation.valid) {
      setLaunchState({
        status: "error",
        message: "Required TrafficHaus fields are missing.",
        response: validation.errors
      });
      return;
    }

    setIsLaunching(true);
    setLaunchState({ status: "idle", message: "Submitting campaign to TrafficHaus..." });

    try {
      const response = await fetch("/api/traffichaus/create-campaign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaign: draft })
      });
      const result = (await response.json()) as ApiResult<TrafficHausCreateResponse>;

      if (!response.ok || !result.ok) {
        setLaunchState({
          status: "error",
          message: result.message || "TrafficHaus campaign creation failed.",
          response: result.errors || result
        });
        return;
      }

      setLaunchState({
        status: "success",
        message: result.message,
        response: result.data
      });
    } catch (error) {
      setLaunchState({
        status: "error",
        message: error instanceof Error ? error.message : "TrafficHaus campaign creation failed."
      });
    } finally {
      setIsLaunching(false);
    }
  };

  const renderStep = () => {
    const stepProps = { draft, updateDraft };

    switch (activeStep) {
      case "objective":
        return <ObjectiveStep {...stepProps} />;
      case "offer":
        return <OfferStep {...stepProps} />;
      case "targeting":
        return <TargetingStep {...stepProps} />;
      case "ad-format":
        return <AdFormatStep {...stepProps} />;
      case "budget":
        return <BudgetStep {...stepProps} />;
      case "creative":
        return <CreativeStep {...stepProps} />;
      case "review":
        return (
          <ReviewLaunchStep
            {...stepProps}
            isLaunching={isLaunching}
            launchState={launchState}
            onLaunch={launchCampaign}
            payload={payload}
            validation={validation}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className="min-h-screen bg-[#f4f7f7] text-ink">
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute left-1/2 top-28 h-px w-[52rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#7df08a] to-transparent opacity-80 shadow-[0_0_36px_rgba(125,240,138,0.8)]" />
        <div className="absolute left-1/2 top-44 h-px w-[38rem] -translate-x-1/2 bg-gradient-to-r from-transparent via-[#3b71ff] to-transparent opacity-70 shadow-[0_0_42px_rgba(59,113,255,0.9)]" />

        <header className="relative z-10 px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <a className="flex items-center gap-3" href="/campaigns/new" aria-label="CPCAdvertising.com">
              <span className="grid h-10 w-10 place-items-center rounded-lg border border-white/15 bg-white text-xs font-extrabold text-black shadow-sm">
                CPC
              </span>
              <span>
                <strong className="block text-sm text-white">CPCAdvertising.com</strong>
                <span className="block text-xs text-white/55">AI creatives + campaigns</span>
              </span>
            </a>

            <div className="hidden items-center gap-2 md:flex">
              <Badge className="gap-2 bg-white/10 text-white ring-1 ring-white/15">
                <Globe2 className="h-4 w-4 text-[#73ddff]" />
                TrafficHaus
              </Badge>
              <Badge className={validation.valid ? "bg-[#7ff083] text-black" : "bg-white/10 text-white"}>
                {validation.valid ? "Ready" : `${validation.errors.length} fields`}
              </Badge>
            </div>
          </div>
        </header>

        <div className="relative z-10 mx-auto flex min-h-[610px] max-w-6xl flex-col items-center px-4 pb-40 pt-16 text-center sm:px-6 sm:pt-20">
          <button
            className="inline-flex min-h-12 w-full max-w-xl items-center justify-between rounded-full border-2 border-[#3b71ff] bg-black px-4 text-sm text-white shadow-[0_0_24px_rgba(68,118,255,0.55),inset_0_0_22px_rgba(125,240,138,0.15)] sm:text-base"
            type="button"
            onClick={applyPrompt}
          >
            <Sparkles className="h-5 w-5 text-white" />
            <span className="truncate px-4">Generate creatives and campaigns with AI</span>
            <Send className="h-5 w-5 text-white" />
          </button>

          <h1 className="mt-10 max-w-5xl text-4xl font-light leading-tight text-white sm:text-6xl lg:text-[5.8rem]">
            <span className="block">1st-ever fully AI-driven</span>
            <span className="block">creatives and advertising</span>
            <span className="block">campaign generation tool</span>
          </h1>
          <p className="mt-6 max-w-3xl text-2xl font-light leading-tight text-white/60 sm:text-4xl">
            <span className="text-[#3b71ff]">where</span> creative concepts, targeting, bids, and launches happen from one prompt
          </p>

          <button
            className="mt-20 inline-flex min-h-14 items-center justify-center rounded-md bg-[#7ff083] px-8 text-base font-extrabold text-black transition hover:bg-[#9cff9f]"
            type="button"
            onClick={() => setActiveStep("review")}
          >
            Start AI campaign build
          </button>
        </div>
      </section>

      <div className="relative z-10 mx-auto -mt-28 max-w-6xl px-4 sm:px-6">
        <section className="rounded-lg bg-gradient-to-r from-[#7ff083] via-[#73ddff] to-[#3b71ff] p-[3px] shadow-[0_22px_80px_rgba(0,0,0,0.28)]">
          <div className="rounded-lg bg-white p-4">
            <div className="flex items-start gap-3 rounded-lg border border-slate-200 px-3 py-3 sm:items-center">
              <button
                className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-ink"
                type="button"
                aria-label="Add campaign input"
              >
                <Plus className="h-5 w-5" />
              </button>
              <Sparkles className="mt-2 h-6 w-6 shrink-0 text-brand-blue sm:mt-0" />
              <textarea
                className="min-h-10 flex-1 resize-none bg-transparent py-2 text-lg leading-7 outline-none placeholder:text-slate-400 sm:min-h-12"
                value={prompt}
                placeholder="Ask CPC to generate creatives, targeting, and launch settings..."
                onChange={(event) => setPrompt(event.target.value)}
              />
              <button
                className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-[#eef6ff] hover:text-brand-blue sm:mt-0"
                type="button"
                aria-label="Generate campaign setup"
                onClick={applyPrompt}
              >
                <Send className="h-5 w-5" />
              </button>
              <button
                className="mt-1 hidden h-10 w-10 shrink-0 place-items-center rounded-full text-slate-500 transition hover:bg-slate-100 hover:text-ink sm:grid"
                type="button"
                aria-label="Clear prompt"
                onClick={() => setPrompt("")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <PromptChip icon={<Wand2 className="h-4 w-4" />} label="Generate creatives" onClick={() => applyQuickAction("creative")} />
              <PromptChip icon={<Search className="h-4 w-4" />} label="Find targeting" onClick={() => applyQuickAction("targeting")} />
              <PromptChip icon={<CircleDollarSign className="h-4 w-4" />} label="Budget test" onClick={() => applyQuickAction("budget")} />
              <button
                className="inline-flex min-h-10 items-center rounded-full px-3 text-sm font-bold text-brand-blue transition hover:bg-[#eef6ff]"
                type="button"
                onClick={() => setActiveStep("review")}
              >
                Payload preview
              </button>
            </div>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-12 pt-8 sm:px-6">
        <nav
          className="mx-auto flex max-w-4xl flex-wrap justify-center gap-2"
          aria-label="Campaign setup steps"
        >
          {steps.map((step, index) => {
            const isActive = step.id === activeStep;
            const isComplete = index < activeIndex;
            return (
              <button
                key={step.id}
                aria-label={step.label}
                className={[
                  "inline-flex min-h-10 items-center gap-2 rounded-full border px-3 text-sm font-bold transition",
                  isActive
                    ? "border-brand-blue bg-white text-ink shadow-sm"
                    : isComplete
                      ? "border-[#7ff083] bg-[#eaffea] text-brand-green"
                      : "border-slate-200 bg-white/80 text-muted hover:border-slate-300 hover:text-ink"
                ].join(" ")}
                type="button"
                onClick={() => goToStep(step.id)}
              >
                <span
                  className={[
                    "grid h-5 w-5 place-items-center rounded-full text-[11px]",
                    isComplete
                      ? "bg-brand-green text-white"
                      : isActive
                        ? "bg-brand-blue text-white"
                        : "bg-slate-100 text-muted"
                  ].join(" ")}
                >
                  {isComplete ? <CheckCircle2 className="h-3.5 w-3.5" /> : index + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
            );
          })}
        </nav>

        <section className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-emerald-50 text-brand-green">
                  <MessageSquareText className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-xs font-extrabold uppercase text-brand-green">AI setup response</p>
                  <h2 className="text-xl font-extrabold">{steps[activeIndex].label}</h2>
                </div>
              </div>
              <Badge className="w-fit bg-slate-50 text-muted ring-1 ring-slate-200">
                Step {activeIndex + 1} of {steps.length}
              </Badge>
            </div>

            <div className="border-t border-slate-100 p-5">{renderStep()}</div>

            <div className="flex flex-col gap-3 border-t border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">
              <Button disabled={activeIndex === 0} type="button" variant="outline" onClick={goBack}>
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {activeStep === "review" ? (
                <Button
                  className="px-5"
                  disabled={isLaunching || !validation.valid}
                  type="button"
                  onClick={launchCampaign}
                >
                  <Rocket className="h-4 w-4" />
                  {isLaunching ? "Submitting..." : "Launch Campaign"}
                </Button>
              ) : (
                <Button className="px-5" type="button" onClick={goNext}>
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <aside className="grid content-start gap-4 lg:sticky lg:top-20 lg:self-start">
            <section className="rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-brand-blue" />
                <div>
                  <p className="text-xs font-extrabold uppercase text-brand-green">Protected launch path</p>
                  <h2 className="text-base font-extrabold">Server-side TrafficHaus calls</h2>
                </div>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted">
                API key stays in Next.js route handlers. The browser only sends the draft campaign.
              </p>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white/90 p-4 shadow-sm">
              <p className="text-xs font-extrabold uppercase text-brand-green">Brief context</p>
              <div className="mt-3 grid gap-2">
                <ContextRow label="Objective" value={draft.objective.replace("_", " ")} />
                <ContextRow label="Geo" value={payload.geo || "Missing"} />
                <ContextRow label="Devices" value={payload.device_type || "Missing"} />
                <ContextRow label="Bid" value={`${payload.bid_type.toUpperCase()} $${payload.bid_amount || "0"}`} />
              </div>
            </section>

            <AIAssistantPanel draft={draft} updateDraft={updateDraft} />
            <CampaignSummary payload={payload} validation={validation} />
          </aside>
        </section>
      </div>
    </main>
  );
}

function PromptChip({
  icon,
  label,
  onClick
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      className="inline-flex min-h-9 items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 transition hover:border-brand-blue/30 hover:bg-[#eef6ff]"
      type="button"
      onClick={onClick}
    >
      {icon}
      {label}
    </button>
  );
}

function ContextRow({
  label,
  value
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 px-3 py-2 text-sm">
      <span className="font-bold text-muted">{label}</span>
      <span className="max-w-[10rem] truncate text-right font-extrabold capitalize text-ink">{value}</span>
    </div>
  );
}
