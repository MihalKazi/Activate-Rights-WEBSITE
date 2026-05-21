"use client";

import type { ReactNode } from "react";
import { Roboto_Mono } from "next/font/google";
import { cn } from "../lib/utils";

const robotoMono = Roboto_Mono({
  subsets: ["latin"],
  weight: ["400"],
  display: "swap"
});

type ListingLoadMoreProps = {
  onClick: () => void;
  children: ReactNode;
};

export function ListingLoadMore({ onClick, children }: ListingLoadMoreProps) {
  return (
    <div className="listing-load-more">
      <button type="button" onClick={onClick} className={cn(robotoMono.className, "listing-load-more__btn")}>
        {children}
      </button>
    </div>
  );
}
