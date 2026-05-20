import { NextResponse } from "next/server";
import { sendContactEmail } from "../../../lib/contact/sendContactEmail";

type ContactBody = {
  name?: string;
  email?: string;
  message?: string;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  let body: ContactBody;

  try {
    body = (await request.json()) as ContactBody;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const name = body.name?.trim() ?? "";
  const email = body.email?.trim() ?? "";
  const message = body.message?.trim() ?? "";

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
  }

  if (name.length > 200 || email.length > 254 || message.length > 10000) {
    return NextResponse.json({ error: "Message is too long" }, { status: 400 });
  }

  try {
    await sendContactEmail({ name, email, message });
    return NextResponse.json({ ok: true });
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Send failed";
    const status = messageText.includes("RESEND_API_KEY") ? 503 : 500;

    if (process.env.NODE_ENV === "development") {
      console.error("[api/contact]", error);
    }

    return NextResponse.json({ error: "Unable to send message. Please try again later." }, { status });
  }
}
