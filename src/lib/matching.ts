/**
 * Tag matching + rule-based ranking engine.
 * Based on PRD §13.3 — ranks đề by tag overlap with user prompt.
 */

import { normalizeAndTokenize, slugifyVietnamese } from "./vietnamese";
import { detectSubjects, type SubjectScore } from "./subject-detection";

export interface DeThiForMatching {
  id: string;
  title: string;
  subjectSlug: string;
  subjectName: string;
  tags: string[];
  questionCount: number;
  questionTypes: ("mcq" | "essay")[];
}

export interface MatchResult {
  deThi: DeThiForMatching;
  score: number;
  matchReason: string;
  matchedTags: string[];
}

/**
 * Extract potential tags from a user prompt.
 * Converts multi-word phrases to snake_case tags
 * and also generates individual word tokens.
 */
export function extractTagsFromPrompt(text: string): string[] {
  const tokens = normalizeAndTokenize(text);
  const tags = new Set<string>();

  // Generate individual word tags
  for (const token of tokens) {
    if (token.length >= 3) {
      tags.add(token);
    }
  }

  // Generate multi-word phrase tags (2-4 word sliding window)
  for (let i = 0; i < tokens.length; i++) {
    for (let len = 2; len <= 4 && i + len <= tokens.length; len++) {
      const phrase = tokens.slice(i, i + len).join("_");
      tags.add(phrase);
    }
  }

  return Array.from(tags);
}

/**
 * Calculate tag overlap between prompt tags and đề tags.
 */
function calculateTagOverlap(promptTags: string[], deThiTags: string[]): string[] {
  const deThiTagSet = new Set(deThiTags.map((t) => t.toLowerCase()));
  return promptTags.filter((t) => deThiTagSet.has(t.toLowerCase()));
}

/**
 * Match and rank đề against a user prompt.
 * Returns 3–6 best matches with human-readable match reasons.
 *
 * Ranking factors:
 * 1. Tag overlap (primary)
 * 2. Subject match (secondary boost)
 * 3. Title keyword match (tertiary boost)
 */
export function matchDeThi(
  prompt: string,
  deThiList: DeThiForMatching[],
  maxResults = 6,
  minResults = 3,
): MatchResult[] {
  const promptTags = extractTagsFromPrompt(prompt);
  const subjectScores = detectSubjects(prompt);
  const subjectScoreMap = new Map<string, SubjectScore>(
    subjectScores.map((s) => [s.slug, s]),
  );

  const results: MatchResult[] = [];

  for (const deThi of deThiList) {
    const matchedTags = calculateTagOverlap(promptTags, deThi.tags);
    let score = matchedTags.length;

    // Subject match boost
    const subjectScore = subjectScoreMap.get(deThi.subjectSlug);
    if (subjectScore) {
      score += subjectScore.score * 2;
    }

    // Title keyword match boost
    const normalizedTitle = normalizeAndTokenize(deThi.title);
    const promptTokens = normalizeAndTokenize(prompt);
    const promptTokenSet = new Set(promptTokens);
    const titleMatches = normalizedTitle.filter((t) => promptTokenSet.has(t) && t.length >= 3);
    score += titleMatches.length * 0.5;

    if (score > 0) {
      const reasons: string[] = [];

      if (matchedTags.length > 0) {
        const tagDisplay = matchedTags
          .slice(0, 4)
          .map((t) => t.replace(/_/g, " "))
          .join(", ");
        reasons.push(`Khớp với topic: ${tagDisplay}`);
      }

      if (subjectScore && subjectScore.matchedKeywords.length > 0) {
        const kwDisplay = subjectScore.matchedKeywords.slice(0, 3).join(", ");
        reasons.push(`Phát hiện môn: ${deThi.subjectName} (từ khóa: ${kwDisplay})`);
      }

      if (titleMatches.length > 0) {
        reasons.push(`Tiêu đề liên quan đến từ khóa trong câu hỏi`);
      }

      const matchReason = reasons.length > 0
        ? reasons.join(". ")
        : "Đề phù hợp với yêu cầu";

      results.push({
        deThi,
        score,
        matchReason,
        matchedTags,
      });
    }
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  // Return min 3, max 6 (or fewer if not enough matches)
  const maxReturn = Math.min(maxResults, results.length);
  const minReturn = Math.min(minResults, results.length);

  return results.slice(0, Math.max(minReturn, maxReturn));
}

/**
 * Generate a match reason for a single đề given a prompt.
 * Useful for individual card display.
 */
export function generateMatchReason(prompt: string, deThi: DeThiForMatching): string {
  const result = matchDeThi(prompt, [deThi], 1, 1);
  return result.length > 0 ? result[0].matchReason : "Đề phù hợp với yêu cầu";
}

/**
 * Convert a Vietnamese phrase to a tag slug.
 */
export { slugifyVietnamese };
