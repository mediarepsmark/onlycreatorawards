import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const formData = await request.formData();
  const mode = String(formData.get("mode") ?? "login");
  const email = String(formData.get("email") ?? "").trim();

  if (!email.includes("@")) {
    return NextResponse.json({ ok: false, error: "Valid email is required." }, { status: 400 });
  }

  return NextResponse.json(
    {
      ok: true,
      status: "auth_provider_not_connected",
      mode,
      nextStep: "Connect NextAuth or Clerk and persist users through Prisma."
    },
    { status: 202 }
  );
}
