import {
  calculateCreatorStars,
  calculateFanRewardScore,
  calculateIndexQuality,
  calculateProfileCompleteness
} from "@/lib/onlycreatorawards/scoring";
import type {
  AdminResource,
  Award,
  Category,
  CreatorProfile,
  FanRewardScore,
  LegalPage,
  RankingPage,
  RewardCampaign
} from "@/lib/onlycreatorawards/types";

const updatedAt = "2026-06-10";

type CreatorSeedInput = Omit<CreatorProfile, "creatorStarsScore" | "indexQualityScore" | "isIndexable">;

function creator(input: CreatorSeedInput): CreatorProfile {
  const base: CreatorProfile = {
    ...input,
    creatorStarsScore: 0,
    indexQualityScore: 0,
    isIndexable: false
  };
  const profileCompleteness = calculateProfileCompleteness(base);
  const indexQualityScore = calculateIndexQuality(base);
  const creatorStarsScore = calculateCreatorStars({
    ...base.creatorStarsInputs,
    profileCompleteness
  });

  return {
    ...base,
    creatorStarsInputs: {
      ...base.creatorStarsInputs,
      profileCompleteness
    },
    creatorStarsScore,
    indexQualityScore,
    isIndexable: base.status === "PUBLISHED" && indexQualityScore >= 70
  };
}

export const categories: Category[] = [
  {
    id: "cat-fitness",
    slug: "fitness-creators",
    name: "Fitness Creators",
    description: "Safe public creator profiles centered on training, wellness, and fitness communities.",
    type: "NICHE",
    isSensitive: false,
    isIndexable: true
  },
  {
    id: "cat-cosplay",
    slug: "cosplay-creators",
    name: "Cosplay Creators",
    description: "Creator profiles with public cosplay, character build, and fandom-focused content.",
    type: "NICHE",
    isSensitive: false,
    isIndexable: true
  },
  {
    id: "cat-gamer",
    slug: "gamer-creators",
    name: "Gamer Creators",
    description: "Creators with public gaming, streaming, and community crossover audiences.",
    type: "NICHE",
    isSensitive: false,
    isIndexable: true
  },
  {
    id: "cat-travel",
    slug: "travel-creators",
    name: "Travel Creators",
    description: "Public profiles for travel, lifestyle, and location-safe creator discovery.",
    type: "NICHE",
    isSensitive: false,
    isIndexable: true
  },
  {
    id: "cat-fashion",
    slug: "fashion-creators",
    name: "Fashion Creators",
    description: "Creators with public fashion, style, shopping, and lookbook communities.",
    type: "NICHE",
    isSensitive: false,
    isIndexable: true
  },
  {
    id: "cat-lifestyle",
    slug: "lifestyle-creators",
    name: "Lifestyle Creators",
    description: "Safe lifestyle creator profiles with broad public audience signals.",
    type: "NICHE",
    isSensitive: false,
    isIndexable: true
  },
  {
    id: "cat-blonde",
    slug: "blonde-onlyfans-creators",
    name: "Blonde Creators",
    description: "Creator-submitted or publicly branded blonde creator profiles.",
    type: "ATTRIBUTE",
    isSensitive: true,
    isIndexable: true
  },
  {
    id: "cat-brunette",
    slug: "brunette-onlyfans-creators",
    name: "Brunette Creators",
    description: "Creator-submitted or publicly branded brunette creator profiles.",
    type: "ATTRIBUTE",
    isSensitive: true,
    isIndexable: true
  },
  {
    id: "cat-redhead",
    slug: "redhead-onlyfans-creators",
    name: "Redhead Creators",
    description: "Creator-submitted or publicly branded redhead creator profiles.",
    type: "ATTRIBUTE",
    isSensitive: true,
    isIndexable: true
  },
  {
    id: "cat-social-instagram",
    slug: "instagram-crossover-creators",
    name: "Instagram Crossover Creators",
    description: "Creators with safe public Instagram audience crossover signals.",
    type: "SOCIAL",
    isSensitive: false,
    isIndexable: true
  }
];

export const creators: CreatorProfile[] = [
  creator({
    id: "creator-luna-north",
    slug: "luna-north",
    displayName: "Luna North",
    handle: "@lunanorth",
    bio:
      "Luna North is a sample launch-profile creator focused on fitness challenges, lifestyle updates, and public community awards participation. This profile uses safe placeholder imagery until a verified creator claim provides approved assets.",
    hasSafeImage: true,
    primaryPlatform: "onlyfans",
    platformLinks: {
      website: "https://example.com/luna-north"
    },
    socialLinks: {
      instagram: "https://instagram.com/lunanorth",
      tiktok: "https://tiktok.com/@lunanorth"
    },
    categories: ["fitness-creators", "lifestyle-creators", "blonde-onlyfans-creators"],
    attributes: ["Creator-submitted attributes required before production indexing"],
    location: {
      country: "United States",
      region: "California",
      visibility: "REGION"
    },
    isClaimed: true,
    isVerified: true,
    totalVotes: 4820,
    totalComments: 128,
    status: "PUBLISHED",
    lastDataRefreshAt: updatedAt,
    createdAt: "2026-01-04",
    updatedAt,
    creatorStarsInputs: {
      fanVotes: 88,
      profileCompleteness: 0,
      verification: 95,
      engagement: 74,
      freshness: 92,
      awardPerformance: 80
    }
  }),
  creator({
    id: "creator-maya-circuit",
    slug: "maya-circuit",
    displayName: "Maya Circuit",
    handle: "@mayacircuit",
    bio:
      "Maya Circuit is a gaming and streaming crossover sample profile for the OnlyCreatorAwards launch index. The page demonstrates ranking, award nomination, voting, and safe social-platform discovery modules.",
    hasSafeImage: true,
    primaryPlatform: "fansly",
    platformLinks: {
      website: "https://example.com/maya-circuit"
    },
    socialLinks: {
      twitch: "https://twitch.tv/mayacircuit",
      youtube: "https://youtube.com/@mayacircuit"
    },
    categories: ["gamer-creators"],
    attributes: ["Gaming crossover", "Streaming community"],
    location: {
      country: "Canada",
      visibility: "COUNTRY"
    },
    isClaimed: true,
    isVerified: true,
    totalVotes: 4365,
    totalComments: 96,
    status: "PUBLISHED",
    lastDataRefreshAt: updatedAt,
    createdAt: "2026-01-11",
    updatedAt,
    creatorStarsInputs: {
      fanVotes: 84,
      profileCompleteness: 0,
      verification: 90,
      engagement: 70,
      freshness: 90,
      awardPerformance: 72
    }
  }),
  creator({
    id: "creator-ari-sol",
    slug: "ari-sol",
    displayName: "Ari Sol",
    handle: "@arisol",
    bio:
      "Ari Sol is a travel and fashion creator sample page built to show how public, broad location data, categories, CreatorStars scoring, and profile-claim workflows can work without hosting explicit media.",
    hasSafeImage: true,
    primaryPlatform: "patreon",
    platformLinks: {
      website: "https://example.com/ari-sol"
    },
    socialLinks: {
      instagram: "https://instagram.com/arisol",
      youtube: "https://youtube.com/@arisol"
    },
    categories: ["travel-creators", "fashion-creators"],
    attributes: ["Public travel branding", "Fashion crossover"],
    location: {
      country: "United Kingdom",
      region: "London",
      visibility: "REGION"
    },
    isClaimed: false,
    isVerified: true,
    totalVotes: 3910,
    totalComments: 84,
    status: "PUBLISHED",
    lastDataRefreshAt: updatedAt,
    createdAt: "2026-01-18",
    updatedAt,
    creatorStarsInputs: {
      fanVotes: 79,
      profileCompleteness: 0,
      verification: 80,
      engagement: 66,
      freshness: 84,
      awardPerformance: 68
    }
  }),
  creator({
    id: "creator-nova-stitch",
    slug: "nova-stitch",
    displayName: "Nova Stitch",
    handle: "@novastitch",
    bio:
      "Nova Stitch is a cosplay creator sample profile with a focus on safe convention content, public fandom communities, award nominations, and creator-controlled category participation.",
    hasSafeImage: true,
    primaryPlatform: "onlyfans",
    platformLinks: {
      website: "https://example.com/nova-stitch"
    },
    socialLinks: {
      instagram: "https://instagram.com/novastitch",
      tiktok: "https://tiktok.com/@novastitch"
    },
    categories: ["cosplay-creators", "redhead-onlyfans-creators"],
    attributes: ["Cosplay", "Creator-submitted attributes pending"],
    location: {
      country: "United States",
      region: "Texas",
      visibility: "REGION"
    },
    isClaimed: true,
    isVerified: false,
    totalVotes: 3740,
    totalComments: 72,
    status: "PUBLISHED",
    lastDataRefreshAt: updatedAt,
    createdAt: "2026-01-22",
    updatedAt,
    creatorStarsInputs: {
      fanVotes: 76,
      profileCompleteness: 0,
      verification: 66,
      engagement: 64,
      freshness: 81,
      awardPerformance: 74
    }
  }),
  creator({
    id: "creator-sage-lane",
    slug: "sage-lane",
    displayName: "Sage Lane",
    handle: "@sagelane",
    bio:
      "Sage Lane is a lifestyle and ASMR sample creator profile used to test noindex thresholds, profile quality controls, comment moderation, and creator-dashboard claim paths before importing production data.",
    hasSafeImage: true,
    primaryPlatform: "onlyfans",
    platformLinks: {
      website: "https://example.com/sage-lane"
    },
    socialLinks: {
      tiktok: "https://tiktok.com/@sagelane"
    },
    categories: ["lifestyle-creators"],
    attributes: ["Lifestyle", "ASMR"],
    location: {
      country: "Australia",
      visibility: "COUNTRY"
    },
    isClaimed: false,
    isVerified: false,
    totalVotes: 1680,
    totalComments: 19,
    status: "NOINDEX",
    lastDataRefreshAt: updatedAt,
    createdAt: "2026-02-02",
    updatedAt,
    creatorStarsInputs: {
      fanVotes: 55,
      profileCompleteness: 0,
      verification: 35,
      engagement: 32,
      freshness: 72,
      awardPerformance: 18
    }
  }),
  creator({
    id: "creator-ivy-mode",
    slug: "ivy-mode",
    displayName: "Ivy Mode",
    handle: "@ivymode",
    bio:
      "Ivy Mode is a fashion creator sample profile for ranking cards, creator search, badge display, and safe profile placeholder handling. Production data should replace this record after verification.",
    hasSafeImage: true,
    primaryPlatform: "manyvids",
    platformLinks: {
      website: "https://example.com/ivy-mode"
    },
    socialLinks: {
      instagram: "https://instagram.com/ivymode"
    },
    categories: ["fashion-creators", "brunette-onlyfans-creators"],
    attributes: ["Fashion", "Public brand styling"],
    location: {
      country: "United States",
      region: "New York",
      visibility: "REGION"
    },
    isClaimed: false,
    isVerified: true,
    totalVotes: 2118,
    totalComments: 41,
    status: "PUBLISHED",
    lastDataRefreshAt: updatedAt,
    createdAt: "2026-02-06",
    updatedAt,
    creatorStarsInputs: {
      fanVotes: 62,
      profileCompleteness: 0,
      verification: 76,
      engagement: 44,
      freshness: 74,
      awardPerformance: 52
    }
  })
];

export const awards: Award[] = [
  {
    id: "award-creator-of-the-year-2026",
    year: 2026,
    slug: "creator-of-the-year",
    title: "Creator of the Year",
    description:
      "The flagship annual award for a verified creator with strong public fan support, profile quality, and awards participation.",
    status: "VOTING_OPEN",
    votingStartsAt: "2026-06-01",
    votingEndsAt: "2026-12-15",
    nominees: [
      {
        creatorSlug: "luna-north",
        status: "APPROVED",
        voteCount: 1240,
        nominationReason: "Consistent fan support and a complete verified launch profile."
      },
      {
        creatorSlug: "maya-circuit",
        status: "APPROVED",
        voteCount: 1104,
        nominationReason: "Strong crossover community and verified creator participation."
      }
    ]
  },
  {
    id: "award-fan-favorite-2026",
    year: 2026,
    slug: "fan-favorite",
    title: "Fan Favorite",
    description:
      "A public-vote award recognizing verified fans, safe comments, and repeat community participation.",
    status: "NOMINATIONS_OPEN",
    votingStartsAt: "2026-08-01",
    votingEndsAt: "2026-12-15",
    nominees: [
      {
        creatorSlug: "nova-stitch",
        status: "APPROVED",
        voteCount: 918,
        nominationReason: "Cosplay audience engagement and strong recent vote velocity."
      }
    ]
  },
  {
    id: "award-rising-star-2026",
    year: 2026,
    slug: "rising-star",
    title: "Rising Star",
    description:
      "A launch-year award for newer public profiles with meaningful growth and safe fan participation.",
    status: "UPCOMING",
    votingStartsAt: "2026-09-01",
    votingEndsAt: "2026-12-15",
    nominees: [
      {
        creatorSlug: "ivy-mode",
        status: "PENDING",
        voteCount: 0,
        nominationReason: "Fashion crossover profile currently pending nomination review."
      }
    ]
  },
  {
    id: "award-best-fitness-creator-2026",
    year: 2026,
    slug: "best-fitness-creator",
    title: "Best Fitness Creator",
    description:
      "A category award for creators with safe public fitness branding, verified links, and approved audience participation.",
    status: "NOMINATIONS_OPEN",
    nominees: [
      {
        creatorSlug: "luna-north",
        status: "APPROVED",
        voteCount: 740,
        nominationReason: "Verified public fitness profile and strong CreatorStars score."
      }
    ]
  },
  {
    id: "award-best-cosplay-creator-2026",
    year: 2026,
    slug: "best-cosplay-creator",
    title: "Best Cosplay Creator",
    description:
      "A category award for creators with safe public cosplay branding, convention-friendly profiles, and approved categories.",
    status: "NOMINATIONS_OPEN",
    nominees: [
      {
        creatorSlug: "nova-stitch",
        status: "APPROVED",
        voteCount: 692,
        nominationReason: "Cosplay community profile with claimed-page participation."
      }
    ]
  }
];

const commonFaqs = [
  {
    question: "How are creators ranked?",
    answer:
      "Rankings combine CreatorStars signals, verified fan votes, profile completeness, verification, engagement, freshness, and award performance."
  },
  {
    question: "Can a creator correct or remove a profile?",
    answer:
      "Yes. Creators can claim a profile, submit corrections, request removal, and provide safe approved profile assets."
  },
  {
    question: "Are these pages explicit?",
    answer:
      "No. OnlyCreatorAwards is designed as a PG public discovery and awards site and does not host explicit content."
  }
];

const rankingDescriptions: Array<{
  slug: string;
  title: string;
  pageType: RankingPage["pageType"];
  description: string;
  minCreatorCount?: number;
  entries?: string[];
}> = [
  {
    slug: "onlyfans-creators",
    title: "OnlyFans Creators",
    pageType: "TOP_LIST",
    description: "A PG public directory for creator discovery, rankings, profile claims, and awards participation."
  },
  {
    slug: "fansly-creators",
    title: "Fansly Creators",
    pageType: "TOP_LIST",
    description: "A PG public directory for Fansly creator discovery, rankings, profile claims, and awards participation."
  },
  {
    slug: "patreon-creators",
    title: "Patreon Creators",
    pageType: "TOP_LIST",
    description: "A PG public directory for Patreon creator discovery, rankings, profile claims, and awards participation."
  },
  {
    slug: "top-onlyfans-creators-2026",
    title: "Top OnlyFans Creators 2026",
    pageType: "TOP_LIST",
    description: "A curated launch ranking of high-quality, safe public creator profiles for the 2026 awards season."
  },
  {
    slug: "best-new-onlyfans-creators",
    title: "Best New OnlyFans Creators",
    pageType: "TOP_LIST",
    description: "A launch list for newer high-quality public profiles with rising CreatorStars momentum."
  },
  {
    slug: "new-onlyfans-creators",
    title: "New OnlyFans Creators",
    pageType: "TOP_LIST",
    description: "Recently added creator profiles that meet minimum quality and safety requirements."
  },
  {
    slug: "fastest-growing-onlyfans-creators",
    title: "Fastest Growing OnlyFans Creators",
    pageType: "TRENDING",
    description: "Creators gaining verified votes, comments, nominations, and safe public profile activity."
  },
  {
    slug: "rising-stars",
    title: "Rising Stars",
    pageType: "TRENDING",
    description: "Creators with strong recent momentum and room to climb into major award categories."
  },
  {
    slug: "creatorstars",
    title: "CreatorStars Rankings",
    pageType: "TRENDING",
    description: "The visible CreatorStars score hub for rankings, badges, eligibility, and trending discovery."
  },
  {
    slug: "top-blonde-onlyfans-creators",
    title: "Top Blonde OnlyFans Creators",
    pageType: "CATEGORY",
    description: "Creator-submitted or public-branding based blonde creator ranking, with sensitive tagging controls."
  },
  {
    slug: "top-brunette-onlyfans-creators",
    title: "Top Brunette OnlyFans Creators",
    pageType: "CATEGORY",
    description: "Creator-submitted or public-branding based brunette creator ranking, with sensitive tagging controls."
  },
  {
    slug: "top-redhead-onlyfans-creators",
    title: "Top Redhead OnlyFans Creators",
    pageType: "CATEGORY",
    description: "Creator-submitted or public-branding based redhead creator ranking, with sensitive tagging controls."
  },
  {
    slug: "top-tattooed-onlyfans-creators",
    title: "Top Tattooed OnlyFans Creators",
    pageType: "CATEGORY",
    description: "A controlled launch page for creator-submitted or obvious public tattoo branding."
  },
  {
    slug: "top-alternative-onlyfans-creators",
    title: "Top Alternative OnlyFans Creators",
    pageType: "CATEGORY",
    description: "A curated alternative creator ranking using approved public profile data only."
  },
  {
    slug: "top-curvy-onlyfans-creators",
    title: "Top Curvy OnlyFans Creators",
    pageType: "CATEGORY",
    description: "A creator-submitted or public-branding based attribute page kept behind strict moderation controls."
  },
  {
    slug: "top-petite-onlyfans-creators",
    title: "Top Petite OnlyFans Creators",
    pageType: "CATEGORY",
    description: "A creator-submitted or public-branding based attribute page kept behind strict moderation controls."
  },
  {
    slug: "top-fitness-creators",
    title: "Top Fitness Creators",
    pageType: "CATEGORY",
    description: "Fitness creator rankings based on safe public content, votes, and profile quality."
  },
  {
    slug: "top-cosplay-creators",
    title: "Top Cosplay Creators",
    pageType: "CATEGORY",
    description: "Cosplay creator rankings based on safe public profiles, nominations, and community votes."
  },
  {
    slug: "top-gamer-creators",
    title: "Top Gamer Creators",
    pageType: "CATEGORY",
    description: "Gaming creator rankings for public streaming and social-platform crossover audiences."
  },
  {
    slug: "top-asmr-creators",
    title: "Top ASMR Creators",
    pageType: "CATEGORY",
    description: "ASMR creator rankings with approved profile quality and safe content policies."
  },
  {
    slug: "top-travel-creators",
    title: "Top Travel Creators",
    pageType: "CATEGORY",
    description: "Travel creator rankings with broad, public location handling only."
  },
  {
    slug: "top-fashion-creators",
    title: "Top Fashion Creators",
    pageType: "CATEGORY",
    description: "Fashion creator rankings using public style, social, and award signals."
  },
  {
    slug: "top-lifestyle-creators",
    title: "Top Lifestyle Creators",
    pageType: "CATEGORY",
    description: "Lifestyle creator rankings for broad PG creator discovery."
  },
  {
    slug: "top-instagram-models-with-onlyfans",
    title: "Top Instagram Models with OnlyFans",
    pageType: "SOCIAL",
    description: "A social crossover ranking for creators with public Instagram audience signals."
  },
  {
    slug: "top-tiktok-creators-with-onlyfans",
    title: "Top TikTok Creators with OnlyFans",
    pageType: "SOCIAL",
    description: "A social crossover ranking for creators with public TikTok audience signals."
  },
  {
    slug: "top-twitch-streamers-with-onlyfans",
    title: "Top Twitch Streamers with OnlyFans",
    pageType: "SOCIAL",
    description: "A social crossover ranking for creators with public Twitch or streaming audience signals."
  },
  {
    slug: "top-youtubers-with-onlyfans",
    title: "Top YouTubers with OnlyFans",
    pageType: "SOCIAL",
    description: "A social crossover ranking for creators with public YouTube audience signals."
  },
  {
    slug: "instagram-models-with-onlyfans",
    title: "Instagram Models with OnlyFans",
    pageType: "SOCIAL",
    description: "A curated Instagram crossover directory backed by quality and safety controls."
  },
  {
    slug: "tiktok-creators-with-onlyfans",
    title: "TikTok Creators with OnlyFans",
    pageType: "SOCIAL",
    description: "A curated TikTok crossover directory backed by quality and safety controls."
  },
  {
    slug: "twitch-streamers-with-onlyfans",
    title: "Twitch Streamers with OnlyFans",
    pageType: "SOCIAL",
    description: "A curated Twitch crossover directory backed by quality and safety controls."
  },
  {
    slug: "youtubers-with-onlyfans",
    title: "YouTubers with OnlyFans",
    pageType: "SOCIAL",
    description: "A curated YouTube crossover directory backed by quality and safety controls."
  },
  {
    slug: "top-onlyfans-creators-california",
    title: "Top OnlyFans Creators in California",
    pageType: "GEO",
    description: "Public, broad-region California creator rankings. Precise private locations are not published."
  },
  {
    slug: "top-onlyfans-creators-texas",
    title: "Top OnlyFans Creators in Texas",
    pageType: "GEO",
    description: "Public, broad-region Texas creator rankings. Precise private locations are not published."
  },
  {
    slug: "top-onlyfans-creators-florida",
    title: "Top OnlyFans Creators in Florida",
    pageType: "GEO",
    description: "Public, broad-region Florida creator rankings. Precise private locations are not published."
  },
  {
    slug: "top-onlyfans-creators-new-york",
    title: "Top OnlyFans Creators in New York",
    pageType: "GEO",
    description: "Public, broad-region New York creator rankings. Precise private locations are not published."
  },
  {
    slug: "top-onlyfans-creators-london",
    title: "Top OnlyFans Creators in London",
    pageType: "GEO",
    description: "Public London creator rankings based only on broad public or creator-submitted location data."
  },
  {
    slug: "top-onlyfans-creators-uk",
    title: "Top OnlyFans Creators in the UK",
    pageType: "GEO",
    description: "UK creator rankings using broad public or creator-submitted location data only."
  },
  {
    slug: "top-onlyfans-creators-canada",
    title: "Top OnlyFans Creators in Canada",
    pageType: "GEO",
    description: "Canada creator rankings using broad public or creator-submitted location data only."
  },
  {
    slug: "top-canadian-creators",
    title: "Top Canadian Creators",
    pageType: "GEO",
    description: "A curated Canadian creator discovery page with safe public profile controls."
  },
  {
    slug: "top-onlyfans-creators-australia",
    title: "Top OnlyFans Creators in Australia",
    pageType: "GEO",
    description: "Australia creator rankings using broad public or creator-submitted location data only."
  },
  {
    slug: "top-uk-creators",
    title: "Top UK Creators",
    pageType: "GEO",
    description: "A curated UK creator discovery page with safe public profile controls."
  },
  {
    slug: "top-australian-creators",
    title: "Top Australian Creators",
    pageType: "GEO",
    description: "A curated Australian creator discovery page with safe public profile controls."
  }
];

function rankingPage({
  slug,
  title,
  pageType,
  description,
  minCreatorCount = 5,
  entries = ["luna-north", "maya-circuit", "ari-sol", "nova-stitch", "ivy-mode"]
}: (typeof rankingDescriptions)[number]): RankingPage {
  return {
    id: `ranking-${slug}`,
    slug,
    title,
    pageType,
    description,
    introContent:
      "This launch page is built as a curated, editorially controlled ranking. It uses quality thresholds, safe imagery, creator-safe language, broad public location handling, and CreatorStars scoring. Thin or weak variants should stay noindex until enough approved creator profiles exist.",
    seoTitle: `${title} | OnlyCreatorAwards`,
    seoDescription: description,
    isIndexable: entries.length >= minCreatorCount,
    minCreatorCount,
    entries: entries.map((creatorSlug, index) => {
      const profile = creators.find((item) => item.slug === creatorSlug);
      return {
        creatorSlug,
        rank: index + 1,
        score: profile?.creatorStarsScore ?? 50,
        previousRank: index + 2,
        movement: index === 0 ? 1 : 0
      };
    }),
    faqs: commonFaqs,
    relatedSlugs: ["creatorstars", "rising-stars", "top-onlyfans-creators-2026"].filter(
      (relatedSlug) => relatedSlug !== slug
    )
  };
}

export const rankingPages: RankingPage[] = rankingDescriptions.map(rankingPage);

export const comments: Record<string, Array<{ id: string; authorName: string; body: string; status: "APPROVED"; score: number; createdAt: string }>> = {
  "luna-north": [
    {
      id: "comment-1",
      authorName: "VerifiedFan26",
      body: "Strong profile and a clear awards fit. The fitness category feels like the right lane here.",
      status: "APPROVED",
      score: 18,
      createdAt: "2026-06-08"
    }
  ],
  "maya-circuit": [
    {
      id: "comment-2",
      authorName: "StreamWatcher",
      body: "The gaming crossover angle makes this profile easy to discover from Twitch and YouTube pages.",
      status: "APPROVED",
      score: 12,
      createdAt: "2026-06-07"
    }
  ]
};

export const legalPages: LegalPage[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    description: "How OnlyCreatorAwards handles account, voting, moderation, and age-verification status data.",
    robotsIndex: true,
    body: [
      "OnlyCreatorAwards stores account data, public profile interactions, moderation records, and hashed anti-abuse signals needed to operate rankings, awards, comments, claims, and rewards.",
      "Where possible, IP addresses and user-agent values should be hashed before storage. Age verification should be handled by a third-party provider, with only verification status, provider reference, country or state, and timestamps retained.",
      "Users and creators can request corrections, removals, and account support through the removal and correction workflows."
    ]
  },
  {
    slug: "terms",
    title: "Terms of Use",
    description: "Rules for using OnlyCreatorAwards, voting, commenting, claiming profiles, and participating in rewards.",
    robotsIndex: true,
    body: [
      "OnlyCreatorAwards is a PG creator discovery, rankings, awards, and fan rewards platform. Users must not post explicit content, leaked content, private personal information, impersonation, or doxxing.",
      "Voting, nominations, comments, rewards, and claims may be rate-limited, moderated, voided, or rejected for abuse, spam, suspicious activity, or policy violations.",
      "Fan rewards are no purchase necessary, 18+ only, void where prohibited, and subject to official rules, eligibility review, prize caps, and verification."
    ]
  },
  {
    slug: "content-policy",
    title: "Content Policy",
    description: "The PG safety rules for public creator profiles, comments, awards, rankings, and reward pages.",
    robotsIndex: true,
    body: [
      "OnlyCreatorAwards does not host explicit content, leaked content, private personal information, precise private location data, or under-18 creator profiles.",
      "Sensitive or demographic attributes should be creator-submitted, creator-claimed, or based only on obvious public branding. The platform should avoid aggressive inference.",
      "Income, subscriber count, legal-name, and ranking claims require verification before publication."
    ]
  },
  {
    slug: "removal-request",
    title: "Removal Request",
    description: "Request profile removal, profile correction, noindex review, or moderation support.",
    robotsIndex: true,
    body: [
      "Creators can request removal, profile correction, category review, image removal, or noindex status review.",
      "Requests should be routed into a moderation queue with evidence, status, admin notes, and a final resolution record.",
      "Creator-owner accounts may report comments but cannot delete criticism directly."
    ]
  },
  {
    slug: "methodology",
    title: "Methodology",
    description: "How CreatorStars, rankings, awards, indexability, and rewards are calculated.",
    robotsIndex: true,
    body: [
      "CreatorStars is a 0 to 100 score combining fan votes, profile completeness, verification, engagement, freshness, and award performance.",
      "Ranking pages are curated and should be indexable only when they have enough high-quality creator profiles, unique copy, metadata, schema, and internal links.",
      "Weak creator profiles and thin programmatic pages should stay live but noindex, follow until enriched."
    ]
  },
  {
    slug: "age-verification",
    title: "Age Verification",
    description: "How age verification works for 18+ rewards eligibility and prize fulfillment.",
    robotsIndex: true,
    body: [
      "Fan rewards are 18+ only. Winners may need to complete age verification before prize fulfillment.",
      "The preferred approach is a third-party age-verification provider. Only status, provider reference ID, country or state, verified timestamp, and expiration timestamp should be stored.",
      "Full identity documents should not be stored unless absolutely necessary and legally reviewed."
    ]
  }
];

export const currentRewardCampaign: RewardCampaign = {
  id: "reward-2026-06",
  title: "June CreatorStars Fan Rewards",
  slug: "june-2026-creatorstars-fan-rewards",
  month: 6,
  year: 2026,
  startsAt: "2026-06-01",
  endsAt: "2026-06-30",
  status: "ACTIVE",
  prizeDescription:
    "Eligible verified voters can receive a creator subscription credit toward a participating verified creator of their choice.",
  prizeValueCap: 100,
  numberOfWinners: 5,
  eligibilityRules: [
    "Registered account required",
    "Verified email required",
    "18+ only",
    "Age verification required before prize fulfillment",
    "No purchase necessary",
    "Void where prohibited",
    "Suspicious activity may reduce score or disqualify the user"
  ],
  noPurchaseNecessaryText:
    "Each month, eligible verified voters can receive up to $100 in creator subscription credit toward a participating verified creator of their choice. No purchase necessary. 18+ only. Void where prohibited. Official rules apply.",
  officialRulesUrl: "/rewards/rules",
  requiresAgeVerification: true,
  minimumAge: 18
};

const rewardScoreRows = [
  calculateFanRewardScore({
    userId: "user-1",
    campaignId: currentRewardCampaign.id,
    displayName: "VerifiedFan26",
    validAwardVotes: 84,
    nominationsSubmitted: 10,
    approvedUsefulComments: 18,
    creatorProfileShares: 22,
    accountTrust: 92,
    isEligible: true
  }),
  calculateFanRewardScore({
    userId: "user-2",
    campaignId: currentRewardCampaign.id,
    displayName: "AwardWatcher",
    validAwardVotes: 71,
    nominationsSubmitted: 8,
    approvedUsefulComments: 14,
    creatorProfileShares: 19,
    accountTrust: 86,
    isEligible: true
  }),
  calculateFanRewardScore({
    userId: "user-3",
    campaignId: currentRewardCampaign.id,
    displayName: "NewAccountReview",
    validAwardVotes: 95,
    nominationsSubmitted: 2,
    approvedUsefulComments: 1,
    creatorProfileShares: 40,
    accountTrust: 20,
    penaltyPoints: 30,
    isEligible: false,
    ineligibilityReason: "Pending suspicious velocity review"
  })
];

export const fanRewardScores: FanRewardScore[] = rewardScoreRows
  .sort((first, second) => second.totalScore - first.totalScore)
  .map((row, index) => ({ ...row, rank: index + 1 }));

export const adminResources: AdminResource[] = [
  {
    key: "creators",
    label: "Creators",
    description: "Manage public profile data, indexability, verification, and status.",
    rows: creators.map((item) => ({
      name: item.displayName,
      status: item.status,
      score: item.creatorStarsScore,
      indexable: item.isIndexable
    }))
  },
  {
    key: "awards",
    label: "Awards",
    description: "Create award categories, open voting, select finalists, and publish winners.",
    rows: awards.map((item) => ({
      award: `${item.year} ${item.title}`,
      status: item.status,
      nominees: item.nominees.length
    }))
  },
  {
    key: "comments",
    label: "Comments",
    description: "Approve, reject, remove, score, and lock comments on high-risk pages.",
    rows: [
      { queue: "First-comment moderation", pending: 12, linksHeld: 4, spam: 3 },
      { queue: "Award pages", pending: 5, linksHeld: 2, spam: 1 }
    ]
  },
  {
    key: "creator-claims",
    label: "Creator Claims",
    description: "Approve claims, review evidence, and assign creator dashboard access.",
    rows: [
      { creator: "Nova Stitch", method: "SOCIAL_LINK", status: "PENDING" },
      { creator: "Luna North", method: "EMAIL", status: "APPROVED" }
    ]
  },
  {
    key: "ranking-pages",
    label: "Ranking Pages",
    description: "Generate, review, index, noindex, and connect ranking pages to sitemaps.",
    rows: rankingPages.slice(0, 8).map((item) => ({
      page: item.title,
      type: item.pageType,
      minCreators: item.minCreatorCount,
      indexable: item.isIndexable
    }))
  },
  {
    key: "rewards",
    label: "Rewards",
    description: "Configure campaigns, review leaderboards, disqualify abuse, and mark fulfillment.",
    rows: fanRewardScores.map((item) => ({
      fan: item.displayName,
      rank: item.rank,
      score: item.totalScore,
      eligible: item.isEligible
    }))
  },
  {
    key: "models",
    label: "Models",
    description: "Review imported model rows, source order, popularity signals, categories, and outbound links.",
    rows: [{ state: "Runtime cache", source: "Traffichaus JSON", order: "Preserve source order" }]
  },
  {
    key: "model-sections",
    label: "Model Sections",
    description: "Manage section visibility, keyword fill, and manual top-three overrides per category.",
    rows: [{ state: "Runtime cache", overrides: "Top 3 per section", fill: "Popularity" }]
  },
  {
    key: "model-imports",
    label: "Model Imports",
    description: "Monitor the daily Traffichaus import, parser status, cache freshness, and cron command.",
    rows: [{ cadence: "Daily", source: "Traffichaus", cache: "data/traffichaus-models.json" }]
  },
  {
    key: "blog-posts",
    label: "Blog Posts",
    description: "Plan category watchlists, awards editorials, and profile-link content for SEO and AI search.",
    rows: [
      { post: "How Creator Awards Watchlists Work", status: "PUBLISHED", links: "Models, sections, profiles" },
      { post: "Top OnlyFans Category Blog Framework", status: "PUBLISHED", links: "Sections, criteria" }
    ]
  }
];
