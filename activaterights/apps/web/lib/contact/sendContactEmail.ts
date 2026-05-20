import { getContactRecipients } from "./recipients";

export type ContactFormPayload = {
  name: string;
  email: string;
  message: string;
};

export async function sendContactEmail(payload: ContactFormPayload): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured");
  }

  const from =
    process.env.CONTACT_EMAIL_FROM?.trim() ?? "Activate Rights <onboarding@resend.dev>";
  const to = getContactRecipients();

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      from,
      to,
      reply_to: payload.email,
      subject: `Contact form — ${payload.name}`,
      text: [
        `Name: ${payload.name}`,
        `Email: ${payload.email}`,
        "",
        payload.message
      ].join("\n")
    })
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(detail || `Email send failed (${response.status})`);
  }
}
