import { NextResponse } from "next/server";

/** Placeholder — wire Sanity webhook secret + `revalidatePath` when CMS hooks are ready. */
export async function POST() {
  return NextResponse.json({ ok: false, message: "Revalidation not configured" }, { status: 501 });
}
