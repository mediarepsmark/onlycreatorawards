import Link from "next/link";
import { Clock, DatabaseZap, FileJson, Pin, RefreshCcw, Settings2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAdminModelRows,
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

export function ModelDirectoryAdminPanel({ section }: { section: string }) {
  const stats = getModelDirectoryStats();
  const rows = getAdminModelRows(100);
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
              The production cron should run once per day and write the latest cache into <code>data/traffichaus-models.json</code>.
            </p>
            <pre className="mt-4 overflow-x-auto rounded-lg bg-ink p-4 text-sm font-bold text-white">
              <code>
                {`cd /home/httpd/html/onlycreatorawards.com/app
/usr/bin/docker run --rm -v "$PWD:/work" -w /work node:22-bookworm-slim node scripts/sync-traffichaus-models.mjs`}
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
                Rows preserve JSON source order. Category pages can pin the first three results manually and fill the rest by popularity.
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
                  {["Id", "Sort", "Is Public", "Name", "Username", "Image", "Price", "Updated At", "Category", "Popularity", "Clicks", "Views"].map(
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
                    <td className="px-4 py-3 font-bold text-ink">{row.username}</td>
                    <td className="px-4 py-3 font-bold text-ink">{row.image}</td>
                    <td className="px-4 py-3 font-bold text-ink">{row.price || "none"}</td>
                    <td className="px-4 py-3 font-bold text-ink">{formatDate(String(row.updatedAt))}</td>
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
