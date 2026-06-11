import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const body = String(formData.get("body") ?? "").trim();
  const targetType = String(formData.get("targetType") ?? "");
  const targetSlug = String(formData.get("targetSlug") ?? "");

  if (body.length < 12) {
    return NextResponse.json({ ok: false, error: "Comment is too short." }, { status: 400 });
  }

  return NextResponse.json(
    {
      ok: true,
      status: "pending_moderation",
      comment: {
        targetType,
        targetSlug,
        length: body.length,
        moderationRules: ["first_comment_hold", "link_hold", "banned_word_hold", "rate_limit"]
      }
    },
    { status: 202 }
  );
}
