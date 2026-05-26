"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";

import type { ApiResult, CampaignStepProps, ExtractedProduct } from "@/types/campaign";

const toDisplayUrl = (value: string) =>
  value
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

export function OfferStep({ draft, updateDraft }: CampaignStepProps) {
  const [extractState, setExtractState] = useState<{
    status: "idle" | "loading" | "success" | "error";
    message: string;
  }>({ status: "idle", message: "Paste a product or creative URL to pull product details." });

  const applyExtractedProduct = (product: ExtractedProduct) => {
    const displayUrl = toDisplayUrl(product.sourceUrl);
    const productName = product.title.split("|")[0].split("-")[0].trim() || displayUrl;

    updateDraft({
      productSourceUrl: product.sourceUrl,
      productName,
      extractedProduct: product,
      landingPageUrl: product.sourceUrl,
      displayUrl,
      campaignName: `${productName} - AI Click Campaign`,
      offerDescription: product.description,
      creativeUrl: product.imageUrl || draft.creativeUrl,
      headline: `See why people choose ${productName}`,
      description: product.description.slice(0, 150),
      keywords: Array.from(new Set([...draft.keywords, productName.toLowerCase(), displayUrl]))
    });
  };

  const pullProductDetails = async () => {
    const sourceUrl = draft.productSourceUrl.trim() || draft.landingPageUrl.trim();
    if (!sourceUrl) {
      setExtractState({ status: "error", message: "Add a product or creative URL first." });
      return;
    }

    setExtractState({ status: "loading", message: "Pulling product details from the URL..." });

    try {
      const response = await fetch("/api/creative/extract-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: sourceUrl })
      });
      const result = (await response.json()) as ApiResult<ExtractedProduct>;

      if (!response.ok || !result.ok || !result.data) {
        setExtractState({
          status: "error",
          message: result.message || "Unable to pull product details from that URL."
        });
        return;
      }

      applyExtractedProduct(result.data);
      setExtractState({ status: "success", message: result.message });
    } catch (error) {
      setExtractState({
        status: "error",
        message: error instanceof Error ? error.message : "Unable to pull product details from that URL."
      });
    }
  };

  return (
    <div className="grid gap-5">
      <section className="rounded-lg border border-line bg-slate-50 p-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
          <label className="grid flex-1 gap-2">
            <span className="text-sm font-extrabold uppercase text-muted">Product or creative URL</span>
            <input
              className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
              inputMode="url"
              placeholder="https://yourstore.com/product-or-creative"
              value={draft.productSourceUrl}
              onChange={(event) => updateDraft({ productSourceUrl: event.target.value })}
            />
          </label>
          <button
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-blue px-4 font-extrabold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={extractState.status === "loading"}
            type="button"
            onClick={pullProductDetails}
          >
            {extractState.status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Pull Product
          </button>
        </div>
        <p
          className={[
            "mt-3 text-sm leading-6",
            extractState.status === "success"
              ? "text-emerald-700"
              : extractState.status === "error"
                ? "text-rose-700"
                : "text-muted"
          ].join(" ")}
        >
          {extractState.message}
        </p>
        {draft.extractedProduct.title ? (
          <div className="mt-3 rounded-lg border border-emerald-200 bg-white p-3 text-sm">
            <strong className="block text-ink">{draft.extractedProduct.title}</strong>
            <span className="mt-1 block leading-6 text-muted">{draft.extractedProduct.description}</span>
          </div>
        ) : null}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-extrabold uppercase text-muted">Product landing page</span>
          <input
            className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
            inputMode="url"
            placeholder="https://yourstore.com/product"
            value={draft.landingPageUrl}
            onChange={(event) =>
              updateDraft({
                landingPageUrl: event.target.value,
                displayUrl: toDisplayUrl(event.target.value)
              })
            }
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-extrabold uppercase text-muted">Product name</span>
          <input
            className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
            value={draft.productName}
            onChange={(event) =>
              updateDraft({
                productName: event.target.value,
                campaignName: `${event.target.value || "Product"} - AI Click Campaign`
              })
            }
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-extrabold uppercase text-muted">Display domain</span>
        <input
          className="min-h-11 rounded-lg border border-line bg-white px-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
          value={draft.displayUrl}
          onChange={(event) => updateDraft({ displayUrl: event.target.value })}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-extrabold uppercase text-muted">Product / offer notes</span>
        <textarea
          className="min-h-32 rounded-lg border border-line bg-white px-3 py-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
          placeholder="What is the product, who should click, and what makes it worth attention?"
          value={draft.offerDescription}
          onChange={(event) => updateDraft({ offerDescription: event.target.value })}
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-extrabold uppercase text-muted">Restrictions</span>
        <textarea
          className="min-h-24 rounded-lg border border-line bg-white px-3 py-3 outline-none focus:border-brand-green focus:ring-4 focus:ring-emerald-100"
          placeholder="Claims to avoid, geos to exclude, compliance notes, brand rules, or audience restrictions."
          value={draft.restrictions}
          onChange={(event) => updateDraft({ restrictions: event.target.value })}
        />
      </label>

      <section className="rounded-lg border border-line bg-slate-50 p-4">
        <span className="text-sm font-extrabold uppercase text-muted">Creative approval</span>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <button
            className={[
              "rounded-lg border p-4 text-left transition",
              draft.customerApprovalMode === "auto_run"
                ? "border-brand-green bg-emerald-50"
                : "border-line bg-white hover:border-emerald-200"
            ].join(" ")}
            type="button"
            onClick={() => updateDraft({ customerApprovalMode: "auto_run" })}
          >
            <strong className="block">Run for clicks</strong>
            <span className="mt-2 block text-sm leading-6 text-muted">
              CPCAdvertising.com generates ads and starts driving clicks without extra sign-off.
            </span>
          </button>
          <button
            className={[
              "rounded-lg border p-4 text-left transition",
              draft.customerApprovalMode === "review_first"
                ? "border-brand-green bg-emerald-50"
                : "border-line bg-white hover:border-emerald-200"
            ].join(" ")}
            type="button"
            onClick={() => updateDraft({ customerApprovalMode: "review_first" })}
          >
            <strong className="block">Review ads first</strong>
            <span className="mt-2 block text-sm leading-6 text-muted">
              Generate ad options for customer approval before partner-platform submission.
            </span>
          </button>
        </div>
      </section>
    </div>
  );
}
