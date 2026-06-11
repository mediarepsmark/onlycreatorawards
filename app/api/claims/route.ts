import { NextResponse } from "next/server";

const allowedMethods = new Set(["SOCIAL_LINK", "EMAIL", "MANUAL", "PLATFORM_MESSAGE"]);

export async function POST(request: Request) {
  const formData = await request.formData();
  const creator = String(formData.get("creator") ?? "").trim();
  const verificationMethod = String(formData.get("verificationMethod") ?? "");
  const verificationEvidence = String(formData.get("verificationEvidence") ?? "").trim();

  if (!creator || !allowedMethods.has(verificationMethod) || verificationEvidence.length < 8) {
    return NextResponse.json({ ok: false, error: "Claim requires a creator, method, and verification evidence." }, { status: 400 });
  }

  return NextResponse.json(
    {
      ok: true,
      status: "pending_admin_review",
      claim: {
        creator,
        verificationMethod,
        evidenceLength: verificationEvidence.length,
        creatorEditsRequireModeration: true
      }
    },
    { status: 202 }
  );
}
