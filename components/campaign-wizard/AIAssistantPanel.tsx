"use client";

import { Lightbulb, Sparkles } from "lucide-react";

import type { CampaignStepProps } from "@/types/campaign";

export function AIAssistantPanel({ draft, updateDraft }: CampaignStepProps) {
  const applyCreativeSuggestion = () => {
    updateDraft({
      headline: `${draft.campaignName.replace(/\s+-\s+.*/, "")}: faster campaign launch`,
      description:
        "Plan, target, and submit native campaigns with a TrafficHaus-ready payload built from your brief.",
      keywords: Array.from(
        new Set([...draft.keywords, "buyer intent", "campaign automation", "native demand"])
      )
    });
  };

  const applyBudgetSuggestion = () => {
    updateDraft({
      bidType: "cpm",
      bidAmount: "1.30",
      dailyBudget: "100",
      totalBudget: "1000",
      frequencyCapType: "site",
      frequencyCapValue: 2
    });
  };

  return (
    <section className="rounded-lg border border-slate-200 bg-white/85 p-4 shadow-sm backdrop-blur">
      <div className="flex items-center gap-2">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-[#eef6ff] text-brand-blue">
          <Sparkles className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-extrabold uppercase text-brand-green">Copilot</p>
          <h2 className="text-base font-extrabold">Next best moves</h2>
        </div>
      </div>

      <div className="mt-4 grid gap-3">
        <button
          className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-brand-blue/30 hover:bg-[#eef6ff]"
          type="button"
          onClick={applyCreativeSuggestion}
        >
          <span className="flex items-center gap-2 text-sm font-extrabold text-ink">
            <Lightbulb className="h-4 w-4 text-brand-amber" />
            Sharpen creative
          </span>
          <span className="mt-2 block text-sm leading-6 text-muted">
            Headline, description, and intent keywords tuned for native placements.
          </span>
        </button>

        <button
          className="rounded-lg border border-slate-200 bg-slate-50 p-3 text-left transition hover:border-brand-green/30 hover:bg-emerald-50"
          type="button"
          onClick={applyBudgetSuggestion}
        >
          <span className="flex items-center gap-2 text-sm font-extrabold text-ink">
            <Lightbulb className="h-4 w-4 text-brand-amber" />
            Reset launch budget
          </span>
          <span className="mt-2 block text-sm leading-6 text-muted">
            CPM bid, daily budget, total budget, and frequency cap for a first test.
          </span>
        </button>
      </div>
    </section>
  );
}
