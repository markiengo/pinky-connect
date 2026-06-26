/**
 * Subject detection from prompt/PDF text via keyword tables.
 * Based on PRD §13.2 — adapted for college-level subjects.
 */

import { normalizeAndTokenize } from "./vietnamese";

export interface SubjectKeywordTable {
  slug: string;
  name: string;
  keywords: string[];
}

export const SUBJECT_KEYWORDS: SubjectKeywordTable[] = [
  {
    slug: "ke_toan",
    name: "Kế toán",
    keywords: [
      "ke toan",
      "nguyen ly ke toan",
      "tai khoan",
      "ghi s kep",
      "dinh khoan",
      "bang can doi",
      "bao cao tai chinh",
      "tai san",
      "no phai tra",
      "von chu so huu",
      "chi phi",
      "doanh thu",
      "nguyen tac ke toan",
      "fifo",
      "tinh gia",
      "chu trinh ke toan",
      "ke toan tai chinh",
      "ke toan quan tri",
    ],
  },
  {
    slug: "tai_chinh_ngan_hang",
    name: "Tài chính – Ngân hàng",
    keywords: [
      "tai chinh",
      "tien te",
      "ngan hang",
      "lai suat",
      "tin dung",
      "cho vay",
      "gui tien",
      "chinh sach tien te",
      "ngan hang trung uong",
      "ngan hang thuong mai",
      "bao lanh",
      "chiet khau",
      "rui ro tin dung",
      "thanh toan quoc te",
      "gia tri hien tai",
      "tra deu",
      "lai kep",
      "giao dich ngoai bang",
    ],
  },
  {
    slug: "quan_tri_kinh_doanh",
    name: "Quản trị Kinh doanh",
    keywords: [
      "quan tri",
      "marketing",
      "chien luoc",
      "thi truong",
      "khach hang",
      "swot",
      "porter",
      "tam nhin",
      "su menh",
      "phan khuc",
      "dinh vi",
      "thuong hieu",
      "bcg",
      "crm",
      "chu ky song",
      "phan phoi",
      "truyen thong",
      "kinh doanh",
      "quan tri chien luoc",
      "quan tri marketing",
    ],
  },
  {
    slug: "kinh_te_vi_mo",
    name: "Kinh tế vi mô",
    keywords: [
      "kinh te vi mo",
      "kinh te",
      "cau",
      "cung",
      "can bang",
      "co dan",
      "thang du",
      "thay the",
      "bo sung",
      "quy mo",
      "chi phi",
      "doanh thu",
      "doc quyen",
      "nhom",
      "cournot",
      "bertrand",
      "nash",
      "ngoai ung",
      "hang hoa cong cong",
      "thue",
      "huu dung",
      "bang can doi",
      "duong bang quan",
      "hicks",
      "slutsky",
      "cobb douglas",
      "giffen",
      "engel",
      "pareto",
      "san xuat",
      "loi the",
      "rào cản",
    ],
  },
  {
    slug: "phap_luat_dai_cuong",
    name: "Pháp luật đại cương",
    keywords: [
      "phap luat",
      "hien phap",
      "bo luat",
      "dan su",
      "thuong mai",
      "doanh nghiep",
      "dat dai",
      "lao dong",
      "so huu tri tue",
      "chung khoan",
      "canh tranh",
      "thue",
      "an ninh mang",
      "giao dich dien tu",
      "trong tai",
      "viac",
      "hop dong",
      "vo hieu",
      "boi thuong",
      "nghia vu",
      "quyen",
      "toa an",
      "nghiem can",
      "luat su",
      "phap quy",
      "van ban",
    ],
  },
];

export interface SubjectScore {
  slug: string;
  name: string;
  score: number;
  matchedKeywords: string[];
}

/**
 * Detect subjects from a Vietnamese text prompt.
 * Returns subjects sorted by score (descending).
 * Score = number of keyword matches.
 */
export function detectSubjects(text: string): SubjectScore[] {
  const normalizedText = normalizeAndTokenize(text).join(" ");
  const scores = new Map<string, SubjectScore>();

  for (const subject of SUBJECT_KEYWORDS) {
    let score = 0;
    const matched: string[] = [];

    for (const keyword of subject.keywords) {
      const normalizedKeyword = keyword
        .split(/[^a-z0-9]+/)
        .filter((t) => t.length > 0)
        .join(" ");
      if (normalizedText.includes(normalizedKeyword)) {
        score++;
        matched.push(keyword);
      }
    }

    if (score > 0) {
      scores.set(subject.slug, {
        slug: subject.slug,
        name: subject.name,
        score,
        matchedKeywords: matched,
      });
    }
  }

  return Array.from(scores.values()).sort((a, b) => b.score - a.score);
}

/**
 * Get the best-matching subject slug from text.
 * Returns null if no subject detected.
 */
export function detectPrimarySubject(text: string): string | null {
  const results = detectSubjects(text);
  return results.length > 0 ? results[0].slug : null;
}

/**
 * Get subject name by slug.
 */
export function getSubjectName(slug: string): string | undefined {
  return SUBJECT_KEYWORDS.find((s) => s.slug === slug)?.name;
}

/**
 * Slugify a Vietnamese string for use as tags.
 */
// Removed: re-export of slugifyVietnamese (consumers import directly from vietnamese.ts)
