export const platformLabels = {
  onlyfans: "OnlyFans",
  fansly: "Fansly",
  patreon: "Patreon",
  manyvids: "ManyVids",
  website: "Website",
  instagram: "Instagram",
  tiktok: "TikTok",
  x: "X",
  twitch: "Twitch",
  youtube: "YouTube"
} as const;

export type PlatformKey = keyof typeof platformLabels;

export type UserRole = "USER" | "CREATOR" | "MODERATOR" | "ADMIN";

export type CreatorStatus = "DRAFT" | "PUBLISHED" | "NOINDEX" | "REMOVED";

export type AwardStatus =
  | "UPCOMING"
  | "NOMINATIONS_OPEN"
  | "VOTING_OPEN"
  | "CLOSED"
  | "WINNERS_ANNOUNCED";

export type CategoryType = "ATTRIBUTE" | "NICHE" | "PLATFORM" | "SOCIAL" | "LOCATION" | "AWARD";

export type RankingPageType = "TOP_LIST" | "CATEGORY" | "GEO" | "SOCIAL" | "AWARD" | "TRENDING";

export type CommentStatus = "PENDING" | "APPROVED" | "REJECTED" | "SPAM" | "REMOVED";

export type RewardCampaignStatus =
  | "DRAFT"
  | "ACTIVE"
  | "CLOSED"
  | "FULFILLING"
  | "COMPLETED"
  | "CANCELLED";

export type PublicLocation = {
  country?: string;
  region?: string;
  city?: string;
  visibility: "HIDDEN" | "COUNTRY" | "REGION" | "CITY";
};

export type CreatorStarsInputs = {
  fanVotes: number;
  profileCompleteness: number;
  verification: number;
  engagement: number;
  freshness: number;
  awardPerformance: number;
};

export type CreatorProfile = {
  id: string;
  slug: string;
  displayName: string;
  handle: string;
  bio: string;
  profileImageUrl?: string;
  bannerImageUrl?: string;
  hasSafeImage: boolean;
  primaryPlatform: PlatformKey;
  platformLinks: Partial<Record<PlatformKey, string>>;
  socialLinks: Partial<Record<PlatformKey, string>>;
  categories: string[];
  attributes: string[];
  location: PublicLocation;
  isClaimed: boolean;
  isVerified: boolean;
  isIndexable: boolean;
  indexQualityScore: number;
  creatorStarsScore: number;
  totalVotes: number;
  totalComments: number;
  status: CreatorStatus;
  lastDataRefreshAt: string;
  createdAt: string;
  updatedAt: string;
  creatorStarsInputs: CreatorStarsInputs;
};

export type Category = {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: CategoryType;
  isSensitive: boolean;
  isIndexable: boolean;
};

export type AwardNomination = {
  creatorSlug: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "WINNER" | "FINALIST";
  voteCount: number;
  nominationReason: string;
};

export type Award = {
  id: string;
  year: number;
  slug: string;
  title: string;
  description: string;
  status: AwardStatus;
  votingStartsAt?: string;
  votingEndsAt?: string;
  nominees: AwardNomination[];
};

export type RankingEntry = {
  creatorSlug: string;
  rank: number;
  score: number;
  previousRank?: number;
  movement: number;
};

export type RankingPage = {
  id: string;
  slug: string;
  title: string;
  pageType: RankingPageType;
  description: string;
  introContent: string;
  seoTitle: string;
  seoDescription: string;
  canonicalUrl?: string;
  isIndexable: boolean;
  minCreatorCount: number;
  entries: RankingEntry[];
  faqs: Array<{ question: string; answer: string }>;
  relatedSlugs: string[];
};

export type CommentPreview = {
  id: string;
  authorName: string;
  body: string;
  status: CommentStatus;
  score: number;
  createdAt: string;
  replies?: CommentPreview[];
};

export type LegalPage = {
  slug: string;
  title: string;
  description: string;
  body: string[];
  robotsIndex: boolean;
};

export type RewardCampaign = {
  id: string;
  title: string;
  slug: string;
  month: number;
  year: number;
  startsAt: string;
  endsAt: string;
  status: RewardCampaignStatus;
  prizeDescription: string;
  prizeValueCap: number;
  numberOfWinners: number;
  eligibilityRules: string[];
  noPurchaseNecessaryText: string;
  officialRulesUrl: string;
  requiresAgeVerification: boolean;
  minimumAge: number;
};

export type FanRewardScore = {
  userId: string;
  campaignId: string;
  displayName: string;
  votePoints: number;
  nominationPoints: number;
  commentPoints: number;
  sharePoints: number;
  trustPoints: number;
  penaltyPoints: number;
  totalScore: number;
  rank: number;
  isEligible: boolean;
  ineligibilityReason?: string;
};

export type AdminResourceKey =
  | "creators"
  | "users"
  | "comments"
  | "votes"
  | "awards"
  | "nominations"
  | "categories"
  | "ranking-pages"
  | "reports"
  | "creator-claims"
  | "seo-indexing"
  | "sitemaps"
  | "analytics"
  | "rewards"
  | "models"
  | "model-sections"
  | "model-imports"
  | "blog-posts";

export type AdminResource = {
  key: AdminResourceKey;
  label: string;
  description: string;
  rows: Array<Record<string, string | number | boolean>>;
};
