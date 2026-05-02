import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "../../lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-sm border border-border/80 bg-surface/70 p-5 backdrop-blur-sm transition",
        "hover:border-white/70 hover:brightness-110",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
