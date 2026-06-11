import type { CreatorProfile } from "@/lib/onlycreatorawards/types";

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function CreatorAvatar({ creator, size = "md" }: { creator: CreatorProfile; size?: "sm" | "md" | "lg" }) {
  const sizeClass = {
    sm: "h-12 w-12 text-base",
    md: "h-16 w-16 text-xl",
    lg: "h-24 w-24 text-3xl"
  }[size];

  if (creator.profileImageUrl) {
    return (
      <img
        src={creator.profileImageUrl}
        alt={`${creator.displayName} safe public profile`}
        className={`${sizeClass} rounded-lg object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-ink via-brand-green to-brand-amber font-black text-white shadow-panel`}
      aria-label={`${creator.displayName} placeholder avatar`}
    >
      {initials(creator.displayName)}
    </div>
  );
}
