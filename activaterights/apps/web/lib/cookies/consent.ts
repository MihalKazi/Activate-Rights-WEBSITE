export const COOKIE_CONSENT_STORAGE_KEY = "ar_cookie_consent";
export const COOKIE_CONSENT_COOKIE_NAME = "ar_cookie_consent";
export const COOKIE_CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export type CookieConsentChoice = "all" | "essential";

export type CookieConsentState = {
  choice: CookieConsentChoice;
  updatedAt: string;
};

export const COOKIE_CONSENT_CHANGE_EVENT = "activate-rights:cookie-consent";
export const COOKIE_CONSENT_SETTINGS_EVENT = "activate-rights:cookie-settings";

export function parseConsent(raw: string | null): CookieConsentState | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as CookieConsentState;
    if (parsed.choice !== "all" && parsed.choice !== "essential") return null;
    if (typeof parsed.updatedAt !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

export function readConsent(): CookieConsentState | null {
  if (typeof window === "undefined") return null;
  const fromStorage = parseConsent(
    window.localStorage.getItem(COOKIE_CONSENT_STORAGE_KEY)
  );
  if (fromStorage) return fromStorage;

  const match = document.cookie.match(
    new RegExp(`(?:^|; )${COOKIE_CONSENT_COOKIE_NAME}=([^;]*)`)
  );
  if (!match?.[1]) return null;
  return parseConsent(decodeURIComponent(match[1]));
}

export function writeConsent(state: CookieConsentState): void {
  const serialized = JSON.stringify(state);
  window.localStorage.setItem(COOKIE_CONSENT_STORAGE_KEY, serialized);
  document.cookie = `${COOKIE_CONSENT_COOKIE_NAME}=${encodeURIComponent(serialized)}; path=/; max-age=${COOKIE_CONSENT_MAX_AGE_SECONDS}; SameSite=Lax`;
  window.dispatchEvent(
    new CustomEvent<CookieConsentState>(COOKIE_CONSENT_CHANGE_EVENT, {
      detail: state
    })
  );
}

export function hasConsentRecorded(): boolean {
  return readConsent() !== null;
}

export function analyticsAllowed(choice: CookieConsentChoice | null): boolean {
  return choice === "all";
}
