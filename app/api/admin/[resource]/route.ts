import { NextResponse } from "next/server";

import { requireRole } from "@/lib/onlycreatorawards/auth";
import { getAdminResource } from "@/lib/onlycreatorawards/repository";

type AdminResourceRouteProps = {
  params: Promise<{ resource: string }>;
};

export async function GET(_request: Request, { params }: AdminResourceRouteProps) {
  const { allowed } = requireRole(["ADMIN", "MODERATOR"]);
  if (!allowed) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const { resource } = await params;
  return NextResponse.json({ ok: true, resource: getAdminResource(resource) });
}

export async function POST(request: Request, { params }: AdminResourceRouteProps) {
  const { allowed } = requireRole(["ADMIN"]);
  if (!allowed) return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });

  const { resource } = await params;
  const payload = await request.json().catch(() => ({}));

  return NextResponse.json(
    {
      ok: true,
      status: "repository_write_not_connected",
      resource,
      payload,
      nextStep: "Persist through Prisma with audit logging and role checks."
    },
    { status: 202 }
  );
}
