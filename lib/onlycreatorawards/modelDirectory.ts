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

function readJson<T>(filePath: string, fallback: T): T {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

function titleizeSlug(slug: string) {
  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
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
  return sourceOrdered(getModelDirectoryCache().models.filter(visible));
}

export function getImportedModelBySlug(slug: string) {
  return getImportedModels().find((model) => model.slug === slug);
}

export function getModelDirectorySections() {
  const cache = getModelDirectoryCache();
  const cachedSections = cache.sections?.length ? cache.sections : [];
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
      category: model.rawCategory ?? "Uncategorized",
      popularity: model.popularityScore,
      clicks: model.clickCount,
      views: model.viewCount
    }));
}
