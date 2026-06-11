import {
  adminResources,
  awards,
  categories,
  comments,
  creators,
  currentRewardCampaign,
  fanRewardScores,
  legalPages,
  rankingPages
} from "@/lib/onlycreatorawards/seed";
import { shouldIndexCreator } from "@/lib/onlycreatorawards/scoring";
import type { AdminResource, AdminResourceKey, RankingPage } from "@/lib/onlycreatorawards/types";

export const siteConfig = {
  name: "OnlyCreatorAwards",
  domain: "OnlyCreatorAwards.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://onlycreatorawards.com",
  heroImage: "/images/onlycreatorawards-hero.png",
  disclaimer:
    "OnlyCreatorAwards is an independent creator discovery, rankings, awards, and fan rewards platform. It is not affiliated with OnlyFans, Fansly, Patreon, Instagram, TikTok, Twitch, YouTube, or any other listed platform."
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function getCreators() {
  return creators;
}

export function getIndexableCreators() {
  return creators.filter(shouldIndexCreator);
}

export function getCreatorBySlug(slug: string) {
  return creators.find((creator) => creator.slug === slug);
}

export function getSimilarCreators(slug: string, limit = 3) {
  const creator = getCreatorBySlug(slug);
  if (!creator) return [];

  return creators
    .filter((item) => item.slug !== slug)
    .map((item) => ({
      creator: item,
      overlap: item.categories.filter((category) => creator.categories.includes(category)).length
    }))
    .sort((first, second) => second.overlap - first.overlap || second.creator.creatorStarsScore - first.creator.creatorStarsScore)
    .slice(0, limit)
    .map(({ creator: item }) => item);
}

export function getCategories() {
  return categories;
}

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}

export function getCreatorsForCategory(slug: string) {
  return creators.filter((creator) => creator.categories.includes(slug));
}

export function getAwards(year?: number) {
  return year ? awards.filter((award) => award.year === year) : awards;
}

export function getAward(year: number, slug: string) {
  return awards.find((award) => award.year === year && award.slug === slug);
}

export function getAwardYears() {
  return [...new Set(awards.map((award) => award.year))].sort((first, second) => second - first);
}

export function getRankingPages(type?: RankingPage["pageType"]) {
  return type ? rankingPages.filter((page) => page.pageType === type) : rankingPages;
}

export function getRankingPageBySlug(slug: string) {
  return rankingPages.find((page) => page.slug === slug);
}

export function getRankingCreators(page: RankingPage) {
  return page.entries
    .map((entry) => ({
      entry,
      creator: getCreatorBySlug(entry.creatorSlug)
    }))
    .filter((row): row is { entry: (typeof page.entries)[number]; creator: NonNullable<ReturnType<typeof getCreatorBySlug>> } =>
      Boolean(row.creator)
    );
}

export function getLegalPage(slug: string) {
  return legalPages.find((page) => page.slug === slug);
}

export function getLegalPages() {
  return legalPages;
}

export function getCreatorComments(slug: string) {
  return comments[slug] ?? [];
}

export function getCurrentRewardCampaign() {
  return currentRewardCampaign;
}

export function getFanRewardScores() {
  return fanRewardScores;
}

export function getAdminResource(key: string): AdminResource {
  const resource = adminResources.find((item) => item.key === key);
  if (resource) return resource;

  return {
    key: key as AdminResourceKey,
    label: key
      .split("-")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" "),
    description: "CRUD queue scaffold. Connect this resource to Prisma before enabling production writes.",
    rows: [{ state: "Scaffolded", database: "Pending Prisma repository", protected: true }]
  };
}

export function getAdminResources() {
  const existingKeys = new Set(adminResources.map((resource) => resource.key));
  const allKeys: AdminResourceKey[] = [
    "creators",
    "users",
    "comments",
    "votes",
    "awards",
    "nominations",
    "categories",
    "ranking-pages",
    "reports",
    "creator-claims",
    "seo-indexing",
    "sitemaps",
    "analytics",
    "rewards"
  ];

  return [
    ...adminResources,
    ...allKeys.filter((key) => !existingKeys.has(key)).map((key) => getAdminResource(key))
  ];
}
