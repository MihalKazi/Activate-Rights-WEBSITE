/** Route segment config must live in a Server Component (not alongside `"use client"` page). */
export const dynamic = "force-dynamic";

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
