export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  categorySlugs: string[];
  body: string[];
  ctaLabel: string;
  ctaHref: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-creator-awards-watchlists-work",
    title: "How Creator Awards Watchlists Work",
    description:
      "A practical guide to building top creator lists around source data, fan interest, editorial context, and award-season momentum.",
    publishedAt: "2026-06-17",
    categorySlugs: ["all", "uncategorized"],
    ctaLabel: "Browse the model directory",
    ctaHref: "/models",
    body: [
      "OnlyCreatorAwards watchlists are built like award-season shortlists: source ordering matters, audience behavior matters, and editors need room to pin breakout creators when the raw feed misses the larger story.",
      "For directory pages, the baseline order starts with the imported source feed. For category pages, admins can manually pin the top three positions, then the rest of the list fills by popularity signals such as clicks, views, feed ranking, and public engagement metrics.",
      "This gives each article a clear linking path: introduce the category, cite the ranking criteria, link to the live section, and spotlight individual creator profiles that deserve more context."
    ]
  },
  {
    slug: "top-onlyfans-category-blog-framework",
    title: "A Better Framework for Top OnlyFans Category Blogs",
    description:
      "Use category pages, profile links, CreatorStars signals, and award eligibility language to make keyword-driven blogs useful instead of thin.",
    publishedAt: "2026-06-17",
    categorySlugs: ["fitness", "cosplay", "gamer", "lifestyle"],
    ctaLabel: "Explore model sections",
    ctaHref: "/models",
    body: [
      "The strongest category blogs should not read like a copied list of names. They should explain why the category has fan demand, how creators are selected, and what signals affect the live ranking.",
      "A useful post can link to the live category section, mention that the top three may be editorially pinned, and then point readers to individual profile pages for current images, source keywords, OnlyFans links, and popularity stats.",
      "That structure supports search, AI answer engines, and returning users because the article is not the only destination. It becomes a hub that routes people to updated pages."
    ]
  },
  {
    slug: "monthly-voting-and-creator-discovery",
    title: "Monthly Voting Turns Discovery Into an Awards Story",
    description:
      "How voting, rewards, and CreatorStars can turn a directory into a recurring creator awards property.",
    publishedAt: "2026-06-17",
    categorySlugs: ["all"],
    ctaLabel: "Start voting",
    ctaHref: "/awards/2026",
    body: [
      "A directory answers who exists. An awards platform answers who is rising, who fans are backing, and which creators are building momentum right now.",
      "OnlyCreatorAwards can use monthly voting, CreatorStars scores, comments, claims, and rewards to keep category pages fresh while giving fans a reason to return.",
      "The editorial opportunity is to connect every blog post to a voting action, a live ranking, and a creator profile instead of leaving readers at the end of an article."
    ]
  }
];

export function getBlogPosts() {
  return [...blogPosts].sort((first, second) => second.publishedAt.localeCompare(first.publishedAt));
}

export function getBlogPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}
