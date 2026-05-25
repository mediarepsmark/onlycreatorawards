import "server-only";

import type {
  TrafficHausCreateResponse,
  TrafficHausPayload,
  TrafficHausStatsParams
} from "@/types/campaign";

const getTrafficHausBaseUrl = () =>
  (process.env.TRAFFICHAUS_API_BASE_URL || "http://admin.traffichaus.com/api/v1").replace(/\/$/, "");

const isMockMode = () => process.env.NEXT_PUBLIC_MOCK_TRAFFICHAUS !== "false";

const getAdvertiserApiKey = () => process.env.TRAFFICHAUS_ADVERTISER_API_KEY;

const getStatsApiKey = () =>
  process.env.TRAFFICHAUS_STATS_API_KEY ||
  process.env.TRAFFICHAUS_PUBLISHER_API_KEY ||
  process.env.TRAFFICHAUS_API_KEY;

const parseTrafficHausResponse = async (response: Response) => {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
};

export const createTrafficHausCampaign = async (
  payload: TrafficHausPayload
): Promise<TrafficHausCreateResponse> => {
  const apiKey = getAdvertiserApiKey();

  if (isMockMode()) {
    return {
      mode: "mock",
      status: 200,
      payload,
      data: {
        campaign_id: `mock-${Date.now()}`,
        status: "created",
        message: "Mock TrafficHaus campaign created."
      }
    };
  }

  if (!apiKey) {
    throw new Error(
      "TrafficHaus advertiser API key is not configured. Add TRAFFICHAUS_ADVERTISER_API_KEY before live campaign creation."
    );
  }

  const url = new URL(`${getTrafficHausBaseUrl()}/v1.php`);
  url.searchParams.set("api_key", apiKey);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json"
    },
    body: JSON.stringify(payload),
    cache: "no-store"
  });
  const data = await parseTrafficHausResponse(response);

  if (!response.ok) {
    throw new Error(`TrafficHaus campaign creation failed with status ${response.status}.`);
  }

  return {
    mode: "live",
    status: response.status,
    payload,
    data
  };
};

export const getTrafficHausAdvertiserStats = async (params: TrafficHausStatsParams) => {
  const apiKey = getStatsApiKey();

  if (isMockMode() || !apiKey) {
    return {
      mode: "mock",
      status: 200,
      data: [
        {
          campaign: params.campaigns || "mock-campaign",
          date: params.start_date,
          impressions: 42850,
          clicks: 713,
          spend: 91.62,
          conversions: 38
        }
      ]
    };
  }

  const url = new URL(`${getTrafficHausBaseUrl()}/advertiser_stats.php`);
  url.searchParams.set("api_key", apiKey);
  url.searchParams.set("start_date", params.start_date);
  url.searchParams.set("end_date", params.end_date);
  url.searchParams.set("group_by", params.group_by || "campaign,date");
  url.searchParams.set("format", params.format || "1");
  if (params.campaigns) url.searchParams.set("campaigns", params.campaigns);

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json"
    },
    cache: "no-store"
  });
  const data = await parseTrafficHausResponse(response);

  if (!response.ok) {
    throw new Error(`TrafficHaus stats request failed with status ${response.status}.`);
  }

  return {
    mode: "live",
    status: response.status,
    data
  };
};
