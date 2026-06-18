import type { MetadataRoute } from "next";

import {
  absoluteUrl,
  getAwardYears,
  getAwards,
  getCategories,
  getIndexableCreators,
  getLegalPages,
  getRankingPages
} from "@/lib/onlycreatorawards/repository";
import { getBlogPosts } from "@/lib/onlycreatorawards/blog";
import { getModelDirectorySections, getTopImportedModels } from "@/lib/onlycreatorawards/modelDirectory";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticUrls = [
    "/",
    "/creators",
    "/categories",
    "/awards",
    "/models",
    "/blog",
    "/seo-ai-criteria",
    ...getAwardYears().map((year) => `/awards/${year}`),
    ...getLegalPages()
      .filter((page) => page.robotsIndex)
      .map((page) => `/${page.slug}`),
    "/claim-profile",
    "/rewards",
    "/rewards/monthly",
    "/rewards/rules",
    "/rewards/winners"
  ];

  const creatorUrls = getIndexableCreators().map((creator) => `/creator/${creator.slug}`);
  const modelUrls = getTopImportedModels(2000).map((model) => `/model/${model.slug}`);
  const modelSectionUrls = getModelDirectorySections()
    .filter((section) => section.count >= 5)
    .map((section) => `/models/category/${section.slug}`);
  const blogUrls = getBlogPosts().map((post) => `/blog/${post.slug}`);
  const categoryUrls = getCategories()
    .filter((category) => category.isIndexable)
    .map((category) => `/category/${category.slug}`);
  const awardUrls = getAwards().map((award) => `/awards/${award.year}/${award.slug}`);
  const rankingUrls = getRankingPages()
    .filter((page) => page.isIndexable)
    .map((page) => `/${page.slug}`);

  return [...staticUrls, ...creatorUrls, ...modelUrls, ...modelSectionUrls, ...blogUrls, ...categoryUrls, ...awardUrls, ...rankingUrls].map((url) => ({
    url: absoluteUrl(url),
    lastModified: now,
    changeFrequency: "weekly",
    priority: url === "/" ? 1 : 0.7
  }));
}
