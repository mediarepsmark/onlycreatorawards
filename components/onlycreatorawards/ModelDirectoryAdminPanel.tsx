import Link from "next/link";
import { Clock, DatabaseZap, FileJson, ImageOff, Megaphone, Pin, RefreshCcw, Settings2, TrendingDown } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAdminModelRows,
  getModelPromotionAdminSummary,
  getModelDirectorySections,
  getModelDirectoryStats,
  getModelsForSection
} from "@/lib/onlycreatorawards/modelDirectory";

function formatDate(value: string) {
  if (!value) return "Pending";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  }).format(new Date(value));
}

function truncate(value: string, length = 88) {
  return value.length > length ? `${value.slice(0, length)}...` : value;
}

function formatScore(value: number) {
  return Intl.NumberFormat("en", { maximumFractionDigits: 0 }).format(value);
}

function promotionFlags(row: ReturnType<typeof getAdminModelRows>[number]) {
  const flags = [];
  if (row.promotion.sponsored) flags.push("Sponsored");
  if (row.promotion.suppressed) flags.push("Suppressed");
  if (row.promotion.hidden) flags.push("Hidden");
  if (row.promotion.brokenImage) flags.push("Broken image");
  if (row.promotion.homepageBlocked) flags.push("Home blocked");
  return flags;
}

export function ModelDirectoryAdminPanel({ section }: { section: string }) {
  const stats = getModelDirectoryStats();
  const rows = getAdminModelRows(100);
  const promotionSummary = getModelPromotionAdminSummary();
  const sections = getModelDirectorySections().slice(0, 20);
  const topSections = sections.slice(0, 8).map((item) => ({
    ...item,
    models: getModelsForSection(item.slug, 3)
  }));

  if (section === "model-sections") {
    return (
      <div className="space-y-6">
        <AdminSummary stats={stats} />
        <Card>
          <CardContent>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <Badge className="bg-amber-50 text-brand-amber">
                  <Pin className="mr-1 h-4 w-4" aria-hidden="true" />
                  Manual top 3
                </Badge>
                <h2 className="mt-3 text-2xl font-black text-ink">Section override queues</h2>
                <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                  Add up to three model slugs per section in <code>data/model-section-overrides.json</code>. Remaining entries fill by clicks, views,
                  popularity, and source order.
                </p>
              </div>
              <Link href="/models" className="inline-flex min-h-11 items-center rounded-lg bg-ink px-4 font-extrabold text-white">
                View directory
              </Link>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-2">
              {topSections.map((item) => (
                <div key={item.slug} className="rounded-lg border border-line bg-slate-50 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-black text-ink">{item.label}</h3>
                      <p className="text-sm font-bold text-muted">{item.count} imported entries</p>
                    </div>
                    <Link href={`/models/category/${item.slug}`} className="text-sm font-black text-brand-blue">
                      Open
                    </Link>
                  </div>
                  <div className="mt-4 space-y-2">
                    {item.models.map((model, index) => (
                      <div key={model.slug} className="flex items-center justify-between gap-3 rounded-lg bg-white p-3 text-sm">
                        <span className="font-black text-ink">
                          #{index + 1} {model.displayName}
                        </span>
                        <code className="rounded bg-slate-100 px-2 py-1 text-xs text-muted">{model.slug}</code>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (section === "model-imports") {
    return (
      <div className="space-y-6">
        <AdminSummary stats={stats} />
        <Card>
          <CardContent>
            <FileJson className="h-8 w-8 text-brand-blue" aria-hidden="true" />
            <h2 className="mt-4 text-2xl font-black text-ink">Daily import command</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              The production cron should run once per day, write the latest cache into <code>data/traffichaus-models.json</code>, then audit the top
              thumbnail candidates into <code>data/model-image-overrides.json</code>.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-ink p-4 text-sm font-bold text-white">
              <code>
                {`cd /home/httpd/html/onlycreatorawards.com/app
/usr/bin/docker run --rm -v "$PWD:/work" -w /work node:22-bookworm-slim node scripts/sync-traffichaus-models.mjs
/usr/bin/docker run --rm --network host -v "$PWD:/work" -w /work node:22-bookworm-slim node scripts/audit-model-images.mjs --limit=1000`}
              </code>
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <AdminSummary stats={stats} />
      <PromotionControls summary={promotionSummary} />
      <Card>
        <CardContent className="space-y-5">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b-4 border-brand-blue pb-4">
            <div>
              <Badge className="bg-emerald-50 text-brand-green">
                <DatabaseZap className="mr-1 h-4 w-4" aria-hidden="true" />
                Traffichaus source feed
              </Badge>
              <h2 className="mt-3 text-2xl font-black text-ink">OnlyFans model list</h2>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
                Rows are ordered by effective display score, which combines organic popularity, CPC/manual boost, suppressions, and image flags.
              </p>
            </div>
            <Link href="/admin/model-imports" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-blue px-4 font-extrabold text-white">
              <RefreshCcw className="h-4 w-4" aria-hidden="true" />
              Import settings
            </Link>
          </div>
          <div className="overflow-x-auto rounded-lg border border-line">
            <table className="w-full min-w-[1180px] border-collapse text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-normal text-brand-blue">
                <tr>
                  {[
                    "Id",
                    "Sort",
                    "Is Public",
                    "Name",
                    "Slug",
                    "Username",
                    "Image",
                    "Promotion",
                    "Organic",
                    "Effective",
                    "Flags",
                    "Category",
                    "Popularity",
                    "Clicks",
                    "Views"
                  ].map(
                    (header) => (
                      <th key={header} className="px-4 py-3 font-black">
                        {header}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-line bg-white">
                {rows.map((row) => (
                  <tr key={`${row.id}-${row.username}`}>
                    <td className="px-4 py-3 font-black text-brand-blue">{row.id}</td>
                    <td className="px-4 py-3 font-bold text-ink">{row.sort}</td>
                    <td className="px-4 py-3">
                      <Badge className={row.public ? "bg-emerald-50 text-brand-green" : "bg-slate-100 text-muted"}>
                        {row.public ? "yes" : "no"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-bold text-ink">{truncate(String(row.name), 38)}</td>
                    <td className="px-4 py-3">
                      <code className="rounded bg-slate-100 px-2 py-1 text-xs font-black text-muted">{row.slug}</code>
                    </td>
                    <td className="px-4 py-3 font-bold text-ink">{row.username}</td>
                    <td className="px-4 py-3 font-bold text-ink">{row.image}</td>
                    <td className="px-4 py-3 font-bold text-ink">{row.promotion.label ?? "Organic"}</td>
                    <td className="px-4 py-3 font-bold text-ink">{formatScore(row.organicScore)}</td>
                    <td className="px-4 py-3 font-black text-brand-blue">{formatScore(row.effectiveScore)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {promotionFlags(row).length ? (
                          promotionFlags(row).map((flag) => (
                            <Badge key={`${row.slug}-${flag}`} className="bg-amber-50 text-brand-amber">
                              {flag}
                            </Badge>
                          ))
                        ) : (
                          <span className="text-xs font-bold text-muted">none</span>
                        )}
                      </div>
                    </td>
                    <td className="max-w-[380px] px-4 py-3 font-bold text-ink">{truncate(String(row.category), 120)}</td>
                    <td className="px-4 py-3 font-bold text-ink">{row.popularity}</td>
                    <td className="px-4 py-3 font-bold text-ink">{row.clicks}</td>
                    <td className="px-4 py-3 font-bold text-ink">{row.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PromotionControls({
  summary
}: {
  summary: ReturnType<typeof getModelPromotionAdminSummary>;
}) {
  const sponsoredCount = summary.rows.filter((row) => row.control.sponsored).length;
  const suppressedCount = summary.rows.filter((row) => row.control.suppressed || row.control.hidden).length;
  const brokenCount = summary.brokenImageRows.length;
  const heroPins = summary.homepage.hero ?? [];
  const visibleRows = summary.rows.slice(0, 12);

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b-4 border-brand-amber pb-4">
          <div>
            <Badge className="bg-amber-50 text-brand-amber">
              <Megaphone className="mr-1 h-4 w-4" aria-hidden="true" />
              Promotion controls
            </Badge>
            <h2 className="mt-3 text-2xl font-black text-ink">Boost, suppress, and image review</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Public rankings use organic score plus manual CPC adjustments. Paid placements should stay visibly labeled as sponsored or featured.
            </p>
          </div>
          <code className="rounded-lg bg-ink px-3 py-2 text-sm font-bold text-white">data/model-promotion-overrides.json</code>
        </div>

        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <Pin className="h-6 w-6 text-brand-amber" aria-hidden="true" />
            <p className="mt-3 text-sm font-black uppercase text-muted">Hero pins</p>
            <p className="mt-1 text-2xl font-black text-ink">{heroPins.length}</p>
            <p className="mt-2 text-xs font-bold text-muted">{heroPins.join(", ") || "none"}</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <Megaphone className="h-6 w-6 text-brand-blue" aria-hidden="true" />
            <p className="mt-3 text-sm font-black uppercase text-muted">Sponsored boosts</p>
            <p className="mt-1 text-2xl font-black text-ink">{sponsoredCount}</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <TrendingDown className="h-6 w-6 text-brand-rose" aria-hidden="true" />
            <p className="mt-3 text-sm font-black uppercase text-muted">Suppressed</p>
            <p className="mt-1 text-2xl font-black text-ink">{suppressedCount}</p>
          </div>
          <div className="rounded-lg border border-line bg-slate-50 p-4">
            <ImageOff className="h-6 w-6 text-brand-rose" aria-hidden="true" />
            <p className="mt-3 text-sm font-black uppercase text-muted">Image watchlist</p>
            <p className="mt-1 text-2xl font-black text-ink">{brokenCount}</p>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border border-line bg-white p-4">
            <h3 className="text-lg font-black text-ink">Configured controls</h3>
            <div className="mt-3 space-y-2">
              {visibleRows.length ? (
                visibleRows.map(({ slug, control, model, organicScore, effectiveScore }) => (
                  <div key={slug} className="rounded-lg bg-slate-50 p-3 text-sm">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="font-black text-ink">{model?.displayName ?? slug}</p>
                        <code className="text-xs font-bold text-muted">{slug}</code>
                      </div>
                      <Badge className={control.sponsored ? "bg-amber-50 text-brand-amber" : "bg-slate-100 text-muted"}>
                        {control.label ?? "Manual"}
                      </Badge>
                    </div>
                    <div className="mt-2 grid grid-cols-3 gap-2 text-xs font-bold text-muted">
                      <span>Organic {formatScore(organicScore)}</span>
                      <span>Adjust {formatScore(control.scoreAdjustment ?? 0)}</span>
                      <span>Effective {formatScore(effectiveScore)}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm font-bold text-muted">No model controls configured.</p>
              )}
            </div>
          </div>

          <div className="rounded-lg border border-line bg-white p-4">
            <h3 className="text-lg font-black text-ink">Broken image watchlist</h3>
            <div className="mt-3 space-y-2">
              {summary.brokenImageRows.slice(0, 12).map((model) => (
                <div key={model.slug} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-black text-ink">{model.displayName}</p>
                    <code className="text-xs font-bold text-muted">{model.slug}</code>
                  </div>
                  <Badge className="bg-rose-50 text-brand-rose">{model.imageStatus}</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminSummary({
  stats
}: {
  stats: ReturnType<typeof getModelDirectoryStats>;
}) {
  const items = [
    { label: "Imported models", value: stats.parsedCount.toLocaleString(), Icon: DatabaseZap },
    { label: "Sections", value: stats.sectionCount.toLocaleString(), Icon: Settings2 },
    { label: "Last import", value: formatDate(stats.importedAt), Icon: Clock },
    { label: "Parser", value: stats.parser, Icon: FileJson }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map(({ label, value, Icon }) => (
        <Card key={label}>
          <CardContent>
            <Icon className="h-7 w-7 text-brand-blue" aria-hidden="true" />
            <p className="mt-3 text-sm font-black uppercase tracking-normal text-muted">{label}</p>
            <p className="mt-1 text-2xl font-black text-ink">{value}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
