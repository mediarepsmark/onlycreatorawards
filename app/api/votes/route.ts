import { NextResponse } from "next/server";

const allowedVoteTypes = new Set(["CREATOR_STAR", "AWARD_VOTE", "UPVOTE", "FAN_FAVORITE", "CATEGORY_VOTE", "RISING_STAR"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const voteType = String(formData.get("voteType") ?? "");
  const creatorSlug = String(formData.get("creatorSlug") ?? "");
  const awardSlug = String(formData.get("awardSlug") ?? "");
  const context = String(formData.get("context") ?? "");

  if (!allowedVoteTypes.has(voteType)) {
    return NextResponse.json({ ok: false, error: "Unsupported vote type." }, { status: 400 });
  }

  return NextResponse.json(
    {
      ok: true,
      status: "queued_for_repository",
      vote: {
        voteType,
        creatorSlug,
        awardSlug,
        context,
        requiresLogin: true,
        antiAbuse: ["dedupe_user", "hash_ip", "hash_user_agent", "velocity_review"]
      }
    },
    { status: 202 }
  );
}
