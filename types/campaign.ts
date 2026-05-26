export type CampaignObjective =
  | "traffic"
  | "conversions"
  | "lead_generation"
  | "retargeting";

export type CampaignWizardStep =
  | "objective"
  | "offer"
  | "targeting"
  | "ad-format"
  | "budget"
  | "creative"
  | "review";

export type CustomerApprovalMode = "auto_run" | "review_first";

export type PartnerChannel =
  | "google"
  | "instagram"
  | "snapchat"
  | "outbrain"
  | "taboola"
  | "nativo"
  | "traffichaus";

export interface ExtractedProduct {
  sourceUrl: string;
  title: string;
  description: string;
  imageUrl: string;
  siteName: string;
}

export interface CampaignDraft {
  campaignName: string;
  objective: CampaignObjective;
  isNsfw: boolean;
  productSourceUrl: string;
  productName: string;
  extractedProduct: ExtractedProduct;
  offerDescription: string;
  landingPageUrl: string;
  displayUrl: string;
  restrictions: string;
  customerApprovalMode: CustomerApprovalMode;
  targetCustomer: string;
  keyBenefit: string;
  brandTone: string;
  visualDirection: string;
  offerAngle: string;
  callToAction: string;
  geoTargets: string[];
  deviceTargets: string[];
  languageTargets: string[];
  operatingSystems: string[];
  browsers: string[];
  carriers: string[];
  keywords: string[];
  zoneTargeting: string[];
  partnerChannels: PartnerChannel[];
  siteTargeting: string;
  adLocation: string;
  adType: string;
  creativeType: string;
  frequencyCapType: string;
  frequencyCapValue: number;
  bidType: string;
  bidAmount: string;
  dailyBudget: string;
  totalBudget: string;
  creativeUrl: string;
  headline: string;
  description: string;
}

export interface TrafficHausPayload {
  target: "bid_ad";
  action: "create";
  name: string;
  is_nsfw: "0" | "1";
  geo: string;
  device_type: string;
  ad_location: string;
  ad_type: string;
  site_targeting: string;
  frequency_cap_type: string;
  frequency_cap_value: number;
  languages: string;
  operating_systems: string;
  browsers: string;
  carriers: string;
  keywords: string;
  bid_type: string;
  bid_amount: string;
  daily_budget: string;
  total_budget: string;
  zone_targeting: string;
  creative: {
    type: string;
    creative_url: string;
    destination_url: string;
    ad_url: string;
    title: string;
    message: string;
  };
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface TrafficHausCreateResponse {
  mode: "mock" | "live";
  status: number;
  payload: TrafficHausPayload;
  data: unknown;
}

export interface TrafficHausStatsParams {
  start_date: string;
  end_date: string;
  campaigns?: string;
  group_by?: string;
  format?: string;
}

export interface ApiResult<T> {
  ok: boolean;
  message: string;
  data?: T;
  errors?: string[];
}

export interface CampaignStepProps {
  draft: CampaignDraft;
  updateDraft: (patch: Partial<CampaignDraft>) => void;
}
