import "server-only";

import fs from "node:fs";
import path from "node:path";

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

const cachePath =
  process.env.MODEL_DIRECTORY_CACHE_PATH || path.join(process.cwd(), "data", "traffichaus-models.json");
const overridesPath =
  process.env.MODEL_DIRECTORY_OVERRIDES_PATH || path.join(process.cwd(), "data", "model-section-overrides.json");
const jsonCache = new Map<string, { mtimeMs: number; size: number; value: unknown }>();
const normalizedModelsCache = new WeakMap<ModelDirectoryCache, ImportedModel[]>();

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

function normalizeImportedModel(model: ImportedModel): ImportedModel {
  const categorySlugs = model.categorySlugs.length ? model.categorySlugs : ["uncategorized"];
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
  return model.status !== "REMOVED" && model.status !== "HIDDEN";
}

function sourceOrdered(models: ImportedModel[]) {
  return [...models].sort((first, second) => first.sourceOrder - second.sourceOrder);
}

function popularityOrdered(models: ImportedModel[]) {
  return [...models].sort(
    (first, second) =>
      second.clickCount - first.clickCount ||
      second.viewCount - first.viewCount ||
      second.popularityScore - first.popularityScore ||
      first.sourceOrder - second.sourceOrder
  );
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

function applyOverrides(sectionSlug: string, models: ImportedModel[]) {
  const overrides = getOverrides().sections ?? {};
  const slugs = [...(overrides[sectionSlug] ?? []), ...(sectionSlug !== "all" ? overrides.all ?? [] : [])]
    .filter(Boolean)
    .slice(0, 3);
  if (!slugs.length) return popularityOrdered(models);

  const bySlug = new Map(models.map((model) => [model.slug, model]));
  const pinned = slugs.map((slug) => bySlug.get(slug)).filter((model): model is ImportedModel => Boolean(model));
  const pinnedSlugs = new Set(pinned.map((model) => model.slug));
  const rest = popularityOrdered(models.filter((model) => !pinnedSlugs.has(model.slug)));

  return [...pinned, ...rest];
}

export function getModelDirectoryCache() {
  return readJson<ModelDirectoryCache>(cachePath, emptyCache());
}

export function getImportedModels() {
  const cache = getModelDirectoryCache();
  const cached = normalizedModelsCache.get(cache);
  if (cached) return cached;

  const models = sourceOrdered(cache.models.filter(visible).map(normalizeImportedModel));
  normalizedModelsCache.set(cache, models);
  return models;
}

export function getImportedModelBySlug(slug: string) {
  return getImportedModels().find((model) => model.slug === slug);
}

export function getModelDirectorySections() {
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

export function getModelDirectorySectionBySlug(slug: string) {
  if (slug === "all") {
    return {
      slug: "all",
      label: "All Models",
      count: getImportedModels().length,
      href: "/models"
    };
  }

  return (
    getModelDirectorySections().find((section) => section.slug === slug) ?? {
      slug,
      label: titleizeSlug(slug),
      count: getModelsForSection(slug).length,
      href: `/models/category/${slug}`
    }
  );
}

export function getModelsForSection(slug: string, limit?: number) {
  const models = getImportedModels().filter((model) => matchesSection(model, slug));
  const ordered = applyOverrides(slug, models);
  return typeof limit === "number" ? ordered.slice(0, limit) : ordered;
}

export function getTopImportedModels(limit = 12) {
  return popularityOrdered(getImportedModels()).slice(0, limit);
}

export function getFeaturedModelForSection(slug: string) {
  const models = getModelsForSection(slug);
  return models.find((model) => Boolean(model.profileImageUrl)) ?? models[0];
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
  return getImportedModels()
    .slice(0, limit)
    .map((model) => ({
      id: model.sourceOrder,
      sort: model.sourceSort,
      public: model.status === "ACTIVE",
      name: model.sourceName,
      username: model.username ?? "",
      image: model.profileImageUrl ? "source image" : "none",
      price: model.price ?? "",
      updatedAt: model.lastImportedAt,
      category: model.rawCategory ?? "Amateur",
      popularity: model.popularityScore,
      clicks: model.clickCount,
      views: model.viewCount
    }));
}
