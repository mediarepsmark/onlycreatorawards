#!/usr/bin/env node

import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_SOURCE_URL = "https://syndication.traffichaus.com/adserve/index.php?z=960771";
const DEFAULT_OUT = path.join(process.cwd(), "data", "traffichaus-models.json");
const DEFAULT_OVERRIDES = path.join(process.cwd(), "data", "model-section-overrides.json");

function parseArgs(argv) {
  return argv.reduce(
    (args, item) => {
      if (item === "--dry-run") return { ...args, dryRun: true };
      if (item === "--pretty") return { ...args, pretty: true };
      if (item.startsWith("--url=")) return { ...args, url: item.slice("--url=".length) };
      if (item.startsWith("--input=")) return { ...args, input: item.slice("--input=".length) };
      if (item.startsWith("--out=")) return { ...args, out: item.slice("--out=".length) };
      if (item.startsWith("--overrides=")) return { ...args, overrides: item.slice("--overrides=".length) };
      return args;
    },
    {
      url: process.env.TRAFFICHAUS_MODEL_ZONE_URL || DEFAULT_SOURCE_URL,
      input: "",
      out: process.env.MODEL_DIRECTORY_CACHE_PATH || DEFAULT_OUT,
      overrides: process.env.MODEL_DIRECTORY_OVERRIDES_PATH || DEFAULT_OVERRIDES,
      dryRun: false,
      pretty: false
    }
  );
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function isPlaceholderText(value) {
  return ["n/a", "na", "none", "null", "undefined", "-", "--"].includes(value.trim().toLowerCase());
}

function asNullableString(value) {
  const text = asString(value);
  return text.length && !isPlaceholderText(text) ? text : null;
}

function asNullableUrl(value) {
  const text = asNullableString(value);
  if (!text) return null;

  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:" ? text : null;
  } catch {
    return null;
  }
}

function firstNullableUrl(...values) {
  for (const value of values) {
    const url = asNullableUrl(value);
    if (url) return url;
  }

  return null;
}

function metric(value) {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const text = asString(value).toLowerCase().replace(/,/g, "");
  if (!text) return 0;
  const match = text.match(/-?\d+(\.\d+)?/);
  if (!match) return 0;
  const parsed = Number(match[0]);
  if (!Number.isFinite(parsed)) return 0;
  if (text.includes("m")) return parsed * 1_000_000;
  if (text.includes("k")) return parsed * 1_000;
  return parsed;
}

function slugify(value, fallback = "model") {
  const slug = asString(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);

  return slug || fallback;
}

function titleizeSlug(slug) {
  if (slug === "uncategorized") return "Amateur";

  return slug
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function audienceMetricFromText(value) {
  const text = asString(value).toLowerCase().replace(/,/g, "");
  if (!text) return 0;

  const match = text.match(/(\d+(?:\.\d+)?)\s*([kmb])?\+?\s*(subs?|subscribers?|fans?|followers?)\b/i);
  if (!match) return 0;

  const parsed = Number(match[1]);
  if (!Number.isFinite(parsed)) return 0;

  const multiplier = match[2];
  if (multiplier === "b") return parsed * 1_000_000_000;
  if (multiplier === "m") return parsed * 1_000_000;
  if (multiplier === "k") return parsed * 1_000;
  return parsed;
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function cleanDisplayName(rawName, username) {
  const cleaned = asString(rawName)
    .replace(/\s+-\s+[\d.,]+\s*[kmb]?\+?\s*subs?\b.*$/i, "")
    .replace(/\s+subs?\b.*$/i, "")
    .trim();

  if (cleaned) return cleaned;
  return username ? `@${username}` : "Creator";
}

function splitKeywords(rawCategory) {
  return unique(
    asString(rawCategory)
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  );
}

function keywordSlugsFrom(rawCategory) {
  const slugs = splitKeywords(rawCategory)
    .map((keyword) => slugify(keyword, ""))
    .filter((slug) => slug.length > 1 && slug.length < 64);

  return slugs.length ? unique(slugs) : ["uncategorized"];
}

function calculatePopularity(raw, sourceOrder) {
  const fans =
    metric(raw.nr_of_fans || raw.fans || raw.subscribers) ||
    audienceMetricFromText(raw.name) ||
    audienceMetricFromText(raw.details);
  const likes = metric(raw.nr_of_likes || raw.likes);
  const posts = metric(raw.nr_of_posts || raw.posts);
  const videos = metric(raw.nr_of_videos || raw.videos);
  const images = metric(raw.nr_of_images || raw.images);
  const views = metric(raw.views || raw.view_count || raw.profile_views);
  const clicks = metric(raw.clicks || raw.click_count || raw.outbound_clicks);
  const sourceSort = metric(raw.sort);

  const log = (value) => (value > 0 ? Math.log10(value + 1) : 0);
  const sourceOrderBoost = Math.max(0, 200 - (sourceSort || sourceOrder + 1)) * 0.7;
  const score =
    clicks * 4 +
    views * 1.5 +
    log(fans) * 25 +
    log(likes) * 10 +
    log(posts) * 4 +
    videos * 0.35 +
    images * 0.12 +
    sourceOrderBoost;

  return {
    sourceFanCount: Math.round(fans),
    sourceLikeCount: Math.round(likes),
    sourcePostCount: Math.round(posts),
    sourceVideoCount: Math.round(videos),
    sourceImageCount: Math.round(images),
    viewCount: Math.round(views),
    clickCount: Math.round(clicks),
    popularityScore: Number(score.toFixed(2))
  };
}

function normalizeModel(raw, index) {
  const username = asString(raw.username).replace(/^@+/, "");
  const sourceName = asString(raw.name);
  const displayName = cleanDisplayName(sourceName, username);
  const slug = slugify(username || displayName || `${index + 1}`, `model-${index + 1}`);
  const rawCategory = asNullableString(raw.category);
  const categorySlugs = keywordSlugsFrom(rawCategory);
  const stats = calculatePopularity(raw, index);
  const clickUrl = asNullableString(raw.click_url || raw.url || raw.onlyfans_url);
  const profileImageUrl = firstNullableUrl(
    raw.profile_image,
    raw.profileImageUrl,
    raw.image,
    raw.image_url,
    raw.avatar,
    raw.avatar_url,
    raw.thumbnail,
    raw.thumb,
    raw.profile_pic,
    raw.picture
  );

  return {
    id: `traffichaus:${slug}`,
    source: "traffichaus",
    sourceOrder: index + 1,
    sourceSort: metric(raw.sort) || index + 1,
    slug,
    displayName,
    sourceName: sourceName || displayName,
    username: username || null,
    handle: username ? `@${username}` : null,
    profileImageUrl,
    imageAltText: asNullableString(raw.image_alt_text),
    onlyfansUrl: clickUrl,
    clickUrl,
    twitterUrl: asNullableString(raw.twitter_url || raw.x_url),
    tiktokUrl: asNullableString(raw.tiktok_url),
    instagramUrl: asNullableString(raw.instagram_url),
    price: asNullableString(raw.price),
    country: asNullableString(raw.country),
    region: asNullableString(raw.state || raw.region),
    city: asNullableString(raw.city),
    gender: asNullableString(raw.gender),
    rawCategory,
    rawDetails: asNullableString(raw.details),
    sourceKeywords: splitKeywords(rawCategory),
    categorySlugs,
    categoryLabels: categorySlugs.map(titleizeSlug),
    status: "ACTIVE",
    imageStatus: profileImageUrl ? "SOURCE_PROVIDED" : "MISSING_IMAGE",
    lastImportedAt: new Date().toISOString(),
    ...stats
  };
}

function parseCompleteObjectLiterals(text) {
  const objects = [];
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (char === "\\") {
        escaped = true;
      } else if (char === "\"") {
        inString = false;
      }
      continue;
    }

    if (char === "\"") {
      inString = true;
      continue;
    }

    if (char === "{") {
      if (depth === 0) start = index;
      depth += 1;
      continue;
    }

    if (char === "}") {
      depth -= 1;
      if (depth === 0 && start >= 0) {
        const candidate = text.slice(start, index + 1);
        try {
          objects.push(JSON.parse(candidate));
        } catch {
          // Skip malformed records while preserving all complete records that parse cleanly.
        }
        start = -1;
      }
    }
  }

  return objects;
}

function parseFeed(text) {
  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return { records: parsed, truncated: false, parser: "json" };
    }
    if (parsed && typeof parsed === "object" && Array.isArray(parsed.models)) {
      return { records: parsed.models, truncated: false, parser: "json.models" };
    }
    return { records: [], truncated: false, parser: "json.unsupported" };
  } catch {
    const records = parseCompleteObjectLiterals(text);
    return { records, truncated: true, parser: "salvaged-json-objects" };
  }
}

function buildSections(models) {
  const counts = new Map();
  models.forEach((model) => {
    model.categorySlugs.forEach((slug) => counts.set(slug, (counts.get(slug) || 0) + 1));
  });

  return [...counts.entries()]
    .map(([slug, count]) => ({
      slug,
      label: titleizeSlug(slug),
      count,
      href: `/models/category/${slug}`
    }))
    .sort((first, second) => second.count - first.count || first.label.localeCompare(second.label));
}

async function ensureOverridesFile(filePath) {
  if (existsSync(filePath)) return;
  const seed = {
    comment:
      "Manual top-three model overrides by section slug. Put model slugs in the desired order; remaining slots are filled by popularity.",
    sections: {
      all: []
    }
  };
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(seed, null, 2)}\n`, "utf8");
}

async function readSource({ input, url }) {
  if (input) {
    return {
      text: await readFile(input, "utf8"),
      sourceUrl: `file://${path.resolve(input)}`
    };
  }

  const response = await fetch(url, {
    headers: { Accept: "application/json,text/plain,*/*" },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Traffichaus feed request failed with status ${response.status}`);
  }

  return {
    text: await response.text(),
    sourceUrl: url
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const { text, sourceUrl } = await readSource(args);
  const parsed = parseFeed(text);
  const models = parsed.records
    .filter((record) => record && typeof record === "object")
    .map((record, index) => normalizeModel(record, index));
  const payload = {
    importedAt: new Date().toISOString(),
    sourceUrl,
    source: "traffichaus",
    checksum: createHash("sha256").update(text).digest("hex"),
    rawCount: parsed.records.length,
    parsedCount: models.length,
    truncated: parsed.truncated,
    parser: parsed.parser,
    sections: buildSections(models),
    models
  };
  const output = `${JSON.stringify(payload, null, args.pretty ? 2 : 0)}\n`;

  if (args.dryRun) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          parsedCount: payload.parsedCount,
          sectionCount: payload.sections.length,
          truncated: payload.truncated,
          parser: payload.parser,
          outputPath: path.resolve(args.out)
        },
        null,
        2
      )
    );
    return;
  }

  await mkdir(path.dirname(args.out), { recursive: true });
  const tempPath = `${args.out}.${process.pid}.tmp`;
  await writeFile(tempPath, output, "utf8");
  await rename(tempPath, args.out);
  await ensureOverridesFile(args.overrides);

  console.log(
    JSON.stringify({
      ok: true,
      parsedCount: payload.parsedCount,
      sectionCount: payload.sections.length,
      truncated: payload.truncated,
      parser: payload.parser,
      outputPath: path.resolve(args.out)
    })
  );
}

main().catch((error) => {
  console.error(JSON.stringify({ ok: false, error: error instanceof Error ? error.message : String(error) }));
  process.exitCode = 1;
});
