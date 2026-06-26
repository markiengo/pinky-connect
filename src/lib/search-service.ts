import { prisma } from "./db";
import { matchDeThi, type DeThiForMatching, type MatchResult } from "./matching";

const MATCHING_CACHE_TTL_MS = 5 * 60 * 1000;

let matchingCache:
  | {
      expiresAt: number;
      data: DeThiForMatching[];
    }
  | undefined;

function parseTags(tags: string): string[] {
  try {
    const parsed = JSON.parse(tags) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((tag): tag is string => typeof tag === "string")
      : [];
  } catch {
    return [];
  }
}

/**
 * Fetch all de-thi from the database and convert to matching format.
 */
export async function getAllDeThiForMatching(): Promise<DeThiForMatching[]> {
  const now = Date.now();
  if (matchingCache && matchingCache.expiresAt > now) {
    return matchingCache.data;
  }

  const deThiList = await prisma.deThi.findMany({
    select: {
      id: true,
      title: true,
      tags: true,
      normalizedTitle: true,
      subject: {
        select: {
          name: true,
          slug: true,
        },
      },
      _count: {
        select: {
          deThiQuestions: true,
        },
      },
      deThiQuestions: {
        select: {
          question: {
            select: {
              type: true,
            },
          },
        },
      },
    },
  });

  const data = deThiList.map((dt) => {
    const questionTypes = Array.from(
      new Set(dt.deThiQuestions.map((dq) => dq.question.type as "mcq" | "essay")),
    );

    return {
      id: dt.id,
      title: dt.title,
      normalizedTitle: dt.normalizedTitle,
      subjectSlug: dt.subject.slug,
      subjectName: dt.subject.name,
      tags: parseTags(dt.tags),
      questionCount: dt._count.deThiQuestions,
      questionTypes,
    };
  });

  matchingCache = {
    expiresAt: now + MATCHING_CACHE_TTL_MS,
    data,
  };

  return data;
}

/**
 * Run a search query against the matching engine.
 * Returns ranked match results.
 */
export async function searchDeThi(prompt: string): Promise<MatchResult[]> {
  const deThiList = await getAllDeThiForMatching();
  return matchDeThi(prompt, deThiList);
}
