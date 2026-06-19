"use client";

import { useEffect, useState, type ImgHTMLAttributes } from "react";
import { ImageIcon } from "lucide-react";

import { cn } from "@/lib/utils";

type ModelImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  iconClassName?: string;
  loading?: ImgHTMLAttributes<HTMLImageElement>["loading"];
};

const placeholderImageValues = new Set(["n/a", "na", "none", "null", "undefined", "-", "--"]);

function safeImageSrc(src?: string | null) {
  const text = src?.trim();
  if (!text || placeholderImageValues.has(text.toLowerCase())) return null;
  if (text.startsWith("/")) return text;

  try {
    const url = new URL(text);
    return url.protocol === "http:" || url.protocol === "https:" ? text : null;
  } catch {
    return null;
  }
}

export function ModelImage({
  src,
  alt,
  className,
  fallbackClassName,
  iconClassName,
  loading = "lazy"
}: ModelImageProps) {
  const [failed, setFailed] = useState(false);
  const imageSrc = safeImageSrc(src);

  useEffect(() => {
    setFailed(false);
  }, [imageSrc]);

  if (!imageSrc || failed) {
    return (
      <div
        aria-label={alt || undefined}
        className={cn(
          "flex h-full w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_18%,rgba(246,198,84,0.24),transparent_14rem),linear-gradient(135deg,#111827,#020617)]",
          className,
          fallbackClassName
        )}
        role={alt ? "img" : undefined}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-brand-amber/30 bg-black/40 shadow-gold-glow backdrop-blur">
          <ImageIcon className={cn("h-8 w-8 text-brand-amber", iconClassName)} aria-hidden="true" />
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
      src={imageSrc}
    />
  );
}
