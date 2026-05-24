"use client";

import { useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Rocket,
  Sparkles
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
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
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
    <main className="min-h-screen px-4 py-5 text-ink sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[280px_minmax(0,1fr)_330px]">
        <Card className="bg-white/80 p-4">
          <a className="flex items-center gap-3" href="/campaigns/new" aria-label="CPCAdvertising.com">
            <span className="grid h-12 w-12 place-items-center rounded-lg bg-gradient-to-br from-brand-green to-brand-blue text-sm font-extrabold text-white">
              CPC
            </span>
            <span>
              <strong className="block text-base">CPCAdvertising.com</strong>
              <span className="block text-sm text-muted">Campaign setup</span>
            </span>
          </a>

          <nav className="mt-6 grid gap-2" aria-label="Campaign setup steps">
            {steps.map((step, index) => {
              const isActive = step.id === activeStep;
              const isComplete = index < activeIndex;
              return (
                <button
                  key={step.id}
                  className={[
                    "flex min-h-11 items-center gap-3 rounded-lg px-3 text-left text-sm font-semibold transition",
                    isActive
                      ? "bg-emerald-50 text-ink"
                      : "text-muted hover:bg-slate-50 hover:text-ink"
                  ].join(" ")}
                  type="button"
                  onClick={() => goToStep(step.id)}
                >
                  <span
                    className={[
                      "grid h-7 w-7 shrink-0 place-items-center rounded-md border text-xs font-extrabold",
                      isComplete
                        ? "border-brand-green bg-brand-green text-white"
                        : isActive
                          ? "border-brand-green text-brand-green"
                          : "border-line text-muted"
                    ].join(" ")}
                  >
                    {isComplete ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                  </span>
                  {step.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-6 rounded-lg border border-line bg-slate-50 p-4 text-sm text-muted">
            <div className="flex items-center gap-2 font-bold text-ink">
              <AlertCircle className="h-4 w-4 text-brand-amber" />
              API key protected
            </div>
            <p className="mt-2 leading-6">
              TrafficHaus requests run through Next.js route handlers. Local mode uses mock responses.
            </p>
          </div>
        </Card>

        <Card className="min-w-0">
          <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase text-brand-green">TrafficHaus campaign wizard</p>
              <h1 className="mt-2 text-2xl font-extrabold leading-tight sm:text-3xl">
                {steps[activeIndex].label}
              </h1>
            </div>
            <Badge className="gap-2">
              <Sparkles className="h-4 w-4" />
              AI-assisted setup
            </Badge>
          </CardHeader>

          <CardContent>{renderStep()}</CardContent>

          <CardFooter className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button
              disabled={activeIndex === 0}
              type="button"
              variant="outline"
              onClick={goBack}
            >
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
          </CardFooter>
        </Card>

        <aside className="grid gap-5 lg:content-start">
          <AIAssistantPanel draft={draft} updateDraft={updateDraft} />
          <CampaignSummary payload={payload} validation={validation} />
        </aside>
      </div>
    </main>
  );
}
