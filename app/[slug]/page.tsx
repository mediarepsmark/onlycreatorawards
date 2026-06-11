import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  FileText,
  Flag,
  Gift,
  LayoutDashboard,
  Lock,
  MapPin,
  Search,
  ShieldCheck,
  Trophy,
  UserPlus
} from "lucide-react";

import { CreatorCard } from "@/components/onlycreatorawards/CreatorCard";
import { JsonLd } from "@/components/onlycreatorawards/JsonLd";
import { PageHeader } from "@/components/onlycreatorawards/PageHeader";
import { RankingTable } from "@/components/onlycreatorawards/RankingTable";
import { RewardLeaderboard } from "@/components/onlycreatorawards/RewardLeaderboard";
import { SearchPanel } from "@/components/onlycreatorawards/SearchPanel";
import { SiteShell } from "@/components/onlycreatorawards/SiteShell";
import { VotePanel } from "@/components/onlycreatorawards/VotePanel";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getCurrentRewardCampaign,
  getFanRewardScores,
  getLegalPage,
  getLegalPages,
  getRankingCreators,
  getRankingPageBySlug,
  getRankingPages,
  siteConfig
} from "@/lib/onlycreatorawards/repository";
import { breadcrumbSchema, buildMetadata, faqSchema, itemListSchema } from "@/lib/onlycreatorawards/seo";
import type { LegalPage, RankingPage } from "@/lib/onlycreatorawards/types";

type RootSlugPageProps = {
  params: Promise<{ slug: string }>;
};

const specialPages = ["claim-profile", "creator-dashboard", "login", "register", "locations"] as const;

export function generateStaticParams() {
  return [
    ...getRankingPages().map((page) => ({ slug: page.slug })),
    ...getLegalPages().map((page) => ({ slug: page.slug })),
    ...specialPages.map((slug) => ({ slug }))
  ];
}

export async function generateMetadata({ params }: RootSlugPageProps) {
  const { slug } = await params;
  const rankingPage = getRankingPageBySlug(slug);
  if (rankingPage) {
    return buildMetadata({
      title: rankingPage.seoTitle,
      description: rankingPage.seoDescription,
      path: `/${rankingPage.slug}`,
      index: rankingPage.isIndexable
    });
  }

  const legalPage = getLegalPage(slug);
  if (legalPage) {
    return buildMetadata({
      title: `${legalPage.title} | OnlyCreatorAwards`,
      description: legalPage.description,
      path: `/${legalPage.slug}`,
      index: legalPage.robotsIndex
    });
  }

  const specialMetadata: Record<string, { title: string; description: string; index: boolean }> = {
    "claim-profile": {
      title: "Claim a Creator Profile | OnlyCreatorAwards",
      description: "Submit a creator profile claim with safe verification evidence for admin review.",
      index: true
    },
    "creator-dashboard": {
      title: "Creator Dashboard | OnlyCreatorAwards",
      description: "Creator profile claim, edit submission, badge, awards, and reward participation workspace.",
      index: false
    },
    login: {
      title: "Login | OnlyCreatorAwards",
      description: "Login to vote, comment, nominate creators, claim profiles, and view rewards.",
      index: false
    },
    register: {
      title: "Register | OnlyCreatorAwards",
      description: "Create an account to vote, comment, nominate creators, report issues, and join fan rewards.",
      index: false
    },
    locations: {
      title: "Creator Location Rankings | OnlyCreatorAwards",
      description: "Browse location ranking hubs using broad public or creator-submitted location data only.",
      index: true
    }
  };

  const metadata = specialMetadata[slug];
  return buildMetadata({
    title: metadata?.title ?? "Page Not Found | OnlyCreatorAwards",
    description: metadata?.description ?? "This page could not be found.",
    path: `/${slug}`,
    index: metadata?.index ?? false
  });
}

function RankingPageView({ page }: { page: RankingPage }) {
  const rows = getRankingCreators(page);

  return (
    <>
      <JsonLd
        data={[
          breadcrumbSchema([
            { name: "Home", href: "/" },
            { name: page.title, href: `/${page.slug}` }
          ]),
          itemListSchema(
            page.title,
            rows.map(({ creator }) => ({ name: creator.displayName, href: `/creator/${creator.slug}` }))
          ),
          faqSchema(page.faqs)
        ]}
      />
      <PageHeader eyebrow={page.pageType.replace(/_/g, " ")} title={page.title} description={page.description}>
        <Card>
          <CardContent>
            <Badge className={page.isIndexable ? "bg-emerald-50 text-brand-green" : "bg-slate-100 text-muted"}>
              {page.isIndexable ? "Indexable" : "Noindex until enriched"}
            </Badge>
            <p className="mt-3 text-sm leading-6 text-muted">
              Minimum creator count: {page.minCreatorCount}. Last updated June 10, 2026.
            </p>
          </CardContent>
        </Card>
      </PageHeader>
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <div className="space-y-6">
            <Card>
              <CardContent>
                <h2 className="text-2xl font-black text-ink">Methodology</h2>
                <p className="mt-3 leading-7 text-muted">{page.introContent}</p>
                <div className="mt-5 grid gap-3 text-sm leading-6 text-muted md:grid-cols-3">
                  <p>Verified fan votes and CreatorStars scores influence ordering.</p>
                  <p>Creator claims, safe imagery, links, categories, and awards improve profile quality.</p>
                  <p>Thin or duplicate programmatic filters should not enter the sitemap.</p>
                </div>
              </CardContent>
            </Card>
            <RankingTable rows={rows} />
            <div className="grid gap-5 lg:grid-cols-2">
              {rows.slice(0, 4).map(({ creator, entry }) => (
                <CreatorCard key={creator.id} creator={creator} rank={entry.rank} />
              ))}
            </div>
          </div>
          <aside className="space-y-6">
            <VotePanel context="ranking" />
            <Card>
              <CardContent>
                <Trophy className="h-8 w-8 text-brand-amber" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-black text-ink">Award nominations</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Fans can nominate creators for open awards after login. Admin review is required before nominees are public.
                </p>
                <Link
                  href="/awards/2026"
                  className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-ink px-4 font-extrabold text-white transition hover:bg-brand-green"
                >
                  View awards
                </Link>
              </CardContent>
            </Card>
            <Card>
              <CardContent>
                <BadgeCheck className="h-8 w-8 text-brand-green" aria-hidden="true" />
                <h2 className="mt-4 text-xl font-black text-ink">Claim profile</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Creators can claim profiles, submit safe images, add official links, and request corrections.
                </p>
                <Link
                  href="/claim-profile"
                  className="mt-4 inline-flex min-h-11 items-center rounded-lg border border-line px-4 font-extrabold text-ink transition hover:bg-slate-50"
                >
                  Start claim
                </Link>
              </CardContent>
            </Card>
          </aside>
        </div>
      </section>
    </>
  );
}

function LegalPageView({ page }: { page: LegalPage }) {
  return (
    <>
      <PageHeader eyebrow="Policy" title={page.title} description={page.description} />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent className="space-y-5">
              {page.body.map((paragraph) => (
                <p key={paragraph} className="leading-8 text-muted">
                  {paragraph}
                </p>
              ))}
              <div className="rounded-lg bg-slate-50 p-4 text-sm leading-6 text-muted">{siteConfig.disclaimer}</div>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function ClaimProfilePage() {
  return (
    <>
      <PageHeader
        eyebrow="Creator verification"
        title="Claim a creator profile"
        description="Submit safe verification evidence. Claims go to admin review before profile editing, badge downloads, or creator reward participation are enabled."
      />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
          <Card>
            <CardContent>
              <form action="/api/claims" method="post" className="grid gap-4">
                <label className="grid gap-2 text-sm font-black text-ink">
                  Creator profile URL or slug
                  <input
                    name="creator"
                    required
                    className="min-h-11 rounded-lg border border-line px-3 font-bold outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  />
                </label>
                <label className="grid gap-2 text-sm font-black text-ink">
                  Verification method
                  <select
                    name="verificationMethod"
                    className="min-h-11 rounded-lg border border-line px-3 font-bold outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                  >
                    <option value="SOCIAL_LINK">Social link</option>
                    <option value="EMAIL">Email</option>
                    <option value="PLATFORM_MESSAGE">Platform message</option>
                    <option value="MANUAL">Manual review</option>
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-black text-ink">
                  Evidence
                  <textarea
                    name="verificationEvidence"
                    required
                    rows={5}
                    className="rounded-lg border border-line p-3 font-bold outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
                    placeholder="Public social post, profile link, creator email, or other safe verification evidence."
                  />
                </label>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-brand-green px-4 font-extrabold text-white transition hover:bg-emerald-800"
                >
                  <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                  Submit claim
                </button>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardContent>
              <ShieldCheck className="h-8 w-8 text-brand-green" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-black text-ink">Claim review rules</h2>
              <ul className="mt-3 space-y-2 text-sm leading-6 text-muted">
                <li>Creator edits go to moderation unless trusted.</li>
                <li>Safe images only. No explicit hosted content.</li>
                <li>No legal names or private location data unless public by the creator.</li>
                <li>Creators can request corrections, noindex, or removal.</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function CreatorDashboardPage() {
  const campaign = getCurrentRewardCampaign();
  const scores = getFanRewardScores();

  return (
    <>
      <PageHeader
        eyebrow="Creator workspace"
        title="Creator dashboard"
        description="Claimed creators can submit profile edits, safe images, official links, category suggestions, badge embeds, reward participation, and removal requests."
      />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          {[
            ["Edit profile", "Submit bio, official links, and safe public images for moderation."],
            ["Awards", "View nominations, finalist status, winner badges, and award embed code."],
            ["CreatorStars", "Review score components and badge level for claimed profiles."],
            ["Rewards opt-in", "Allow eligible winners to select you for creator subscription credit."]
          ].map(([title, body]) => (
            <Card key={title}>
              <CardContent>
                <LayoutDashboard className="h-8 w-8 text-brand-blue" aria-hidden="true" />
                <h2 className="mt-4 text-2xl font-black text-ink">{title}</h2>
                <p className="mt-3 leading-7 text-muted">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mx-auto mt-6 max-w-7xl px-4 sm:px-6 lg:px-8">
          <RewardLeaderboard campaign={campaign} scores={scores.slice(0, 3)} />
        </div>
      </section>
    </>
  );
}

function AuthPage({ mode }: { mode: "login" | "register" }) {
  const isRegister = mode === "register";

  return (
    <>
      <PageHeader
        eyebrow={isRegister ? "Create account" : "Account access"}
        title={isRegister ? "Register" : "Login"}
        description={
          isRegister
            ? "Create an account to vote, comment, save creators, nominate awards, report issues, and join Fan Rewards."
            : "Login to vote, comment, nominate creators, claim profiles, and manage rewards."
        }
      />
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto max-w-xl px-4 sm:px-6 lg:px-8">
          <Card>
            <CardContent>
              <form action="/api/auth" method="post" className="grid gap-4">
                <input type="hidden" name="mode" value={mode} />
                {isRegister ? (
                  <label className="grid gap-2 text-sm font-black text-ink">
                    Username
                    <input name="username" required className="min-h-11 rounded-lg border border-line px-3" />
                  </label>
                ) : null}
                <label className="grid gap-2 text-sm font-black text-ink">
                  Email
                  <input name="email" type="email" required className="min-h-11 rounded-lg border border-line px-3" />
                </label>
                <label className="grid gap-2 text-sm font-black text-ink">
                  Password
                  <input name="password" type="password" required className="min-h-11 rounded-lg border border-line px-3" />
                </label>
                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-ink px-4 font-extrabold text-white transition hover:bg-brand-green"
                >
                  {isRegister ? <UserPlus className="h-4 w-4" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
                  {isRegister ? "Create account" : "Login"}
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}

function LocationsPage() {
  const locationPages = getRankingPages("GEO");

  return (
    <>
      <PageHeader
        eyebrow="Location rankings"
        title="Creator location hubs"
        description="Geographic pages use broad, public, or creator-submitted location data only. Weak location pages should stay noindex until enough high-quality profiles exist."
      >
        <SearchPanel compact />
      </PageHeader>
      <section className="bg-[#f7f8f5] py-10">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          {locationPages.map((page) => (
            <Link key={page.id} href={`/${page.slug}`}>
              <Card className="h-full transition hover:-translate-y-0.5 hover:shadow-panel">
                <CardContent>
                  <MapPin className="h-8 w-8 text-brand-blue" aria-hidden="true" />
                  <h2 className="mt-4 text-2xl font-black text-ink">{page.title}</h2>
                  <p className="mt-3 leading-7 text-muted">{page.description}</p>
                  <Badge className="mt-4 bg-slate-100 text-ink">{page.entries.length} profiles</Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default async function RootSlugPage({ params }: RootSlugPageProps) {
  const { slug } = await params;
  const rankingPage = getRankingPageBySlug(slug);
  const legalPage = getLegalPage(slug);

  if (rankingPage) {
    return (
      <SiteShell>
        <RankingPageView page={rankingPage} />
      </SiteShell>
    );
  }

  if (legalPage) {
    return (
      <SiteShell>
        <LegalPageView page={legalPage} />
      </SiteShell>
    );
  }

  if (slug === "claim-profile") {
    return (
      <SiteShell>
        <ClaimProfilePage />
      </SiteShell>
    );
  }

  if (slug === "creator-dashboard") {
    return (
      <SiteShell>
        <CreatorDashboardPage />
      </SiteShell>
    );
  }

  if (slug === "login" || slug === "register") {
    return (
      <SiteShell>
        <AuthPage mode={slug} />
      </SiteShell>
    );
  }

  if (slug === "locations") {
    return (
      <SiteShell>
        <LocationsPage />
      </SiteShell>
    );
  }

  notFound();
}
