import { describe, it, expect } from "vitest";
import { detectSubjects, detectPrimarySubject, getSubjectName } from "../subject-detection";

describe("detectSubjects", () => {
  it("detects Accounting from prompt", () => {
    const result = detectSubjects("Cho mình đề Kế toán về định khoản và bảng cân đối");
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].slug).toBe("ke_toan");
    expect(result[0].score).toBeGreaterThan(0);
  });

  it("detects Banking from prompt", () => {
    const result = detectSubjects("Tìm đề Tài chính ngân hàng về lãi suất và tín dụng");
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].slug).toBe("tai_chinh_ngan_hang");
  });

  it("detects Business from prompt", () => {
    const result = detectSubjects("Cho đề Quản trị kinh doanh về chiến lược marketing");
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].slug).toBe("quan_tri_kinh_doanh");
  });

  it("detects Microeconomics from prompt", () => {
    const result = detectSubjects("Cho mình đề kinh tế vi mô về cầu cung và co dãn");
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].slug).toBe("kinh_te_vi_mo");
  });

  it("detects Law from prompt", () => {
    const result = detectSubjects("Tìm đề pháp luật đại cương về hợp đồng và dân sự");
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].slug).toBe("phap_luat_dai_cuong");
  });

  it("returns empty array for unrelated text", () => {
    const result = detectSubjects("Hello world this is a test");
    expect(result).toEqual([]);
  });

  it("returns multiple subjects when prompt mentions multiple", () => {
    const result = detectSubjects("đề kế toán và tài chính ngân hàng");
    expect(result.length).toBeGreaterThanOrEqual(2);
  });

  it("sorts by score descending", () => {
    const result = detectSubjects("kế toán kế toán tài chính");
    for (let i = 1; i < result.length; i++) {
      expect(result[i - 1].score).toBeGreaterThanOrEqual(result[i].score);
    }
  });
});

describe("detectPrimarySubject", () => {
  it("returns top subject slug", () => {
    expect(detectPrimarySubject("đề kế toán về định khoản")).toBe("ke_toan");
    expect(detectPrimarySubject("đề ngân hàng về lãi suất")).toBe("tai_chinh_ngan_hang");
    expect(detectPrimarySubject("đề marketing về chiến lược")).toBe("quan_tri_kinh_doanh");
  });

  it("returns null for unrelated text", () => {
    expect(detectPrimarySubject("hello world")).toBeNull();
  });
});

describe("getSubjectName", () => {
  it("returns subject name by slug", () => {
    expect(getSubjectName("ke_toan")).toBe("Kế toán");
    expect(getSubjectName("tai_chinh_ngan_hang")).toBe("Tài chính – Ngân hàng");
    expect(getSubjectName("quan_tri_kinh_doanh")).toBe("Quản trị Kinh doanh");
    expect(getSubjectName("kinh_te_vi_mo")).toBe("Kinh tế vi mô");
    expect(getSubjectName("phap_luat_dai_cuong")).toBe("Pháp luật đại cương");
  });

  it("returns undefined for unknown slug", () => {
    expect(getSubjectName("unknown")).toBeUndefined();
  });
});
