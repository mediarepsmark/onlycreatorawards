import { NextResponse } from "next/server";

import {
  mapCampaignToTrafficHausPayload,
  validateTrafficHausPayload
} from "@/lib/campaignMapper";
import { createTrafficHausCampaign } from "@/lib/traffichaus";
import type { CampaignDraft } from "@/types/campaign";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { campaign?: CampaignDraft };
    const campaign = body.campaign;

    if (!campaign) {
      return NextResponse.json(
        {
          ok: false,
          message: "Missing campaign data.",
          errors: ["Request body must include a campaign object."]
        },
        { status: 400 }
      );
    }

    const payload = mapCampaignToTrafficHausPayload(campaign);
    const validation = validateTrafficHausPayload(payload);

    if (!validation.valid) {
      return NextResponse.json(
        {
          ok: false,
          message: "Campaign is missing required TrafficHaus fields.",
          errors: validation.errors,
          payload
        },
        { status: 400 }
      );
    }

    const result = await createTrafficHausCampaign(payload);

    return NextResponse.json({
      ok: true,
      message:
        result.mode === "mock"
          ? "Mock campaign created. Set NEXT_PUBLIC_MOCK_TRAFFICHAUS=false and TRAFFICHAUS_ADVERTISER_API_KEY for live submission."
          : "TrafficHaus campaign created.",
      data: result,
      payload
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create TrafficHaus campaign.";
    return NextResponse.json(
      {
        ok: false,
        message
      },
      { status: message.includes("advertiser API key") ? 503 : 500 }
    );
  }
}
