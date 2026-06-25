/**
 * Vietnamese text normalization utilities.
 * Pure code — no AI needed.
 *
 * Pipeline: strip diacritics → lowercase → tokenize
 */

/**
 * Remove Vietnamese diacritics from text.
 * "Đạo hàm" → "Dao ham"
 */
export function stripDiacritics(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/**
 * Lowercase and trim text.
 */
export function normalize(text: string): string {
  return stripDiacritics(text).toLowerCase().trim();
}

/**
 * Tokenize normalized Vietnamese text into word tokens.
 * Splits on non-alphanumeric characters, removes empty tokens.
 * "dao ham cua ham so" → ["dao", "ham", "cua", "ham", "so"]
 */
export function tokenize(text: string): string[] {
  return normalize(text)
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 0);
}

/**
 * Normalize and tokenize in one call.
 */
export function normalizeAndTokenize(text: string): string[] {
  return tokenize(text);
}

/**
 * Convert a Vietnamese string to a slug suitable for tags/IDs.
 * "Đạo hàm" → "dao_ham"
 */
export function slugifyVietnamese(text: string): string {
  return normalize(text)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}
