#!/usr/bin/env node

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DEFAULT_OUT = path.join(process.cwd(), "data", "model-promotion-overrides.json");
const BOOLEAN_FLAGS = new Set(["sponsored", "suppressed", "hidden", "brokenImage", "homepageBlocked"]);

function parseArgs(argv) {
  return argv.reduce(
    (args, item) => {
      if (!item.startsWith("--")) return args;
      const [rawKey, ...rawValue] = item.slice(2).split("=");
      const value = rawValue.length ? rawValue.join("=") : "true";
      return { ...args, [rawKey]: value };
    },
    { out: process.env.MODEL_PROMOTION_OVERRIDES_PATH || DEFAULT_OUT }
  );
}

function parseBoolean(value) {
  return ["1", "true", "yes", "on"].includes(String(value).trim().toLowerCase());
}

function normalizeSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function removeFromHomepage(homepage, slug) {
  ["hero", "featured", "leaderboard"].forEach((slot) => {
    homepage[slot] = (homepage[slot] || []).filter((item) => item !== slug);
  });
}

async function readJson(filePath) {
  if (!existsSync(filePath)) return { comment: "Manual model promotion controls.", homepage: {}, models: {} };
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const slug = normalizeSlug(args.slug);

  if (!slug) {
    throw new Error("Missing --slug. Example: node scripts/set-model-promotion.mjs --slug=skylarmaexo --scoreAdjustment=50000 --homepage=hero");
  }

  const filePath = path.resolve(args.out);
  const config = await readJson(filePath);
  config.homepage = config.homepage || {};
  config.models = config.models || {};
  const control = { ...(config.models[slug] || {}) };

  if (args.label !== undefined) control.label = String(args.label);
  if (args.notes !== undefined) control.notes = String(args.notes);
  if (args.scoreAdjustment !== undefined) {
    const parsed = Number(args.scoreAdjustment);
    if (!Number.isFinite(parsed)) throw new Error("--scoreAdjustment must be numeric.");
    control.scoreAdjustment = parsed;
  }

  BOOLEAN_FLAGS.forEach((flag) => {
    if (args[flag] !== undefined) control[flag] = parseBoolean(args[flag]);
  });

  if (args.clear === "true") {
    delete config.models[slug];
  } else {
    config.models[slug] = control;
  }

  if (args.homepage !== undefined) {
    const slot = String(args.homepage).trim();
    removeFromHomepage(config.homepage, slug);

    if (["hero", "featured", "leaderboard"].includes(slot)) {
      config.homepage[slot] = [slug, ...(config.homepage[slot] || [])].slice(0, slot === "hero" ? 3 : 8);
    }
  }

  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, `${JSON.stringify(config, null, 2)}\n`);
  console.log(`Updated ${filePath} for ${slug}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
