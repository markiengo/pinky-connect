import { prisma } from "./db";
import { matchDeThi, type DeThiForMatching, type MatchResult } from "./matching";

/**
 * Fetch all de-thi from the database and convert to matching format.
 */
export async function getAllDeThiForMatching(): Promise<DeThiForMatching[]> {
  const deThiList = await prisma.deThi.findMany({
    include: {
      subject: true,
      questions: {
        select: { id: true, type: true },
      },
    },
  });

  return deThiList.map((dt) => {
    const questionTypes = Array.from(
      new Set(dt.questions.map((q) => q.type as "mcq" | "essay")),
    );
    let tags: string[] = [];
    try {
      tags = JSON.parse(dt.tags) as string[];
    } catch {
      tags = [];
    }
    return {
      id: dt.id,
      title: dt.title,
      subjectSlug: dt.subject.slug,
      subjectName: dt.subject.name,
      tags,
      questionCount: dt.questions.length,
      questionTypes,
    };
  });
}

/**
 * Run a search query against the matching engine.
 * Returns ranked match results.
 */
export async function searchDeThi(prompt: string): Promise<MatchResult[]> {
  const deThiList = await getAllDeThiForMatching();
  return matchDeThi(prompt, deThiList);
}
