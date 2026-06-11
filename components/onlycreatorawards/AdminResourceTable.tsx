import Link from "next/link";
import { Database, Lock, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AdminResource } from "@/lib/onlycreatorawards/types";

function headers(resource: AdminResource) {
  const firstRow = resource.rows[0];
  return firstRow ? Object.keys(firstRow) : ["state"];
}

export function AdminResourceTable({ resource }: { resource: AdminResource }) {
  const tableHeaders = headers(resource);

  return (
    <Card>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="bg-slate-100 text-ink">
              <Lock className="mr-1 h-4 w-4" aria-hidden="true" />
              Admin protected
            </Badge>
            <h2 className="mt-3 text-2xl font-black text-ink">{resource.label}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">{resource.description}</p>
          </div>
          <Link
            href={`/admin/${resource.key}?mode=new`}
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-brand-green px-4 font-extrabold text-white transition hover:bg-emerald-800"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            New
          </Link>
        </div>
        <div className="overflow-x-auto rounded-lg border border-line">
          <table className="w-full min-w-[640px] border-collapse text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-normal text-muted">
              <tr>
                {tableHeaders.map((header) => (
                  <th key={header} className="px-4 py-3 font-black">
                    {header.replace(/([A-Z])/g, " $1")}
                  </th>
                ))}
                <th className="px-4 py-3 font-black">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-white">
              {resource.rows.map((row, index) => (
                <tr key={`${resource.key}-${index}`}>
                  {tableHeaders.map((header) => (
                    <td key={header} className="px-4 py-3 font-bold text-ink">
                      {String(row[header] ?? "")}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    <Link href={`/admin/${resource.key}?row=${index}`} className="font-black text-brand-blue hover:text-ink">
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex items-start gap-2 rounded-lg bg-slate-50 p-3 text-sm leading-6 text-muted">
          <Database className="mt-0.5 h-4 w-4 shrink-0 text-brand-blue" aria-hidden="true" />
          This CRUD surface is intentionally repository-backed. Connect the repository to Prisma before enabling writes.
        </div>
      </CardContent>
    </Card>
  );
}
