import { FileText } from "lucide-react";

import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentRewardCampaign, siteConfig } from "@/lib/onlycreatorawards/repository";
import { buildMetadata } from "@/lib/onlycreatorawards/seo";

export const metadata = buildMetadata({
  title: "Fan Rewards Rules | OnlyCreatorAwards",
  description:
    "Official monthly fan voter rewards rules covering eligibility, no purchase necessary, age verification, prize caps, tax responsibility, and anti-abuse review.",
  path: "/rewards/rules"
});

export default function RewardRulesPage() {
  const campaign = getCurrentRewardCampaign();
  const rules = [
    "No purchase necessary to participate or win.",
    "18+ only. Void where prohibited.",
    "Users must be registered, email verified, not banned, and compliant with official rules.",
    "Age verification may be required before prize fulfillment.",
    "Winners must select a participating verified creator and the prize value cannot exceed the campaign cap.",
    "Suspicious votes, spam comments, duplicate accounts, bot behavior, or abuse can reduce score or disqualify a user.",
    "Taxes, if any, are the responsibility of the winner unless official rules state otherwise.",
    "Admin may pause, cancel, audit, or disqualify activity to protect the integrity of the campaign."
  ];

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Official rules"
        title="CreatorStars Fan Rewards Rules"
        description={campaign.noPurchaseNecessaryText}
      />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="space-y-5">
              <Badge className="bg-amber-50 text-brand-amber">
                <FileText className="mr-1 h-4 w-4" aria-hidden="true" />
                Prize cap ${campaign.prizeValueCap}
              </Badge>
              <ul className="space-y-3 leading-7 text-muted">
                {rules.map((rule) => (
                  <li key={rule}>{rule}</li>
                ))}
              </ul>
              <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-muted">{siteConfig.disclaimer}</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </SiteShell>
  );
}
