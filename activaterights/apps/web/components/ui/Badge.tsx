import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
};

export function Badge({ children, className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-sm border border-white/50 px-2 py-1 text-[10px] font-semibold uppercase tracking-wide text-white",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
