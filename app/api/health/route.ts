import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    ok: true,
    service: "onlycreatorawards",
    checkedAt: new Date().toISOString()
  });
}
