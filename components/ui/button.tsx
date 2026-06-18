import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

type ButtonVariant = "default" | "outline" | "ghost" | "destructive";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

const variants: Record<ButtonVariant, string> = {
  default: "border border-brand-amber bg-gradient-to-b from-[#ffe49a] to-brand-amber text-ink shadow-gold-glow hover:from-white hover:to-[#f7c85c]",
  outline: "border border-line bg-white text-ink hover:border-brand-amber hover:bg-amber-50",
  ghost: "bg-transparent text-ink hover:bg-slate-50",
  destructive: "border border-brand-rose/[0.70] bg-brand-rose text-white hover:bg-pink-500"
};

export function Button({ className, variant = "default", ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg px-4 font-extrabold transition disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
