import type { MetadataRoute } from "next";

import { absoluteUrl, siteConfig } from "@/lib/onlycreatorawards/repository";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/dashboard/",
          "/creator-dashboard",
          "/login",
          "/register",
          "/search",
          "/*?*"
        ]
      }
    ],
    sitemap: [
      absoluteUrl("/sitemap.xml"),
      `${siteConfig.url}/sitemaps/creators-1.xml`,
      `${siteConfig.url}/sitemaps/categories.xml`,
      `${siteConfig.url}/sitemaps/awards.xml`,
      `${siteConfig.url}/sitemaps/rankings.xml`,
      `${siteConfig.url}/sitemaps/editorial.xml`
    ]
  };
}
