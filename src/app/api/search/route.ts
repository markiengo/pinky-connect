import { NextRequest, NextResponse } from "next/server";
import { searchDeThi } from "@/lib/search-service";
import { normalizeAndTokenize } from "@/lib/vietnamese";
import { getSession } from "@/lib/session";

export const runtime = "nodejs";
export const maxDuration = 30;

const MAX_PROMPTS_PER_SESSION = 3;
const MAX_WORDS_PER_PROMPT = 200;
const MAX_FILES_PER_PROMPT = 3;
const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

interface ErrorResponse {
  error: string;
  code: string;
}

function errorResponse(error: string, code: string, status = 400) {
  return NextResponse.json<ErrorResponse>({ error, code }, { status });
}

function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0).length;
}

async function extractPdfText(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const { PDFParse } = await import("pdf-parse");
  const parser = new PDFParse({ data: buffer });
  const result = await parser.getText();
  return result.text || "";
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return errorResponse(
        "Vui lòng đăng nhập để sử dụng tính năng này.",
        "UNAUTHORIZED",
        401,
      );
    }

    const formData = await request.formData();
    const prompt = (formData.get("prompt") as string | null)?.trim() ?? "";
    const files = formData.getAll("files").filter((f) => f instanceof File) as File[];

    // ── Validate prompt ──
    if (!prompt && files.length === 0) {
      return errorResponse(
        "Vui lòng nhập câu hỏi hoặc tải lên file PDF.",
        "EMPTY_INPUT",
      );
    }

    const wordCount = countWords(prompt);
    if (prompt && wordCount > MAX_WORDS_PER_PROMPT) {
      return errorResponse(
        `Câu hỏi quá dài (${wordCount} từ). Giới hạn ${MAX_WORDS_PER_PROMPT} từ mỗi câu hỏi.`,
        "PROMPT_TOO_LONG",
      );
    }

    // ── Validate files ──
    if (files.length > MAX_FILES_PER_PROMPT) {
      return errorResponse(
        `Bạn chỉ được tải lên tối đa ${MAX_FILES_PER_PROMPT} file PDF mỗi lần.`,
        "TOO_MANY_FILES",
      );
    }

    for (const file of files) {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
        return errorResponse(
          `File "${file.name}" không phải PDF. Chỉ hỗ trợ file PDF.`,
          "NOT_PDF",
        );
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        return errorResponse(
          `File "${file.name}" quá lớn (${(file.size / 1024 / 1024).toFixed(1)}MB). Giới hạn ~20MB mỗi file.`,
          "FILE_TOO_LARGE",
        );
      }
    }

    // ── Session prompt counting via cookie ──
    const cookieName = "crambox_prompt_count";
    let promptCount = 0;
    const existingCookie = request.cookies.get(cookieName);
    if (existingCookie) {
      promptCount = parseInt(existingCookie.value, 10) || 0;
    }

    if (promptCount >= MAX_PROMPTS_PER_SESSION) {
      return errorResponse(
        "Bạn đã dùng hết 3 lượt hỏi trong phiên này. Vui lòng tải lại trang để bắt đầu phiên mới.",
        "PROMPT_LIMIT_REACHED",
      );
    }

    // ── Extract PDF text ──
    let pdfText = "";
    if (files.length > 0) {
      const textParts: string[] = [];
      for (const file of files) {
        try {
          const text = await extractPdfText(file);
          if (text.trim().length === 0) {
            return errorResponse(
              `File "${file.name}" không có nội dung văn bản có thể đọc được.`,
              "PDF_NO_TEXT",
            );
          }
          textParts.push(text);
        } catch {
          return errorResponse(
            `Không thể đọc file PDF "${file.name}". File có thể bị hỏng hoặc được bảo vệ.`,
            "PDF_PARSE_ERROR",
          );
        }
      }
      pdfText = textParts.join("\n\n");
    }

    // ── Combine prompt + PDF text for matching ──
    const combinedText = [prompt, pdfText].filter(Boolean).join("\n\n");
    const normalizedText = normalizeAndTokenize(combinedText).join(" ");

    if (!normalizedText) {
      return errorResponse(
        "Không thể đọc nội dung. Vui lòng nhập câu hỏi rõ hơn hoặc thử file PDF khác.",
        "NO_READABLE_TEXT",
      );
    }

    // ── Run matching engine ──
    const results = await searchDeThi(combinedText);

    if (results.length === 0) {
      const response = NextResponse.json({
        results: [],
        message:
          "Không tìm thấy đề phù hợp. Bạn hãy thử nhập rõ môn học/chủ đề hơn hoặc upload tài liệu khác.",
        promptUsed: promptCount + 1,
        promptsRemaining: MAX_PROMPTS_PER_SESSION - promptCount - 1,
      });
      response.cookies.set(cookieName, String(promptCount + 1), {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 60 * 60, // 1 hour session
        path: "/",
      });
      return response;
    }

    // ── Build response ──
    const cards = results.map((r) => ({
      id: r.deThi.id,
      title: r.deThi.title,
      subject: r.deThi.subjectName,
      subjectSlug: r.deThi.subjectSlug,
      questionCount: r.deThi.questionCount,
      questionTypes: r.deThi.questionTypes,
      matchReason: r.matchReason,
      matchedTags: r.matchedTags,
      score: r.score,
    }));

    const response = NextResponse.json({
      results: cards,
      message:
        files.length > 0
          ? `Mình thấy nội dung chính từ file bạn tải lên. Dưới đây là ${cards.length} đề phù hợp nhất.`
          : `Mình tìm thấy ${cards.length} đề phù hợp với yêu cầu của bạn.`,
      promptUsed: promptCount + 1,
      promptsRemaining: MAX_PROMPTS_PER_SESSION - promptCount - 1,
    });

    response.cookies.set(cookieName, String(promptCount + 1), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Search API error:", error);
    return errorResponse(
      "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      "SERVER_ERROR",
      500,
    );
  }
}
