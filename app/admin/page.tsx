import Link from "next/link";
import { Lock, Settings } from "lucide-react";

import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { requireRole } from "@/lib/onlycreatorawards/auth";
import { getAdminResources } from "@/lib/onlycreatorawards/repository";
import { buildMetadata } from "@/lib/onlycreatorawards/seo";

export const metadata = buildMetadata({
  title: "Admin Dashboard | OnlyCreatorAwards",
  description: "Admin dashboard for creators, users, comments, votes, awards, claims, SEO, sitemaps, analytics, and rewards.",
  path: "/admin",
  index: false
});

export default function AdminPage() {
  const { allowed, user } = requireRole(["ADMIN", "MODERATOR"]);
  const resources = getAdminResources();

  return (
    <SiteShell>
      <PageHeader
        eyebrow="Protected admin"
        title="Admin dashboard"
        description="Manage creators, awards, categories, voting, comments, moderation, claims, rewards, SEO, sitemaps, users, and analytics."
      />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {!allowed ? (
            <Card>
              <CardContent>
                <Lock className="h-8 w-8 text-brand-rose" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-black text-ink">Access denied</h2>
                <p className="mt-3 text-muted">Current role: {user.role}. Admin or moderator access is required.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {resources.map((resource) => (
                <Link key={resource.key} href={`/admin/${resource.key}`}>
                  <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-panel">
                    <CardContent>
                      <div className="flex items-start justify-between gap-4">
                        <Settings className="h-8 w-8 text-brand-blue" aria-hidden="true" />
                        <Badge className="bg-slate-100 text-ink">{resource.rows.length} rows</Badge>
                      </div>
                      <h2 className="mt-5 text-2xl font-black text-ink">{resource.label}</h2>
                      <p className="mt-3 text-sm leading-6 text-muted">{resource.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </SiteShell>
  );
}
