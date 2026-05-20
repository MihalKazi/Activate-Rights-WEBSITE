/** Inbox addresses for contact form submissions (overridable via env). */
export const DEFAULT_CONTACT_RECIPIENTS = [
  "info@activaterights.org",
  "eron@activaterights.org"
] as const;

export function getContactRecipients(): string[] {
  const fromEnv = process.env.CONTACT_EMAIL_RECIPIENTS?.trim();
  if (!fromEnv) return [...DEFAULT_CONTACT_RECIPIENTS];

  const parsed = fromEnv
    .split(",")
    .map((email) => email.trim())
    .filter(Boolean);

  return parsed.length > 0 ? parsed : [...DEFAULT_CONTACT_RECIPIENTS];
}
