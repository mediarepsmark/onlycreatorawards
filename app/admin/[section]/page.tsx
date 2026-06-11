import Link from "next/link";
import { notFound } from "next/navigation";
import { Ban, CheckCircle, Download, Gift, Lock, PauseCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { AdminResourceTable } from "@/components/onlycreatorawards/AdminResourceTable";
import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { RewardLeaderboard } from "@/components/onlycreatorawards/RewardLeaderboard";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/onlycreatorawards/auth";
import { getAdminResource, getAdminResources, getCurrentRewardCampaign, getFanRewardScores } from "@/lib/onlycreatorawards/repository";
import { buildMetadata } from "@/lib/onlycreatorawards/seo";

type AdminSectionPageProps = {
  params: Promise<{ section: string }>;
};

export function generateStaticParams() {
  return getAdminResources().map((resource) => ({ section: resource.key }));
}

export async function generateMetadata({ params }: AdminSectionPageProps) {
  const { section } = await params;
  const resource = getAdminResource(section);

  return buildMetadata({
    title: `${resource.label} Admin | OnlyCreatorAwards`,
    description: resource.description,
    path: `/admin/${section}`,
    index: false
  });
}

function RewardsAdminPanel() {
  const campaign = getCurrentRewardCampaign();
  const scores = getFanRewardScores();
  const controls: Array<{ title: string; body: string; Icon: LucideIcon }> = [
    {
      title: "Create campaign",
      body: "Set month, dates, prize cap, winners, point formula, and daily caps.",
      Icon: Gift
    },
    {
      title: "Review abuse",
      body: "Inspect suspicious users, velocity flags, duplicate accounts, and voided votes.",
      Icon: Ban
    },
    {
      title: "Approve winners",
      body: "Require age verification, approve selected creators, and mark fulfillment.",
      Icon: CheckCircle
    },
    {
      title: "Export records",
      body: "Export winner, prize, tax, campaign, and audit records.",
      Icon: Download
    }
  ];

  return (
    <div className="space-y-6">
      <RewardLeaderboard campaign={campaign} scores={scores} />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        {controls.map(({ title, body, Icon }) => (
          <Card key={title}>
            <CardContent>
              <Icon className="h-8 w-8 text-brand-blue" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black text-ink">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">{body}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardContent>
          <PauseCircle className="h-8 w-8 text-brand-amber" aria-hidden="true" />
          <h2 className="mt-4 text-xl font-black text-ink">Campaign controls</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Admin can pause, cancel, close, fulfill, complete, or audit reward campaigns before publishing winners.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default async function AdminSectionPage({ params }: AdminSectionPageProps) {
  const { section } = await params;
  const { allowed, user } = requireRole(["ADMIN", "MODERATOR"]);
  const resource = getAdminResource(section);

  if (!resource) notFound();

  return (
    <SiteShell>
      <PageHeader eyebrow="Admin resource" title={resource.label} description={resource.description} />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto max-w-7xl space-y-6 px-4 sm:px-6 lg:px-8">
          {!allowed ? (
            <Card>
              <CardContent>
                <Lock className="h-8 w-8 text-brand-rose" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-black text-ink">Access denied</h2>
                <p className="mt-3 text-muted">Current role: {user.role}. Admin or moderator access is required.</p>
                <Link href="/login" className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-ink px-4 font-extrabold text-white">
                  Login
                </Link>
              </CardContent>
            </Card>
          ) : (
            <>
              <AdminResourceTable resource={resource} />
              {section === "rewards" ? <RewardsAdminPanel /> : null}
            </>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
