import { NextResponse } from "next/server";

import { getTrafficHausAdvertiserStats } from "@/lib/traffichaus";
import type { TrafficHausStatsParams } from "@/types/campaign";

export const runtime = "nodejs";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const params: TrafficHausStatsParams = {
      start_date: searchParams.get("start_date") || "",
      end_date: searchParams.get("end_date") || "",
      campaigns: searchParams.get("campaigns") || undefined,
      group_by: searchParams.get("group_by") || "campaign,date",
      format: searchParams.get("format") || "1"
    };

    const errors: string[] = [];
    if (!datePattern.test(params.start_date)) {
      errors.push("start_date must use YYYY-MM-DD.");
    }
    if (!datePattern.test(params.end_date)) {
      errors.push("end_date must use YYYY-MM-DD.");
    }

    if (errors.length) {
      return NextResponse.json(
        {
          ok: false,
          message: "Stats request is missing required date values.",
          errors
        },
        { status: 400 }
      );
    }

    const result = await getTrafficHausAdvertiserStats(params);

    return NextResponse.json({
      ok: true,
      message: result.mode === "mock" ? "Mock advertiser stats loaded." : "TrafficHaus stats loaded.",
      data: result
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "Unable to load TrafficHaus stats."
      },
      { status: 500 }
    );
  }
}
