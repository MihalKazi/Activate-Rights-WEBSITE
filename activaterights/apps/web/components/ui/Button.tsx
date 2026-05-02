import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: ButtonVariant;
};

export function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-sm border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70",
        variant === "primary" &&
          "border-white bg-white text-[#127c69] hover:brightness-95",
        variant === "secondary" &&
          "border-white/70 bg-transparent text-white hover:border-white hover:bg-white/10",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
