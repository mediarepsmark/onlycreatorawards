import { NextResponse } from "next/server";

import type { ApiResult, ExtractedProduct } from "@/types/campaign";

const IMAGE_EXTENSIONS = /\.(avif|gif|jpe?g|png|webp)(\?.*)?$/i;

const PRIVATE_HOST_PATTERNS = [
  /^localhost$/i,
  /^127\./,
  /^10\./,
  /^192\.168\./,
  /^169\.254\./,
  /^172\.(1[6-9]|2\d|3[0-1])\./,
  /^\[?::1\]?$/i
];

const decodeEntities = (value: string) =>
  value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();

const getMeta = (html: string, key: string) => {
  const escapedKey = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const patterns = [
    new RegExp(`<meta[^>]+property=["']${escapedKey}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+name=["']${escapedKey}["'][^>]+content=["']([^"']+)["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']${escapedKey}["'][^>]*>`, "i"),
    new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+name=["']${escapedKey}["'][^>]*>`, "i")
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match?.[1]) return decodeEntities(match[1]);
  }

  return "";
};

const getTitle = (html: string) => decodeEntities(html.match(/<title[^>]*>([^<]+)<\/title>/i)?.[1] || "");

const productNameFromUrl = (url: URL) => {
  const pathName = url.pathname
    .split("/")
    .filter(Boolean)
    .at(-1)
    ?.replace(/\.[a-z0-9]+$/i, "")
    .replace(/[-_+]/g, " ")
    .trim();

  const hostName = url.hostname.replace(/^www\./, "").replace(/\.[a-z]{2,}$/i, "").replace(/[-_]/g, " ");
  return pathName || hostName;
};

const isSafeUrl = (url: URL) => {
  if (!["http:", "https:"].includes(url.protocol)) return false;
  return !PRIVATE_HOST_PATTERNS.some((pattern) => pattern.test(url.hostname));
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { url?: string };
    const rawUrl = body.url?.trim();

    if (!rawUrl) {
      return NextResponse.json<ApiResult<ExtractedProduct>>(
        { ok: false, message: "Product or creative URL is required.", errors: ["Missing URL."] },
        { status: 400 }
      );
    }

    const normalizedUrl = /^https?:\/\//i.test(rawUrl) ? rawUrl : `https://${rawUrl}`;
    const url = new URL(normalizedUrl);
    if (!isSafeUrl(url)) {
      return NextResponse.json<ApiResult<ExtractedProduct>>(
        { ok: false, message: "Only public http or https product URLs can be scanned.", errors: ["Unsupported URL."] },
        { status: 400 }
      );
    }

    if (IMAGE_EXTENSIONS.test(url.pathname)) {
      const product: ExtractedProduct = {
        sourceUrl: url.toString(),
        title: productNameFromUrl(url),
        description: `Creative reference from ${url.hostname.replace(/^www\./, "")}.`,
        imageUrl: url.toString(),
        siteName: url.hostname.replace(/^www\./, "")
      };

      return NextResponse.json<ApiResult<ExtractedProduct>>({
        ok: true,
        message: "Creative reference URL imported.",
        data: product
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "CPCAdvertisingBot/1.0 (+https://app.cpcadvertising.com)"
      },
      signal: AbortSignal.timeout(10000)
    });

    if (!response.ok) {
      return NextResponse.json<ApiResult<ExtractedProduct>>(
        {
          ok: false,
          message: `Unable to scan URL. Remote server returned ${response.status}.`,
          errors: [`Remote status ${response.status}`]
        },
        { status: 502 }
      );
    }

    const html = (await response.text()).slice(0, 250000);
    const imageUrl = getMeta(html, "og:image") || getMeta(html, "twitter:image");
    const absoluteImageUrl = imageUrl ? new URL(imageUrl, url).toString() : "";
    const title = getMeta(html, "og:title") || getMeta(html, "twitter:title") || getTitle(html) || productNameFromUrl(url);
    const description =
      getMeta(html, "og:description") ||
      getMeta(html, "twitter:description") ||
      getMeta(html, "description") ||
      `Product page from ${url.hostname.replace(/^www\./, "")}.`;
    const siteName = getMeta(html, "og:site_name") || url.hostname.replace(/^www\./, "");

    return NextResponse.json<ApiResult<ExtractedProduct>>({
      ok: true,
      message: "Product details pulled from URL.",
      data: {
        sourceUrl: url.toString(),
        title,
        description,
        imageUrl: absoluteImageUrl,
        siteName
      }
    });
  } catch (error) {
    return NextResponse.json<ApiResult<ExtractedProduct>>(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unable to extract product details.",
        errors: ["Product extraction failed."]
      },
      { status: 400 }
    );
  }
}
