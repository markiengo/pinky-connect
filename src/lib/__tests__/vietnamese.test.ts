import { describe, it, expect } from "vitest";
import {
  stripDiacritics,
  normalize,
  tokenize,
  normalizeAndTokenize,
  slugifyVietnamese,
} from "../vietnamese";

describe("stripDiacritics", () => {
  it("removes Vietnamese diacritics", () => {
    expect(stripDiacritics("Đạo hàm")).toBe("Dao ham");
    expect(stripDiacritics("Ngân hàng")).toBe("Ngan hang");
    expect(stripDiacritics("Kế toán")).toBe("Ke toan");
  });

  it("handles đ and Đ", () => {
    expect(stripDiacritics("đạo")).toBe("dao");
    expect(stripDiacritics("ĐẠO")).toBe("DAO");
  });

  it("handles text without diacritics", () => {
    expect(stripDiacritics("hello")).toBe("hello");
  });
});

describe("normalize", () => {
  it("lowercases and strips diacritics", () => {
    expect(normalize("Đạo Hàm")).toBe("dao ham");
    expect(normalize("  Tài Chính  ")).toBe("tai chinh");
  });
});

describe("tokenize", () => {
  it("splits into word tokens", () => {
    expect(tokenize("dao ham cua ham so")).toEqual(["dao", "ham", "cua", "ham", "so"]);
  });

  it("handles mixed punctuation", () => {
    expect(tokenize("kế toán, tài chính! ngân hàng?")).toEqual(["ke", "toan", "tai", "chinh", "ngan", "hang"]);
  });

  it("handles numbers", () => {
    expect(tokenize("lai suat 12%")).toEqual(["lai", "suat", "12"]);
  });

  it("removes empty tokens", () => {
    expect(tokenize("   ")).toEqual([]);
  });
});

describe("normalizeAndTokenize", () => {
  it("combines normalization and tokenization", () => {
    expect(normalizeAndTokenize("Cho mình đề Ngân hàng về lãi suất")).toEqual([
      "cho", "minh", "de", "ngan", "hang", "ve", "lai", "suat",
    ]);
  });

  it("handles complex Vietnamese text", () => {
    expect(normalizeAndTokenize("Đề thi Quản trị Kinh doanh – Marketing")).toEqual([
      "de", "thi", "quan", "tri", "kinh", "doanh", "marketing",
    ]);
  });
});

describe("slugifyVietnamese", () => {
  it("creates snake_case slugs from Vietnamese", () => {
    expect(slugifyVietnamese("Đạo hàm")).toBe("dao_ham");
    expect(slugifyVietnamese("Ngân hàng thương mại")).toBe("ngan_hang_thuong_mai");
  });

  it("handles special characters", () => {
    expect(slugifyVietnamese("Tài chính – Tiền tệ!")).toBe("tai_chinh_tien_te");
  });
});
