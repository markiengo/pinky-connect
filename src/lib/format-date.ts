/**
 * Deterministic Vietnamese date formatting — no Intl API.
 * Prevents server/client hydration mismatches on systems
 * where the "vi-VN" locale may not be installed.
 */

function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

/**
 * Format a date as dd/mm/yyyy (Vietnamese short date).
 */
export function formatViDate(
  date: Date | string,
  format: "short" | "long" = "short"
): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const day = pad2(d.getDate());
  const month = pad2(d.getMonth() + 1);
  const year = d.getFullYear();

  if (format === "long") {
    return `${day}/${month}/${year}`;
  }
  return `${day}/${month}`;
}
