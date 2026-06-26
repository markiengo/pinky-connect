import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const prisma = new PrismaClient();

interface SeedQuestion {
  type: string;
  content: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  tags: string[];
}

interface SeedDeThi {
  title: string;
  source: string;
  tags: string[];
  questions: SeedQuestion[];
}

interface SeedFile {
  subject: { slug: string; name: string };
  deThi: SeedDeThi[];
}

function normalizeVietnamese(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function uniqueTags(tags: string[]): string[] {
  return Array.from(new Set(tags));
}

async function seed() {
  console.log("Seeding question bank from JSON data files...");

  await prisma.quizAnswer.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.deThiQuestion.deleteMany();
  await prisma.question.deleteMany();
  await prisma.deThi.deleteMany();
  await prisma.user.deleteMany();
  await prisma.subject.deleteMany();
  console.log("  cleared existing data");

  const dataDir = join(__dirname, "data");
  const jsonFiles = readdirSync(dataDir).filter(
    (f) => f.endsWith(".json") && !f.startsWith("BRAND")
  );
  console.log(`  found ${jsonFiles.length} JSON data files: ${jsonFiles.join(", ")}`);

  const subjectMap = new Map<string, { id: string; slug: string; name: string }>();
  let totalDeThi = 0;
  let totalQuestions = 0;
  const deThiBySubject = new Map<string, { id: string; subjectId: string }[]>();

  for (const jsonFile of jsonFiles) {
    const filePath = join(dataDir, jsonFile);
    const raw = readFileSync(filePath, "utf-8");
    const data: SeedFile = JSON.parse(raw);

    const subjectSlug = data.subject.slug;
    let subject = subjectMap.get(subjectSlug);
    if (!subject) {
      const created = await prisma.subject.create({
        data: { slug: subjectSlug, name: data.subject.name },
      });
      subject = { id: created.id, slug: subjectSlug, name: created.name };
      subjectMap.set(subjectSlug, subject);
      console.log(`  Subject: ${created.name}`);
    }

    for (let di = 0; di < data.deThi.length; di++) {
      const deThi = data.deThi[di];
      if (di % 10 === 0) console.log(`    [${jsonFile}] đề ${di + 1}/${data.deThi.length}...`);
      const dt = await prisma.deThi.create({
        data: {
          subjectId: subject.id,
          title: deThi.title,
          source: deThi.source || "Pinky Exam Bank",
          tags: JSON.stringify(deThi.tags || []),
          normalizedTitle: normalizeVietnamese(deThi.title),
          deThiQuestions: {
            create: deThi.questions.map((q, qi) => ({
              orderIndex: qi,
              question: {
                create: {
                  subjectId: subject.id,
                  type: q.type || "mcq",
                  content: q.content,
                  options: JSON.stringify(q.options),
                  correctAnswer: q.correctAnswer,
                  explanation: q.explanation,
                  tags: JSON.stringify(uniqueTags(q.tags || [])),
                },
              },
            })),
          },
        },
      });
      let subjectDeThi = deThiBySubject.get(subject.id);
      if (!subjectDeThi) {
        subjectDeThi = [];
        deThiBySubject.set(subject.id, subjectDeThi);
      }
      subjectDeThi.push({ id: dt.id, subjectId: dt.subjectId });
      totalQuestions += deThi.questions.length;
      totalDeThi++;
    }
    console.log(`  ${jsonFile}: ${data.deThi.length} đề, ${data.deThi.reduce((s, d) => s + d.questions.length, 0)} questions ✓`);
  }

  console.log(`  Total: ${totalDeThi} đề, ${totalQuestions} questions`);

  // Seed demo users
  const huyenmyHash = await bcrypt.hash("my1234", 10);
  const pinkyHash = await bcrypt.hash("pinky1234", 10);

  const huyenmy = await prisma.user.create({
    data: { username: "huyenmy", passwordHash: huyenmyHash, plan: "premium" },
  });
  const pinky = await prisma.user.create({
    data: { username: "pinky", passwordHash: pinkyHash, plan: "basic" },
  });
  console.log("  Users: huyenmy (premium), pinky (basic) ✓");

  // Seed quiz attempts — simple sequential loop
  const subjectIds = Array.from(deThiBySubject.keys());
  const ATTEMPTS_PER_SUBJECT = 5;

  function rand(seed: number): number {
    const x = Math.sin(seed * 9999 + 1111) * 10000;
    return x - Math.floor(x);
  }

  async function seedAttempts(
    userId: string,
    username: string,
    baseSeed: number,
    scoreRange: [number, number],
    daysSpread: number
  ) {
    let count = 0;
    let dayOffset = daysSpread;

    for (let sIdx = 0; sIdx < subjectIds.length; sIdx++) {
      const subjectDeThi = deThiBySubject.get(subjectIds[sIdx])!;

      for (let aIdx = 0; aIdx < ATTEMPTS_PER_SUBJECT; aIdx++) {
        const dt = subjectDeThi[Math.floor(rand(baseSeed + sIdx * 100 + aIdx) * subjectDeThi.length)];

        const dthiQuestions = await prisma.deThiQuestion.findMany({
          where: { deThiId: dt.id },
          orderBy: { orderIndex: "asc" },
          include: { question: true },
        });
        const totalQs = dthiQuestions.length;

        const progress = (aIdx + 1) / ATTEMPTS_PER_SUBJECT;
        const minPct = scoreRange[0] + (scoreRange[1] - scoreRange[0]) * 0.3 * progress;
        const maxPct = scoreRange[0] + (scoreRange[1] - scoreRange[0]) * progress;
        const pctSeed = rand(baseSeed + sIdx * 100 + aIdx + 500);
        const percentage = Math.round(minPct + pctSeed * (maxPct - minPct));
        const score = Math.round((percentage / 100) * totalQs);

        const correctSet = new Set<number>();
        const seedBase = baseSeed + sIdx * 1000 + aIdx * 100 + percentage;
        let attempts = 0;
        while (correctSet.size < score && correctSet.size < totalQs && attempts < totalQs * 10) {
          correctSet.add(Math.floor(rand(seedBase + attempts) * totalQs));
          attempts++;
        }

        const attempt = await prisma.quizAttempt.create({
          data: {
            userId, deThiId: dt.id, subjectId: dt.subjectId,
            score, totalQuestions: totalQs, percentage,
            completedAt: new Date(Date.now() - dayOffset * 24 * 60 * 60 * 1000),
          },
        });

        const answers = dthiQuestions.map((dq, qIdx) => {
          const isCorrect = correctSet.has(qIdx);
          const options = dq.question.options ? JSON.parse(dq.question.options) as string[] : [];
          const wrongs = options.filter(o => o !== dq.question.correctAnswer);
          let userAnswer: string;
          if (isCorrect) userAnswer = dq.question.correctAnswer;
          else if (wrongs.length > 0) userAnswer = wrongs[Math.floor(rand(seedBase + qIdx + 500) * wrongs.length)];
          else userAnswer = "";
          return { attemptId: attempt.id, questionId: dq.questionId, userAnswer, isCorrect };
        });

        await prisma.quizAnswer.createMany({ data: answers });
        count++;
        dayOffset -= Math.floor(daysSpread / (subjectIds.length * ATTEMPTS_PER_SUBJECT));
      }
    }
    console.log(`  ${username}: ${count} attempts ✓`);
    return count;
  }

  console.log("  Seeding quiz attempts...");
  const huyenmyCount = await seedAttempts(huyenmy.id, "huyenmy", 1000, [45, 85], 60);
  const pinkyCount = await seedAttempts(pinky.id, "pinky", 2000, [30, 75], 58);

  console.log(`  Quiz attempts: ${huyenmyCount} for huyenmy, ${pinkyCount} for pinky`);
  console.log("Seeding complete.");
}

export async function disconnectSeedDb() {
  await prisma.$disconnect();
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  seed()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(() => disconnectSeedDb());
}
