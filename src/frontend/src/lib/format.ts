/**
 * Formatting helpers for backend values.
 *
 * Motoko `Time.now()` values are nanosecond `bigint`s, so every timestamp must
 * pass through `timestampToDate` before any JavaScript `Date` operation.
 */

export function timestampToDate(timestamp: bigint): Date | null {
  const date = new Date(Number(timestamp / 1_000_000n));
  return Number.isNaN(date.getTime()) ? null : date;
}

const ARABIC_DATE_FORMAT = new Intl.DateTimeFormat("ar", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const ARABIC_DATETIME_FORMAT = new Intl.DateTimeFormat("ar", {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

export function formatDate(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  return date ? ARABIC_DATE_FORMAT.format(date) : "—";
}

export function formatDateTime(timestamp: bigint): string {
  const date = timestampToDate(timestamp);
  return date ? ARABIC_DATETIME_FORMAT.format(date) : "—";
}

/** Format a free-text deadline string (YYYY-MM-DD) for display. */
export function formatDeadline(deadline?: string): string {
  if (!deadline) return "غير محدد";
  const date = new Date(deadline);
  return Number.isNaN(date.getTime())
    ? deadline
    : ARABIC_DATE_FORMAT.format(date);
}

/**
 * Render a phone number for display. Keeps the leading `+` and groups digits
 * in a readable way without assuming a specific country code.
 */
export function formatPhone(phone: string): string {
  const trimmed = phone.trim();
  if (!trimmed) return "—";
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 7) return trimmed;
  const grouped = digits.replace(/(\d{3})(?=\d)/g, "$1 ").trim();
  return hasPlus ? `+${grouped}` : grouped;
}

/** `tel:` href for a phone number, stripping spaces and punctuation. */
export function phoneHref(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

/**
 * `https://wa.me/` href for a phone number. WhatsApp expects an international
 * number with no `+`, spaces, or punctuation. A local Iraqi number written as
 * `0781389411` is normalized to its international form (`964781389411`) so the
 * link opens the correct chat.
 */
export function whatsappHref(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const international = digits.startsWith("00")
    ? digits.slice(2)
    : digits.startsWith("0")
      ? `964${digits.slice(1)}`
      : digits;
  return `https://wa.me/${international}`;
}
