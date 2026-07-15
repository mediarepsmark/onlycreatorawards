import "server-only";

import fs from "node:fs";
import path from "node:path";

import {
  defaultModelAudienceSelection,
  modelAudienceValues,
  type ModelAudience
} from "@/lib/onlycreatorawards/audience";

export type ImportedModel = {
  id: string;
  source: string;
  sourceOrder: number;
  sourceSort: number;
  slug: string;
  displayName: string;
  sourceName: string;
  username: string | null;
  handle: string | null;
  profileImageUrl: string | null;
  imageAltText: string | null;
  onlyfansUrl: string | null;
  clickUrl: string | null;
  twitterUrl: string | null;
  tiktokUrl: string | null;
  instagramUrl: string | null;
  price: string | null;
  country: string | null;
  region: string | null;
  city: string | null;
  gender: string | null;
  rawCategory: string | null;
  rawDetails: string | null;
  sourceKeywords: string[];
  categorySlugs: string[];
  categoryLabels: string[];
  status: "ACTIVE" | "HIDDEN" | "REMOVED" | "NEEDS_REVIEW" | string;
  imageStatus: string;
  lastImportedAt: string;
  sourceFanCount: number;
  sourceLikeCount: number;
  sourcePostCount: number;
  sourceVideoCount: number;
  sourceImageCount: number;
  viewCount: number;
  clickCount: number;
  popularityScore: number;
};

export type ModelDirectorySection = {
  slug: string;
  label: string;
  count: number;
  href: string;
};

export type ModelPromotionControl = {
  label?: string;
  scoreAdjustment?: number;
  sponsored?: boolean;
  suppressed?: boolean;
  hidden?: boolean;
  brokenImage?: boolean;
  homepageBlocked?: boolean;
  notes?: string;
};

type ModelDirectoryCache = {
  importedAt: string;
  sourceUrl: string;
  source: string;
  checksum: string;
  rawCount: number;
  parsedCount: number;
  truncated: boolean;
  parser: string;
  sections: ModelDirectorySection[];
  models: ImportedModel[];
};

type ModelDirectoryOverrides = {
  sections?: Record<string, string[]>;
};

type ModelPromotionOverrides = {
  comment?: string;
  homepage?: {
    hero?: string[];
    featured?: string[];
    leaderboard?: string[];
  };
  models?: Record<string, ModelPromotionControl>;
};

const cachePath =
  process.env.MODEL_DIRECTORY_CACHE_PATH || path.join(process.cwd(), "data", "traffichaus-models.json");
const overridesPath =
  process.env.MODEL_DIRECTORY_OVERRIDES_PATH || path.join(process.cwd(), "data", "model-section-overrides.json");
const promotionOverridesPath =
  process.env.MODEL_PROMOTION_OVERRIDES_PATH || path.join(process.cwd(), "data", "model-promotion-overrides.json");
const imageAuditOverridesPath =
  process.env.MODEL_IMAGE_OVERRIDES_PATH || path.join(process.cwd(), "data", "model-image-overrides.json");
const jsonCache = new Map<string, { mtimeMs: number; size: number; value: unknown }>();
const normalizedModelsCache = new WeakMap<ModelDirectoryCache, ImportedModel[]>();
const audienceCache = new WeakMap<ImportedModel, ModelAudience>();
const organicScoreCache = new WeakMap<ImportedModel, number>();
const effectiveScoreCache = new WeakMap<ImportedModel, Map<string, number>>();
const popularityModelsCache = new WeakMap<ModelDirectoryCache, Map<string, ImportedModel[]>>();
const placeholderTextValues = new Set(["n/a", "na", "none", "null", "undefined", "-", "--"]);
const promotionOverridesTtlMs = 5_000;
let promotionOverridesMemo: { loadedAt: number; value: ModelPromotionOverrides } | null = null;

function readJson<T>(filePath: string, fallback: T): T {
  try {
    const stat = fs.statSync(filePath);
    const cached = jsonCache.get(filePath);

    if (cached && cached.mtimeMs === stat.mtimeMs && cached.size === stat.size) {
      return cached.value as T;
    }

    const value = JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
    jsonCache.set(filePath, { mtimeMs: stat.mtimeMs, size: stat.size, value });
    return value;
  } catch {
    return fallback;
  }
}

function titleizeSlug(slug: string) {
  if (slug === "uncategorized") return "Amateur";

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function normalizeCategoryText(value: string | null | undefined) {
  const text = value?.trim();
  if (!text) return null;
  return text.toLowerCase() === "uncategorized" ? "Amateur" : text;
}

function cleanNullableText(value: unknown) {
  if (typeof value !== "string") return null;
  const text = value.trim();
  if (!text || placeholderTextValues.has(text.toLowerCase())) return null;
  return text;
}

function cleanImageUrl(value: unknown) {
  const text = cleanNullableText(value);
  if (!text) return null;
  if (text.startsWith("/")) return text;

  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:" ? text : null;
  } catch {
    return null;
  }
}

function normalizedSection(section: ModelDirectorySection): ModelDirectorySection {
  return {
    ...section,
    label: titleizeSlug(section.slug),
    href: section.slug === "all" ? "/models" : `/models/category/${section.slug}`
  };
}

function audienceCountFromText(value: string | null | undefined) {
  const text = value?.replace(/,/g, "").trim();
  if (!text) return 0;

  const match = text.match(/(\d+(?:\.\d+)?)\s*([kmb])?\+?\s*(?:subs?|subscribers?|fans?|followers?)\b/i);
  if (!match) return 0;

  const parsed = Number(match[1]);
  if (!Number.isFinite(parsed)) return 0;

  const multiplier = match[2]?.toLowerCase();
  if (multiplier === "b") return Math.round(parsed * 1_000_000_000);
  if (multiplier === "m") return Math.round(parsed * 1_000_000);
  if (multiplier === "k") return Math.round(parsed * 1_000);
  return Math.round(parsed);
}

function normalizedCategoryLabels(model: ImportedModel, categorySlugs: string[]) {
  return categorySlugs.map((slug, index) => normalizeCategoryText(model.categoryLabels[index]) ?? titleizeSlug(slug));
}

function modelAudienceHaystack(model: ImportedModel) {
  return [
    model.gender,
    model.rawCategory,
    model.rawDetails,
    model.displayName,
    model.sourceName,
    model.username,
    ...model.sourceKeywords,
    ...model.categorySlugs,
    ...model.categoryLabels
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

export function getImportedModelAudience(model: ImportedModel): ModelAudience {
  const cached = audienceCache.get(model);
  if (cached) return cached;

  const haystack = modelAudienceHaystack(model);
  let audience: ModelAudience = "women";

  if (/(^|[^a-z])(trans|transgender|transsexual|shemale|ladyboy|mtf|ftm|ts)([^a-z]|$)/i.test(haystack)) {
    audience = "trans";
  } else if (/(^|[^a-z])(male|man|men|guy|guys|boy|boys|twink|daddy|hunk|gay|bear|jock)([^a-z]|$)/i.test(haystack)) {
    audience = "men";
  }

  audienceCache.set(model, audience);
  return audience;
}

export function filterModelsByAudience(models: ImportedModel[], audience?: ModelAudience[]) {
  if (!audience) return models;

  const selected = audience.length ? audience : defaultModelAudienceSelection;
  if (modelAudienceValues.every((value) => selected.includes(value))) return models;

  return models.filter((model) => selected.includes(getImportedModelAudience(model)));
}

function normalizeImportedModel(model: ImportedModel): ImportedModel {
  const categorySlugs = model.categorySlugs.length ? model.categorySlugs : ["uncategorized"];
  const control = getModelPromotionControl(model.slug);
  const profileImageUrl = control.brokenImage ? null : cleanImageUrl(model.profileImageUrl);
  const sourceKeywords = model.sourceKeywords.length
    ? model.sourceKeywords.map((keyword) => normalizeCategoryText(keyword) ?? "Amateur")
    : normalizedCategoryLabels(model, categorySlugs);
  const sourceFanCount =
    model.sourceFanCount ||
    audienceCountFromText(model.sourceName) ||
    audienceCountFromText(model.rawDetails) ||
    0;

  return {
    ...model,
    rawCategory: normalizeCategoryText(model.rawCategory),
    profileImageUrl,
    imageStatus: control.brokenImage ? "BROKEN_IMAGE" : profileImageUrl ? model.imageStatus : "MISSING_IMAGE",
    sourceKeywords,
    categorySlugs,
    categoryLabels: normalizedCategoryLabels(model, categorySlugs),
    sourceFanCount
  };
}

function emptyCache(): ModelDirectoryCache {
  return {
    importedAt: "",
    sourceUrl: "",
    source: "traffichaus",
    checksum: "",
    rawCount: 0,
    parsedCount: 0,
    truncated: false,
    parser: "empty",
    sections: [],
    models: []
  };
}

function visible(model: ImportedModel) {
  const control = getModelPromotionControl(model.slug);
  return model.status !== "REMOVED" && model.status !== "HIDDEN" && !control.hidden;
}

function sourceOrdered(models: ImportedModel[]) {
  return [...models].sort((first, second) => first.sourceOrder - second.sourceOrder);
}

function uniqueBySlug(models: ImportedModel[]) {
  const seen = new Set<string>();

  return models.filter((model) => {
    if (seen.has(model.slug)) return false;
    seen.add(model.slug);
    return true;
  });
}

function logMetric(value: number) {
  return value > 0 ? Math.log10(value + 1) : 0;
}

function audienceKey(audience?: ModelAudience[]) {
  return audience?.length ? modelAudienceValues.filter((value) => audience.includes(value)).join(",") : "all";
}

export function getImportedModelOrganicScore(model: ImportedModel) {
  const cached = organicScoreCache.get(model);
  if (typeof cached === "number") return cached;

  const sourceOrderBoost = Math.max(0, 200 - (model.sourceSort || model.sourceOrder + 1)) * 0.7;

  const score = Number(
    (
      Math.min(model.popularityScore, 1000) +
      logMetric(model.sourceFanCount) * 430 +
      logMetric(model.sourceLikeCount) * 75 +
      logMetric(model.sourcePostCount) * 24 +
      logMetric(model.sourceVideoCount) * 12 +
      logMetric(model.sourceImageCount) * 8 +
      model.clickCount * 4 +
      model.viewCount * 1.5 +
      sourceOrderBoost
    ).toFixed(2)
  );
  organicScoreCache.set(model, score);
  return score;
}

export function getImportedModelEffectiveScore(model: ImportedModel, audience?: ModelAudience[]) {
  const key = audienceKey(audience);
  const cachedByAudience = effectiveScoreCache.get(model);
  const cached = cachedByAudience?.get(key);
  if (typeof cached === "number") return cached;

  const control = getModelPromotionControl(model.slug);
  const adjustment = Number.isFinite(control.scoreAdjustment) ? Number(control.scoreAdjustment) : 0;
  const suppressPenalty = control.suppressed ? 100_000 : 0;
  const brokenImagePenalty = control.brokenImage || model.imageStatus === "MISSING_IMAGE" || model.imageStatus === "BROKEN_IMAGE" ? 2_500 : 0;
  const womenPriorityBoost = audience && !audience.includes("men") && getImportedModelAudience(model) === "women" ? 4_000 : 0;

  const score = Number((getImportedModelOrganicScore(model) + adjustment + womenPriorityBoost - suppressPenalty - brokenImagePenalty).toFixed(2));
  const nextCache = cachedByAudience ?? new Map<string, number>();
  nextCache.set(key, score);
  effectiveScoreCache.set(model, nextCache);
  return score;
}

function popularityOrdered(models: ImportedModel[], audience?: ModelAudience[]) {
  return [...models].sort(
    (first, second) =>
      getImportedModelEffectiveScore(second, audience) - getImportedModelEffectiveScore(first, audience) ||
      second.sourceFanCount - first.sourceFanCount ||
      second.clickCount - first.clickCount ||
      first.sourceOrder - second.sourceOrder
  );
}

function getPopularityOrderedImportedModels(audience?: ModelAudience[]) {
  const cache = getModelDirectoryCache();
  const key = audienceKey(audience);
  const cachedByAudience = popularityModelsCache.get(cache);
  const cached = cachedByAudience?.get(key);
  if (cached) return cached;

  const ordered = popularityOrdered(filterModelsByAudience(getImportedModels(), audience), audience);
  const nextCache = cachedByAudience ?? new Map<string, ImportedModel[]>();
  nextCache.set(key, ordered);
  popularityModelsCache.set(cache, nextCache);
  return ordered;
}

function slugTerms(slug: string) {
  return slug
    .split("-")
    .map((term) => term.trim().toLowerCase())
    .filter(Boolean);
}

function matchesSection(model: ImportedModel, slug: string) {
  if (slug === "all") return true;
  if (model.categorySlugs.includes(slug)) return true;

  const terms = slugTerms(slug);
  if (!terms.length) return false;
  const haystack = [model.displayName, model.sourceName, model.username, model.rawCategory, model.rawDetails]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return terms.every((term) => haystack.includes(term));
}

function getOverrides() {
  return readJson<ModelDirectoryOverrides>(overridesPath, { sections: {} });
}

function getPromotionOverrides() {
  if (promotionOverridesMemo && Date.now() - promotionOverridesMemo.loadedAt < promotionOverridesTtlMs) {
    return promotionOverridesMemo.value;
  }

  const manual = readJson<ModelPromotionOverrides>(promotionOverridesPath, { homepage: {}, models: {} });
  const imageAudit = readJson<ModelPromotionOverrides>(imageAuditOverridesPath, { homepage: {}, models: {} });
  const models: Record<string, ModelPromotionControl> = { ...(manual.models ?? {}) };

  Object.entries(imageAudit.models ?? {}).forEach(([slug, control]) => {
    const existing = models[slug] ?? {};
    models[slug] = {
      ...existing,
      ...control,
      label: existing.label ?? control.label,
      notes: [existing.notes, control.notes].filter(Boolean).join(" | ") || undefined
    };
  });

  const value = {
    ...manual,
    models
  };
  promotionOverridesMemo = { loadedAt: Date.now(), value };
  return value;
}

export function getModelPromotionControl(slug: string): ModelPromotionControl {
  return getPromotionOverrides().models?.[slug] ?? {};
}

function applyOverrides(sectionSlug: string, models: ImportedModel[], audience?: ModelAudience[]) {
  const overrides = getOverrides().sections ?? {};
  const slugs = [...(overrides[sectionSlug] ?? []), ...(sectionSlug !== "all" ? overrides.all ?? [] : [])]
    .filter(Boolean)
    .slice(0, 3);
  if (!slugs.length) return popularityOrdered(models, audience);

  const bySlug = new Map(models.map((model) => [model.slug, model]));
  const pinned = slugs.map((slug) => bySlug.get(slug)).filter((model): model is ImportedModel => Boolean(model));
  const pinnedSlugs = new Set(pinned.map((model) => model.slug));
  const rest = popularityOrdered(models.filter((model) => !pinnedSlugs.has(model.slug)), audience);

  return [...pinned, ...rest];
}

export function getModelDirectoryCache() {
  return readJson<ModelDirectoryCache>(cachePath, emptyCache());
}

export function getImportedModels() {
  const cache = getModelDirectoryCache();
  const cached = normalizedModelsCache.get(cache);
  if (cached) return cached;

  const models = uniqueBySlug(sourceOrdered(cache.models.filter(visible).map(normalizeImportedModel)));
  normalizedModelsCache.set(cache, models);
  return models;
}

export function getImportedModelBySlug(slug: string) {
  return getImportedModels().find((model) => model.slug === slug);
}

export function getModelDirectorySections(audience?: ModelAudience[]) {
  if (audience) {
    const sectionMap = new Map<string, ModelDirectorySection>();

    filterModelsByAudience(getImportedModels(), audience).forEach((model) => {
      model.categorySlugs.forEach((slug) => {
        const existing = sectionMap.get(slug);
        sectionMap.set(slug, {
          slug,
          label: titleizeSlug(slug),
          count: (existing?.count ?? 0) + 1,
          href: `/models/category/${slug}`
        });
      });
    });

    return [...sectionMap.values()].sort((first, second) => second.count - first.count || first.label.localeCompare(second.label));
  }

  const cache = getModelDirectoryCache();
  const cachedSections = cache.sections?.length ? cache.sections.map(normalizedSection) : [];
  const sectionMap = new Map(cachedSections.map((section) => [section.slug, section]));

  getImportedModels().forEach((model) => {
    model.categorySlugs.forEach((slug) => {
      if (sectionMap.has(slug)) return;
      sectionMap.set(slug, {
        slug,
        label: titleizeSlug(slug),
        count: 1,
        href: `/models/category/${slug}`
      });
    });
  });

  return [...sectionMap.values()].sort((first, second) => second.count - first.count || first.label.localeCompare(second.label));
}

export function getModelDirectorySectionBySlug(slug: string, audience?: ModelAudience[]) {
  if (slug === "all") {
    return {
      slug: "all",
      label: "All Models",
      count: audience ? filterModelsByAudience(getImportedModels(), audience).length : getImportedModels().length,
      href: "/models"
    };
  }

  return (
    getModelDirectorySections(audience).find((section) => section.slug === slug) ?? {
      slug,
      label: titleizeSlug(slug),
      count: getModelsForSection(slug, undefined, audience).length,
      href: `/models/category/${slug}`
    }
  );
}

export function getModelsForSection(slug: string, limit?: number, audience?: ModelAudience[]) {
  const models = filterModelsByAudience(
    getImportedModels().filter((model) => matchesSection(model, slug)),
    audience
  );
  const ordered = applyOverrides(slug, models, audience);
  return typeof limit === "number" ? ordered.slice(0, limit) : ordered;
}

export function getTopImportedModels(limit = 12, audience?: ModelAudience[]) {
  return getPopularityOrderedImportedModels(audience).slice(0, limit);
}

function homepageEligible(model: ImportedModel) {
  const control = getModelPromotionControl(model.slug);
  return Boolean(model.profileImageUrl) && model.imageStatus !== "BROKEN_IMAGE" && model.imageStatus !== "MISSING_IMAGE" && !control.homepageBlocked && !control.brokenImage;
}

function pickHomepageModels(slugs: string[], count: number, used: Set<string>, models: ImportedModel[], audience = defaultModelAudienceSelection) {
  const bySlug = new Map(models.map((model) => [model.slug, model]));
  const pinned = slugs
    .map((slug) => bySlug.get(slug))
    .filter((model): model is ImportedModel => Boolean(model && homepageEligible(model) && !used.has(model.slug)));
  const pinnedSlugs = new Set(pinned.map((model) => model.slug));
  const fill = getPopularityOrderedImportedModels(audience).filter((model) => homepageEligible(model) && !used.has(model.slug) && !pinnedSlugs.has(model.slug));
  const picked = [...pinned, ...fill].slice(0, count);
  picked.forEach((model) => used.add(model.slug));
  return picked;
}

export function getHomepageModelPlacements(audience = defaultModelAudienceSelection) {
  const models = filterModelsByAudience(getImportedModels(), audience);
  const homepage = getPromotionOverrides().homepage ?? {};
  const used = new Set<string>();
  const hero = pickHomepageModels(homepage.hero ?? [], 3, used, models, audience);
  const featured = pickHomepageModels(homepage.featured ?? [], 8, used, models, audience);
  const leaderboard = pickHomepageModels(homepage.leaderboard ?? [], 5, used, models, audience);

  return { hero, featured, leaderboard };
}

export function getFeaturedModelForSection(slug: string, audience?: ModelAudience[]) {
  const models = getModelsForSection(slug, undefined, audience);
  return models.find(homepageEligible) ?? models[0];
}

export function getFeaturedModelsForSections(slugs: string[], audience?: ModelAudience[]) {
  const wanted = new Set(slugs);
  const featured = new Map<string, ImportedModel>();

  for (const model of getPopularityOrderedImportedModels(audience)) {
    if (!homepageEligible(model)) continue;

    for (const slug of model.categorySlugs) {
      if (!wanted.has(slug) || featured.has(slug)) continue;
      featured.set(slug, model);
    }

    if (featured.size >= wanted.size) break;
  }

  return featured;
}

export function getImportedModelAudienceStat(model: ImportedModel) {
  if (model.sourceFanCount > 0) return { label: "Fans", value: model.sourceFanCount };
  if (model.sourceLikeCount > 0) return { label: "Likes", value: model.sourceLikeCount };
  if (model.sourcePostCount > 0) return { label: "Posts", value: model.sourcePostCount };
  return { label: "Profile", value: null };
}

export function getModelDirectoryStats() {
  const cache = getModelDirectoryCache();
  return {
    importedAt: cache.importedAt,
    parsedCount: cache.parsedCount,
    rawCount: cache.rawCount,
    sectionCount: getModelDirectorySections().length,
    truncated: cache.truncated,
    parser: cache.parser,
    sourceUrl: cache.sourceUrl
  };
}

export function getAdminModelRows(limit = 100) {
  return popularityOrdered(getImportedModels())
    .slice(0, limit)
    .map((model) => ({
      slug: model.slug,
      id: model.sourceOrder,
      sort: model.sourceSort,
      public: model.status === "ACTIVE",
      name: model.sourceName,
      username: model.username ?? "",
      image: model.imageStatus === "BROKEN_IMAGE" ? "flagged broken" : model.profileImageUrl ? "source image" : "none",
      price: model.price ?? "",
      updatedAt: model.lastImportedAt,
      category: model.rawCategory ?? "Amateur",
      popularity: model.popularityScore,
      organicScore: getImportedModelOrganicScore(model),
      effectiveScore: getImportedModelEffectiveScore(model),
      promotion: getModelPromotionControl(model.slug),
      clicks: model.clickCount,
      views: model.viewCount
    }));
}

export function getModelPromotionAdminSummary() {
  const overrides = getPromotionOverrides();
  const models = getImportedModels();
  const bySlug = new Map(models.map((model) => [model.slug, model]));
  const rows = Object.entries(overrides.models ?? {}).map(([slug, control]) => {
    const model = bySlug.get(slug);

    return {
      slug,
      control,
      model,
      organicScore: model ? getImportedModelOrganicScore(model) : 0,
      effectiveScore: model ? getImportedModelEffectiveScore(model) : 0
    };
  });
  const brokenImageRows = models
    .filter((model) => model.imageStatus === "BROKEN_IMAGE" || model.imageStatus === "MISSING_IMAGE")
    .slice(0, 40);

  return {
    homepage: overrides.homepage ?? {},
    rows,
    brokenImageRows
  };
}
