import { describe, it, expect } from "vitest";
import { matchDeThi, extractTagsFromPrompt, type DeThiForMatching } from "../matching";

const MOCK_DE_THI: DeThiForMatching[] = [
  {
    id: "de_ke_toan_1",
    title: "Đề thi Nguyên lý Kế toán – FTU",
    subjectSlug: "ke_toan",
    subjectName: "Kế toán",
    tags: ["tong_quan_ke_toan", "tai_khoan_ghi_s kep", "dinh_khoan", "bang_can_doi_ke_toan"],
    questionCount: 10,
    questionTypes: ["mcq", "essay"],
  },
  {
    id: "de_ngan_hang_1",
    title: "Đề thi Tài chính – Tiền tệ – HVNH",
    subjectSlug: "tai_chinh_ngan_hang",
    subjectName: "Tài chính – Ngân hàng",
    tags: ["tai_chinh_tien_te", "lai_suat", "chinh_sach_tien_te", "ngan_hang_trung_uong"],
    questionCount: 9,
    questionTypes: ["mcq", "essay"],
  },
  {
    id: "de_marketing_1",
    title: "Đề thi Quản trị Marketing – ĐH Mở",
    subjectSlug: "quan_tri_kinh_doanh",
    subjectName: "Quản trị Kinh doanh",
    tags: ["quan_tri_marketing", "chien_luoc_marketing", "chien_luoc_gia", "phan_khuc_thi_truong"],
    questionCount: 9,
    questionTypes: ["mcq", "essay"],
  },
  {
    id: "de_chien_luoc_1",
    title: "Đề thi Quản trị Chiến lược – UEL",
    subjectSlug: "quan_tri_kinh_doanh",
    subjectName: "Quản trị Kinh doanh",
    tags: ["quan_tri_chien_luoc", "swot", "porter_5_luc", "tam_nhin_su_menh", "bcg_matrix"],
    questionCount: 8,
    questionTypes: ["mcq", "essay"],
  },
];

describe("extractTagsFromPrompt", () => {
  it("extracts individual word tags", () => {
    const tags = extractTagsFromPrompt("kế toán định khoản");
    expect(tags).toContain("toan");
    expect(tags).toContain("dinh");
    expect(tags).toContain("khoan");
  });

  it("extracts multi-word phrase tags", () => {
    const tags = extractTagsFromPrompt("đề kế toán về định khoản");
    expect(tags).toContain("ke_toan");
    expect(tags).toContain("dinh_khoan");
  });

  it("returns empty array for empty input", () => {
    expect(extractTagsFromPrompt("")).toEqual([]);
  });
});

describe("matchDeThi", () => {
  it("returns ranked results for accounting prompt", () => {
    const results = matchDeThi("Cho mình đề Kế toán về định khoản", MOCK_DE_THI);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].deThi.subjectSlug).toBe("ke_toan");
  });

  it("returns ranked results for banking prompt", () => {
    const results = matchDeThi("Tìm đề Tài chính ngân hàng về lãi suất", MOCK_DE_THI);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].deThi.subjectSlug).toBe("tai_chinh_ngan_hang");
  });

  it("returns ranked results for marketing prompt", () => {
    const results = matchDeThi("đề Quản trị marketing về chiến lược giá", MOCK_DE_THI);
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].deThi.subjectSlug).toBe("quan_tri_kinh_doanh");
  });

  it("includes match reason in results", () => {
    const results = matchDeThi("đề kế toán về định khoản", MOCK_DE_THI);
    expect(results[0].matchReason).toBeTruthy();
    expect(results[0].matchReason.length).toBeGreaterThan(0);
  });

  it("includes matched tags in results", () => {
    const results = matchDeThi("đề kế toán định khoản", MOCK_DE_THI);
    expect(results[0].matchedTags).toBeDefined();
    expect(Array.isArray(results[0].matchedTags)).toBe(true);
  });

  it("returns at most maxResults", () => {
    const results = matchDeThi("đề kế toán định khoản", MOCK_DE_THI, 2, 1);
    expect(results.length).toBeLessThanOrEqual(2);
  });

  it("sorts by score descending", () => {
    const results = matchDeThi("kế toán định khoản ngân hàng marketing", MOCK_DE_THI);
    for (let i = 1; i < results.length; i++) {
      expect(results[i - 1].score).toBeGreaterThanOrEqual(results[i].score);
    }
  });

  it("returns empty array when no matches", () => {
    const results = matchDeThi("hello world nothing matches", MOCK_DE_THI);
    expect(results).toEqual([]);
  });
});
