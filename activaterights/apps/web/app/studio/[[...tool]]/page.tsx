"use client";

import dynamic from "next/dynamic";
import config from "../../../sanity/sanity.config";

const NextStudio = dynamic(() => import("next-sanity/studio").then((mod) => mod.NextStudio), {
  ssr: false,
  loading: () => (
    <div className="grid min-h-svh place-items-center bg-neutral-100 font-sans text-neutral-700">
      Loading Studio…
    </div>
  )
});

export default function StudioPage() {
  return <NextStudio config={config} />;
}
