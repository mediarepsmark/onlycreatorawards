import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center rounded-full bg-emerald-50 px-3 text-sm font-bold text-brand-green",
        className
      )}
      {...props}
    />
  );
}
