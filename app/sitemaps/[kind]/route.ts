import {
  absoluteUrl,
  getAwardYears,
  getAwards,
  getCategories,
  getIndexableCreators,
  getLegalPages,
  getRankingPages
} from "@/lib/onlycreatorawards/repository";

type SitemapRouteProps = {
  params: Promise<{ kind: string }>;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function xmlFor(urls: string[]) {
  const body = urls
    .map((url) => {
      return `<url><loc>${escapeXml(absoluteUrl(url))}</loc><changefreq>weekly</changefreq></url>`;
    })
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>`;
}

function urlsForKind(kind: string) {
  switch (kind.replace(/\.xml$/, "")) {
    case "creators-1":
      return getIndexableCreators().map((creator) => `/creator/${creator.slug}`);
    case "categories":
      return getCategories()
        .filter((category) => category.isIndexable)
        .map((category) => `/category/${category.slug}`);
    case "awards":
      return [
        "/awards",
        ...getAwardYears().map((year) => `/awards/${year}`),
        ...getAwards().map((award) => `/awards/${award.year}/${award.slug}`)
      ];
    case "rankings":
      return getRankingPages()
        .filter((page) => page.isIndexable)
        .map((page) => `/${page.slug}`);
    case "editorial":
      return [
        "/",
        "/creators",
        "/categories",
        "/claim-profile",
        "/rewards",
        "/rewards/monthly",
        "/rewards/rules",
        "/rewards/winners",
        ...getLegalPages()
          .filter((page) => page.robotsIndex)
          .map((page) => `/${page.slug}`)
      ];
    default:
      return [];
  }
}

export async function GET(_request: Request, { params }: SitemapRouteProps) {
  const { kind } = await params;
  const urls = urlsForKind(kind);

  return new Response(xmlFor(urls), {
    headers: {
      "content-type": "application/xml; charset=utf-8"
    }
  });
}
