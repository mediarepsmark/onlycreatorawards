"use client";

import { useState, type ImgHTMLAttributes } from "react";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

type ModelImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  iconClassName?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
};

export function ModelImage({
  src,
  alt,
  className,
  fallbackClassName,
  iconClassName,
  loading = "lazy"
}: ModelImageProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        aria-label={alt || undefined}
        className={cn(
          "flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_20%,rgba(168,85,247,0.36),transparent_16rem),linear-gradient(135deg,#111827,#020617)]",
          className,
          fallbackClassName
        )}
        role={alt ? "img" : undefined}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-brand-amber/30 bg-black/40 shadow-gold-glow backdrop-blur">
          <Sparkles className={cn("h-8 w-8 text-brand-amber", iconClassName)} aria-hidden="true" />
        </div>
      </div>
    );
  }

  return (
    <img
      alt={alt}
      className={className}
      decoding="async"
      loading={loading}
      onError={() => setFailed(true)}
      src={src}
    />
  );
}
