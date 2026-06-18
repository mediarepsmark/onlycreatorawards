import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageHeader({ eyebrow, title, description, children }: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-charcoal text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_0%,rgba(244,201,93,0.16),transparent_28rem),radial-gradient(circle_at_80%_20%,rgba(34,211,238,0.12),transparent_24rem)]" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {eyebrow ? <Badge className="mb-5 border-brand-amber/40 bg-brand-amber/10 text-brand-amber">{eyebrow}</Badge> : null}
        <div className="grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <div>
            <h1 className="max-w-4xl text-4xl font-black tracking-normal text-white sm:text-5xl">{title}</h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-white/[0.68]">{description}</p>
          </div>
          {children ? <div>{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
