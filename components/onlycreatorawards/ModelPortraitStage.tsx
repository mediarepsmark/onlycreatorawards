import { ModelImage } from "@/components/onlycreatorawards/ModelImage";
import { cn } from "@/lib/utils";

type ModelPortraitStageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  contentClassName?: string;
  portraitClassName?: string;
  imageClassName?: string;
  loading?: "eager" | "lazy";
};

export function ModelPortraitStage({
  src,
  alt,
  className,
  contentClassName,
  portraitClassName,
  imageClassName,
  loading = "lazy"
}: ModelPortraitStageProps) {
  return (
    <div className={cn("overflow-hidden bg-black", className)}>
      <ModelImage
        src={src}
        alt=""
        className="absolute inset-0 h-full w-full scale-110 object-cover object-top opacity-35 blur-md brightness-110 saturate-125"
        fallbackClassName="opacity-100 blur-0"
        loading={loading}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_24%,rgba(244,201,93,0.18),transparent_12rem),linear-gradient(180deg,rgba(5,7,13,0.02),rgba(5,7,13,0.36))]" />
      <div className={cn("absolute left-1/2 z-30 -translate-x-1/2", contentClassName ?? "top-10")}>
        <div
          className={cn(
            "relative h-40 w-40 overflow-hidden rounded-[1.75rem] border border-brand-amber/35 bg-black shadow-[0_22px_70px_rgba(0,0,0,0.42)] ring-1 ring-white/10",
            portraitClassName
          )}
        >
          <ModelImage
            src={src}
            alt={alt}
            className={cn("h-full w-full object-cover object-top brightness-110 contrast-110 saturate-125", imageClassName)}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}
