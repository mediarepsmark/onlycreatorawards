import type { CampaignDraft, TrafficHausPayload, ValidationResult } from "@/types/campaign";

export const defaultCampaignDraft: CampaignDraft = {
  campaignName: "CPCAdvertising.com - AI Click Campaign",
  objective: "traffic",
  isNsfw: false,
  productSourceUrl: "https://app.cpcadvertising.com/campaigns/new",
  productName: "CPCAdvertising.com",
  extractedProduct: {
    sourceUrl: "",
    title: "",
    description: "",
    imageUrl: "",
    siteName: ""
  },
  offerDescription:
    "Customer provides a product URL, CPCAdvertising.com generates the ads and drives paid clicks.",
  landingPageUrl: "https://app.cpcadvertising.com/campaigns/new",
  displayUrl: "app.cpcadvertising.com",
  restrictions: "Avoid misleading claims, prohibited categories, and unsupported guarantees.",
  customerApprovalMode: "auto_run",
  targetCustomer: "People actively comparing solutions and ready to click through.",
  keyBenefit: "Quickly turns a product URL into ads, targeting, and paid clicks.",
  brandTone: "Confident, direct, helpful, and performance-focused.",
  visualDirection: "Clean product-led creative with a strong headline and clear click cue.",
  offerAngle: "Make paid clicks simple without building ads yourself.",
  callToAction: "See the product",
  geoTargets: ["united states"],
  deviceTargets: ["desktop", "mobile", "tablet"],
  languageTargets: ["english"],
  operatingSystems: ["ios", "android", "windows", "macos"],
  browsers: ["chrome", "firefox", "safari", "edge"],
  carriers: [],
  keywords: ["performance marketing", "native advertising", "paid traffic"],
  zoneTargeting: [],
  partnerChannels: ["google", "instagram", "snapchat", "outbrain", "taboola", "nativo", "traffichaus"],
  siteTargeting: "Run-of-Network",
  adLocation: "Native",
  adType: "Native Model Widget",
  creativeType: "banners",
  frequencyCapType: "site",
  frequencyCapValue: 2,
  bidType: "cpc",
  bidAmount: "0.25",
  dailyBudget: "50",
  totalBudget: "250",
  creativeUrl: "https://app.cpcadvertising.com/brand/cpcadvertising-logo.png",
  headline: "Get qualified clicks without building ads yourself",
  description: "Share your product URL and CPCAdvertising.com generates ads, targets buyers, and drives clicks."
};

const joinCsv = (items: string[]) =>
  items
    .map((item) => item.trim())
    .filter(Boolean)
    .join(", ");

export const csvToArray = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

export const mapCampaignToTrafficHausPayload = (
  campaign: CampaignDraft
): TrafficHausPayload => ({
  target: "bid_ad",
  action: "create",
  name: campaign.campaignName.trim(),
  is_nsfw: campaign.isNsfw ? "1" : "0",
  geo: joinCsv(campaign.geoTargets),
  device_type: joinCsv(campaign.deviceTargets),
  ad_location: campaign.adLocation.trim(),
  ad_type: campaign.adType.trim(),
  site_targeting: campaign.siteTargeting.trim(),
  frequency_cap_type: campaign.frequencyCapType.trim(),
  frequency_cap_value: campaign.frequencyCapValue,
  languages: joinCsv(campaign.languageTargets),
  operating_systems: joinCsv(campaign.operatingSystems),
  browsers: joinCsv(campaign.browsers),
  carriers: joinCsv(campaign.carriers),
  keywords: joinCsv(campaign.keywords),
  bid_type: campaign.bidType.trim(),
  bid_amount: campaign.bidAmount.trim(),
  daily_budget: campaign.dailyBudget.trim(),
  total_budget: campaign.totalBudget.trim(),
  zone_targeting: joinCsv(campaign.zoneTargeting),
  creative: {
    type: campaign.creativeType.trim(),
    creative_url: campaign.creativeUrl.trim(),
    destination_url: campaign.landingPageUrl.trim(),
    ad_url: campaign.displayUrl.trim(),
    title: campaign.headline.trim(),
    message: campaign.description.trim()
  }
});

export const validateTrafficHausPayload = (payload: TrafficHausPayload): ValidationResult => {
  const errors: string[] = [];
  const requireField = (value: string | undefined, label: string) => {
    if (!value || !value.trim()) errors.push(`${label} is required.`);
  };

  requireField(payload.name, "Campaign name");
  requireField(payload.geo, "Geo");
  requireField(payload.device_type, "Device type");
  requireField(payload.ad_location, "Ad location");
  requireField(payload.ad_type, "Ad type");
  requireField(payload.site_targeting, "Site targeting");
  requireField(payload.bid_type, "Bid type");
  requireField(payload.bid_amount, "Bid amount");

  if (!payload.creative) {
    errors.push("Creative is required.");
  } else {
    requireField(payload.creative.creative_url, "Creative URL");
    requireField(payload.creative.destination_url, "Destination URL");
    requireField(payload.creative.title, "Title");
    requireField(payload.creative.message, "Message");
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
