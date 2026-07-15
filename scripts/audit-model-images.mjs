#!/usr/bin/env node

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_MODELS = path.join(process.cwd(), "data", "traffichaus-models.json");
const DEFAULT_MANUAL_OVERRIDES = path.join(process.cwd(), "data", "model-promotion-overrides.json");
const DEFAULT_OUT = path.join(process.cwd(), "data", "model-image-overrides.json");
const BROWSER_USER_AGENT =
  "Mozilla/5.0 (compatible; OnlyCreatorAwardsImageAudit/1.0; +https://onlycreatorawards.com)";
const PLACEHOLDERS = new Set(["n/a", "na", "none", "null", "undefined", "-", "--"]);

function parseArgs(argv) {
  return argv.reduce(
    (args, item) => {
      if (item === "--dry-run") return { ...args, dryRun: true };
      if (!item.startsWith("--")) return args;
      const [rawKey, ...rawValue] = item.slice(2).split("=");
      return { ...args, [rawKey]: rawValue.length ? rawValue.join("=") : "true" };
    },
    {
      models: process.env.MODEL_DIRECTORY_CACHE_PATH || DEFAULT_MODELS,
      manualOverrides: process.env.MODEL_PROMOTION_OVERRIDES_PATH || DEFAULT_MANUAL_OVERRIDES,
      out: process.env.MODEL_IMAGE_OVERRIDES_PATH || DEFAULT_OUT,
      limit: process.env.MODEL_IMAGE_AUDIT_LIMIT || "1000",
      concurrency: process.env.MODEL_IMAGE_AUDIT_CONCURRENCY || "8",
      timeoutMs: process.env.MODEL_IMAGE_AUDIT_TIMEOUT_MS || "6000",
      dryRun: false
    }
  );
}

async function readJson(filePath, fallback) {
  if (!existsSync(filePath)) return fallback;
  return JSON.parse(await readFile(filePath, "utf8"));
}

function cleanText(value) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (!text || PLACEHOLDERS.has(text.toLowerCase())) return null;
  return text;
}

function safeUrl(value) {
  const text = cleanText(value);
  if (!text) return null;

  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:" ? text : null;
  } catch {
    return null;
  }
}

function metric(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = String(value ?? "").toLowerCase().replace(/,/g, "");
  const match = text.match(/-?\d+(\.\d+)?/);
  if (!match) return 0;
  const parsed = Number(match[0]);
  if (!Number.isFinite(parsed)) return 0;
  if (text.includes("m")) return parsed * 1_000_000;
  if (text.includes("k")) return parsed * 1_000;
  return parsed;
}

function audienceCount(value) {
  const text = String(value ?? "").replace(/,/g, "").trim();
  const match = text.match(/(\d+(?:\.\d+)?)\s*([kmb])?\+?\s*(?:subs?|subscribers?|fans?|followers?)\b/i);
  if (!match) return 0;
  const parsed = Number(match[1]);
  if (!Number.isFinite(parsed)) return 0;
  const multiplier = match[2]?.toLowerCase();
  if (multiplier === "b") return parsed * 1_000_000_000;
  if (multiplier === "m") return parsed * 1_000_000;
  if (multiplier === "k") return parsed * 1_000;
  return parsed;
}

function logMetric(value) {
  return value > 0 ? Math.log10(value + 1) : 0;
}

function candidateScore(model, manualControl = {}) {
  const sourceFanCount =
    metric(model.sourceFanCount) || audienceCount(model.sourceName) || audienceCount(model.rawDetails);
  const sourceOrderBoost = Math.max(0, 200 - (metric(model.sourceSort) || metric(model.sourceOrder) + 1)) * 0.7;
  const adjustment = Number.isFinite(manualControl.scoreAdjustment) ? Number(manualControl.scoreAdjustment) : 0;
  const suppressedPenalty = manualControl.suppressed ? 100_000 : 0;

  return (
    Math.min(metric(model.popularityScore), 1000) +
    logMetric(sourceFanCount) * 430 +
    logMetric(metric(model.sourceLikeCount)) * 75 +
    logMetric(metric(model.sourcePostCount)) * 24 +
    logMetric(metric(model.sourceVideoCount)) * 12 +
    logMetric(metric(model.sourceImageCount)) * 8 +
    metric(model.clickCount) * 4 +
    metric(model.viewCount) * 1.5 +
    sourceOrderBoost +
    adjustment -
    suppressedPenalty
  );
}

async function probeImage(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  async function request(method) {
    const headers = {
      Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
      "User-Agent": BROWSER_USER_AGENT
    };

    if (method === "GET") {
      headers.Range = "bytes=0-0";
    }

    const response = await fetch(url, {
      method,
      redirect: "follow",
      signal: controller.signal,
      headers
    });
    const contentType = response.headers.get("content-type") ?? "";
    await response.body?.cancel();
    return {
      ok: (response.ok || response.status === 206) && contentType.toLowerCase().startsWith("image/"),
      definitive: true,
      status: response.status,
      contentType
    };
  }

  try {
    const head = await request("HEAD");
    if (head.ok || ![403, 405, 501].includes(head.status)) return head;
    return await request("GET");
  } catch (error) {
    return {
      ok: false,
      definitive: false,
      status: 0,
      contentType: error instanceof Error ? error.name : "request-error"
    };
  } finally {
    clearTimeout(timer);
  }
}

function autoBrokenControl(existing, reason) {
  const currentAdjustment = Number.isFinite(existing.scoreAdjustment) ? Number(existing.scoreAdjustment) : 0;
  const auditNote = `Image audit failed: ${reason}. Auto-suppressed from prominent placements.`;
  const notes = [...new Set([existing.notes, auditNote].filter(Boolean).join(" | ").split(" | "))].join(" | ");

  return {
    ...existing,
    label: existing.label ?? "Auto broken image",
    scoreAdjustment: Math.min(currentAdjustment, -250000),
    suppressed: true,
    brokenImage: true,
    homepageBlocked: true,
    notes
  };
}

async function runPool(items, concurrency, worker) {
  const results = [];
  let index = 0;

  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      while (index < items.length) {
        const currentIndex = index;
        index += 1;
        results[currentIndex] = await worker(items[currentIndex], currentIndex);
      }
    })
  );

  return results;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const limit = Math.max(1, Number(args.limit) || 1000);
  const concurrency = Math.max(1, Math.min(24, Number(args.concurrency) || 8));
  const timeoutMs = Math.max(1000, Number(args.timeoutMs) || 6000);
  const modelCache = await readJson(path.resolve(args.models), { models: [] });
  const manualOverrides = await readJson(path.resolve(args.manualOverrides), { models: {} });
  const imageOverrides = await readJson(path.resolve(args.out), {
    comment: "Auto-generated broken image controls. This file is safe for production cron to update.",
    models: {}
  });
  const manualControls = manualOverrides.models ?? {};
  const existingAutoControls = imageOverrides.models ?? {};

  const candidates = (modelCache.models ?? [])
    .filter((model) => model && model.status !== "REMOVED" && model.status !== "HIDDEN")
    .filter((model) => !manualControls[model.slug]?.hidden)
    .map((model) => ({
      model,
      url: safeUrl(model.profileImageUrl),
      score: candidateScore(model, manualControls[model.slug] ?? {})
    }))
    .filter((candidate) => candidate.url)
    .sort((first, second) => second.score - first.score || metric(first.model.sourceOrder) - metric(second.model.sourceOrder))
    .slice(0, limit);

  const checked = await runPool(candidates, concurrency, async (candidate) => {
    const result = await probeImage(candidate.url, timeoutMs);
    return {
      ...candidate,
      result
    };
  });

  const broken = checked.filter((item) => item.result.definitive && !item.result.ok);
  const indeterminate = checked.filter((item) => !item.result.definitive);
  const next = {
    comment: "Auto-generated broken image controls. This file is safe for production cron to update.",
    generatedAt: new Date().toISOString(),
    models: { ...existingAutoControls }
  };

  broken.forEach(({ model, result }) => {
    next.models[model.slug] = autoBrokenControl(
      next.models[model.slug] ?? {},
      `HTTP ${result.status || "error"} ${result.contentType || ""}`.trim()
    );
  });

  if (!args.dryRun) {
    await mkdir(path.dirname(path.resolve(args.out)), { recursive: true });
    await writeFile(path.resolve(args.out), `${JSON.stringify(next, null, 2)}\n`, "utf8");
  }

  console.log(
    JSON.stringify(
      {
        ok: true,
        checked: checked.length,
        broken: broken.length,
        indeterminate: indeterminate.length,
        outputPath: path.resolve(args.out),
        dryRun: Boolean(args.dryRun),
        brokenSlugs: broken.slice(0, 25).map((item) => item.model.slug)
      },
      null,
      2
    )
  );
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }));
  process.exitCode = 1;
});
