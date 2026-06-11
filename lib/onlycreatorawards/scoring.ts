import type { CreatorProfile, CreatorStarsInputs, FanRewardScore } from "@/lib/onlycreatorawards/types";

export const creatorStarsWeights = {
  fanVotes: 0.3,
  profileCompleteness: 0.2,
  verification: 0.15,
  engagement: 0.15,
  freshness: 0.1,
  awardPerformance: 0.1
} as const;

export const fanRewardDailyCaps = {
  voting: 10,
  nominations: 3,
  comments: 5,
  shares: 5
} as const;

export const fanRewardWeights = {
  validAwardVotes: 0.4,
  nominationsSubmitted: 0.2,
  approvedUsefulComments: 0.15,
  creatorProfileShares: 0.15,
  accountTrust: 0.1
} as const;

export function clampScore(value: number, min = 0, max = 100) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

export function getCreatorStarsLevel(score: number) {
  if (score >= 90) return "Diamond Creator";
  if (score >= 80) return "Platinum Creator";
  if (score >= 70) return "Gold Creator";
  if (score >= 60) return "Silver Creator";
  if (score >= 50) return "Bronze Creator";
  return "Rising Creator";
}

export function calculateCreatorStars(inputs: CreatorStarsInputs) {
  return clampScore(
    inputs.fanVotes * creatorStarsWeights.fanVotes +
      inputs.profileCompleteness * creatorStarsWeights.profileCompleteness +
      inputs.verification * creatorStarsWeights.verification +
      inputs.engagement * creatorStarsWeights.engagement +
      inputs.freshness * creatorStarsWeights.freshness +
      inputs.awardPerformance * creatorStarsWeights.awardPerformance
  );
}

export function calculateProfileCompleteness(creator: Pick<
  CreatorProfile,
  | "bio"
  | "hasSafeImage"
  | "platformLinks"
  | "socialLinks"
  | "categories"
  | "location"
  | "isClaimed"
  | "isVerified"
>) {
  const checks = [
    creator.hasSafeImage,
    creator.bio.trim().length >= 80,
    Object.values(creator.platformLinks).some(Boolean),
    Object.values(creator.socialLinks).some(Boolean),
    creator.categories.length > 0,
    creator.location.visibility !== "HIDDEN" && Boolean(creator.location.country),
    creator.isClaimed,
    creator.isVerified
  ];

  return clampScore((checks.filter(Boolean).length / checks.length) * 100);
}

export function calculateIndexQuality(creator: Pick<
  CreatorProfile,
  | "slug"
  | "displayName"
  | "bio"
  | "hasSafeImage"
  | "platformLinks"
  | "categories"
  | "status"
>) {
  let score = 0;

  if (creator.displayName.trim().length >= 2) score += 15;
  if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(creator.slug)) score += 15;
  if (Object.values(creator.platformLinks).some(Boolean)) score += 20;
  if (creator.categories.length > 0) score += 15;
  if (creator.hasSafeImage) score += 10;
  if (creator.bio.trim().length >= 120) score += 20;
  if (creator.status === "PUBLISHED") score += 5;

  return clampScore(score);
}

export function shouldIndexCreator(creator: CreatorProfile) {
  return creator.status === "PUBLISHED" && creator.isIndexable && creator.indexQualityScore >= 70;
}

export function formatScore(score: number) {
  return `${clampScore(score)}/100`;
}

type RewardScoreInput = {
  userId: string;
  campaignId: string;
  displayName: string;
  validAwardVotes: number;
  nominationsSubmitted: number;
  approvedUsefulComments: number;
  creatorProfileShares: number;
  accountTrust: number;
  penaltyPoints?: number;
  isEligible: boolean;
  ineligibilityReason?: string;
};

export function calculateFanRewardScore(input: RewardScoreInput): FanRewardScore {
  const votePoints = Math.min(input.validAwardVotes, fanRewardDailyCaps.voting * 31);
  const nominationPoints = Math.min(input.nominationsSubmitted, fanRewardDailyCaps.nominations * 31);
  const commentPoints = Math.min(input.approvedUsefulComments, fanRewardDailyCaps.comments * 31);
  const sharePoints = Math.min(input.creatorProfileShares, fanRewardDailyCaps.shares * 31);
  const trustPoints = clampScore(input.accountTrust);
  const penaltyPoints = Math.max(0, input.penaltyPoints ?? 0);

  const weightedScore =
    votePoints * fanRewardWeights.validAwardVotes +
    nominationPoints * fanRewardWeights.nominationsSubmitted +
    commentPoints * fanRewardWeights.approvedUsefulComments +
    sharePoints * fanRewardWeights.creatorProfileShares +
    trustPoints * fanRewardWeights.accountTrust -
    penaltyPoints;

  return {
    userId: input.userId,
    campaignId: input.campaignId,
    displayName: input.displayName,
    votePoints,
    nominationPoints,
    commentPoints,
    sharePoints,
    trustPoints,
    penaltyPoints,
    totalScore: Math.max(0, Math.round(weightedScore)),
    rank: 0,
    isEligible: input.isEligible,
    ineligibilityReason: input.ineligibilityReason
  };
}
