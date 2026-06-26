import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function normalizeVietnamese(str: string): string {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}

function slugify(str: string): string {
  return normalizeVietnamese(str)
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
}

// ─── Types ──────────────────────────────────────────────────────────
interface QuestionData {
  type: "mcq" | "essay";
  content: string;
  options?: string[];
  correctAnswer: string;
  orderIndex: number;
}

interface DeThiData {
  title: string;
  source: string;
  tags: string[];
  questions: QuestionData[];
}

interface SubjectData {
  slug: string;
  name: string;
  deThi: DeThiData[];
}

// ─── Seed Data ──────────────────────────────────────────────────────
const SEED_DATA: SubjectData[] = [
  // ── Kế toán (Accounting) — 5 đề ──────────────────────────────────
  {
    slug: "ke_toan",
    name: "Kế toán",
    deThi: [
      {
        title: "Nguyên lý Kế toán – FTU (Nâng cao)",
        source: "Đại học Ngoại thương",
        tags: ["tong_quan_ke_toan", "tai_khoan", "dinh_khoan", "vat", "bang_can_doi"],
        questions: [
          {
            type: "mcq",
            content: "Doanh nghiệp A mua lô hàng hóa 200 triệu (chưa thuế GTGT 10%), trong đó phát sinh chi phí vận chuyển 5 triệu (chưa thuế GTGT 10%) do bên bán chịu, thanh toán bằng chuyển khoản. Giá trị hàng hóa nhập kho (theo nguyên tắc kế toán) là bao nhiêu?",
            options: ["200 triệu", "205 triệu", "225 triệu", "220 triệu"],
            correctAnswer: "205 triệu",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "Tình huống: DN xuất kho nguyên vật liệu 50 triệu cho sản xuất, đồng thời phát hiện hao hụt tự nhiên 2 triệu (trong định mức). Định khoản nào sau đây ĐÚNG?",
            options: [
              "Nợ TK 621: 50tr / Có TK 152: 50tr; riêng 2tr hao hụt không định khoản",
              "Nợ TK 621: 48tr / Có TK 152: 48tr; 2tr hao hụt ghi Nợ TK 632 / Có TK 152: 2tr",
              "Nợ TK 621: 50tr / Có TK 152: 50tr; 2tr hao hụt ghi Nợ TK 1388 / Có TK 152: 2tr",
              "Nợ TK 621: 52tr / Có TK 152: 52tr",
            ],
            correctAnswer: "Nợ TK 621: 50tr / Có TK 152: 50tr; riêng 2tr hao hụt không định khoản",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Doanh nghiệp B có số dư đầu kỳ TK 156 (Hàng hóa): 100 triệu. Trong kỳ: nhập kho 300 triệu, xuất bán 250 triệu. Cuối kỳ phát hiện hàng tồn kho bị hư hỏng 10 triệu (do bảo quản kém, ngoài định mức). Giá trị hàng tồn kho cuối kỳ trên BCDKT là:",
            options: ["140 triệu", "150 triệu", "130 triệu", "160 triệu"],
            correctAnswer: "140 triệu",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "Phát biểu nào SAI về nguyên tắc 'trọng yếu' trong kế toán Việt Nam?",
            options: [
              "Thông tin trọng yếu phải được trình bày đầy đủ, chính xác",
              "Thông tin không trọng yếu có thể được gộp chung trên BCTC",
              "Một khoản chi phí 50 triệu được coi là trọng yếu đối với mọi doanh nghiệp bất kể quy mô",
              "Tính trọng yếu phụ thuộc vào quy mô và bản chất khoản mục",
            ],
            correctAnswer: "Một khoản chi phí 50 triệu được coi là trọng yếu đối với mọi doanh nghiệp bất kể quy mô",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "DN C thực hiện nghiệp vụ: Bán hàng hóa 150 triệu (chưa thuế GTGT 10%), khách hàng thanh toán 50% bằng tiền mặt, 50% còn lại ghi nợ. Chi phí bán hàng thực tế phát sinh 8 triệu (chưa thuế). Định khoản nghiệp vụ bán hàng (bao gồm cả thuế GTGT đầu ra và chi phí bán hàng) là:",
            options: [
              "Nợ TK 111: 75tr, Nợ TK 131: 75tr / Có TK 511: 150tr; Nợ TK 641: 8tr / Có TK 111: 8tr",
              "Nợ TK 111: 75tr, Nợ TK 131: 82.5tr / Có TK 511: 150tr, Có TK 33311: 7.5tr; Nợ TK 641: 8tr, Nợ TK 1331: 0.8tr / Có TK 111: 8.8tr",
              "Nợ TK 111: 165tr / Có TK 511: 150tr, Có TK 33311: 15tr; Nợ TK 641: 8tr / Có TK 111: 8.8tr",
              "Nợ TK 111: 75tr, Nợ TK 131: 82.5tr / Có TK 511: 150tr, Có TK 3331: 15tr",
            ],
            correctAnswer: "Nợ TK 111: 75tr, Nợ TK 131: 82.5tr / Có TK 511: 150tr, Có TK 33311: 7.5tr; Nợ TK 641: 8tr, Nợ TK 1331: 0.8tr / Có TK 111: 8.8tr",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Cho số dư đầu kỳ các TK: 111 (Tiền mặt) = 80tr, 112 (Tiền gửi NH) = 200tr, 331 (Phải trả người bán) = 50tr. Trong kỳ phát sinh:\n1. Rút TGNH về quỹ: 30tr\n2. Mua NVL nhập kho 60tr + VAT 6tr, trả bằng TGNH\n3. Trả nợ người bán 50tr bằng tiền mặt\nSố dư cuối kỳ TK 111 là:",
            options: ["60 triệu", "30 triệu", "80 triệu", "10 triệu"],
            correctAnswer: "60 triệu",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "Doanh nghiệp D có TSCĐ hữu hình nguyên giá 800 triệu, giá trị残留 80 triệu, thời gian sử dụng 8 năm, đã sử dụng 3 năm. Nếu chuyển sang phương pháp khấu hao giảm dần (declining balance) từ năm thứ 4 với tỷ lệ 25%, mức khấu hao năm thứ 4 là:",
            options: ["100 triệu", "140 triệu", "90 triệu", "80 triệu"],
            correctAnswer: "140 triệu",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "Nghiệp vụ: DN nhận trước tiền hàng 30 triệu bằng chuyển khoản cho một đơn hàng sẽ giao trong tháng sau. Định khoản ĐÚNG theo nguyên tắc dồn tích (VAS 14) là:",
            options: [
              "Nợ TK 112: 30tr / Có TK 511: 30tr",
              "Nợ TK 112: 30tr / Có TK 131: 30tr",
              "Nợ TK 112: 30tr / Có TK 3387: 30tr",
              "Nợ TK 112: 30tr / Có TK 511: 27tr, Có TK 33311: 3tr",
            ],
            correctAnswer: "Nợ TK 112: 30tr / Có TK 3387: 30tr",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Bảng cân đối số phát sinh có tổng phát sinh Nợ = 500 triệu, nhưng tổng phát sinh Có = 495 triệu. Phát biểu nào ĐÚNG?",
            options: [
              "Bảng cân đối kế toán sẽ không cân bằng",
              "Có lỗi trong định khoản — nguyên tắc ghi sổ kép bị vi phạm",
              "Có thể do nghiệp vụ ghi một bên (chỉ Nợ hoặc chỉ Có) chưa hoàn chỉnh",
              "Bảng cân đối số phát sinh luôn cân bằng, con số 495 là do làm tròn",
            ],
            correctAnswer: "Có lỗi trong định khoản — nguyên tắc ghi sổ kép bị vi phạm",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "DN E có số liệu trong kỳ:\n- Doanh thu bán hàng: 400tr\n- Giá vốn hàng bán: 240tr\n- Chi phí bán hàng: 30tr\n- Chi phí quản lý DN: 25tr\n- Thu nhập khác: 15tr\n- Chi phí khác: 10tr\n- Thuế TNDN 20%\nLợi nhuận sau thuế (net income) là:",
            options: ["88 triệu", "80 triệu", "110 triệu", "100 triệu"],
            correctAnswer: "88 triệu",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "Một doanh nghiệp áp dụng phương pháp kiểm kê định kỳ. Số liệu:\n- Hàng tồn đầu kỳ (TK 156 đầu kỳ): 60tr\n- Mua hàng trong kỳ (TK 611): 320tr\n- Hàng tồn cuối kỳ (kiểm kê thực tế): 80tr\nGiá vốn hàng bán trong kỳ là:",
            options: ["300 triệu", "320 triệu", "260 triệu", "340 triệu"],
            correctAnswer: "300 triệu",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "Doanh nghiệp F bán sản phẩm kèm theo chương trình bảo hành 2 năm. Doanh thu bán hàng 100tr, chi phí ước tính cho bảo hành là 5tr. Theo nguyên tắc thận trọng và phù hợp, định khoản ghi nhận là:",
            options: [
              "Nợ TK 111/131: 100tr / Có TK 511: 100tr; không ghi nhận chi phí bảo hành",
              "Nợ TK 111/131: 100tr / Có TK 511: 100tr; Nợ TK 641: 5tr / Có TK 3523: 5tr",
              "Nợ TK 111/131: 100tr / Có TK 511: 95tr, Có TK 3387: 5tr",
              "Nợ TK 111/131: 100tr / Có TK 511: 95tr; Nợ TK 632: 5tr / Có TK 3523: 5tr",
            ],
            correctAnswer: "Nợ TK 111/131: 100tr / Có TK 511: 100tr; Nợ TK 641: 5tr / Có TK 3523: 5tr",
            orderIndex: 11,
          },
          {
            type: "mcq",
            content: "Cho BCDKT đầu kỳ: Tổng tài sản = 1.000tr, Nợ phải trả = 400tr. Trong kỳ: mua TSCĐ 200tr trả bằng TGNH, khấu hao kỳ 20tr, lợi nhuận sau thuế kỳ 50tr. Tổng tài sản cuối kỳ là:",
            options: ["1.050 triệu", "1.230 triệu", "1.200 triệu", "1.030 triệu"],
            correctAnswer: "1.030 triệu",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "Doanh nghiệp G có các nghiệp vụ trong tháng 6/2025:\n\n1. Mua nguyên vật liệu nhập kho: giá mua 120 triệu (chưa VAT 10%), chi phí vận chuyển 8 triệu (chưa VAT 10%), thanh toán bằng TGNH.\n2. Xuất kho NVL cho sản xuất: 80 triệu (theo phương pháp FIFO).\n3. Nhận vốn góp bằng TSCĐ hữu hình: nguyên giá 300 triệu, giá trị còn lại 250 triệu.\n4. Bán sản phẩm: doanh thu 200 triệu (chưa VAT 10%), giá vốn 110 triệu, khách thanh toán 60% bằng TGNH, 40% ghi nợ.\n5. Trích khấu hao TSCĐ trong tháng: 15 triệu (trong đó: bộ phận sản xuất 10 triệu, bộ phận quản lý 5 triệu).\n6. Tính thuế TNDN 20% trên lợi nhuận trước thuế.\n\nYêu cầu:\na) Định khoản tất cả các nghiệp vụ trên (bao gồm cả thuế GTGT).\nb) Xác định lợi nhuận sau thuế tháng 6.",
            correctAnswer: "**a) Định khoản:**\n\n**NV1:** Nợ TK 152: 128tr, Nợ TK 1331: 12.8tr / Có TK 112: 140.8tr\n**NV2:** Nợ TK 621: 80tr / Có TK 152: 80tr\n**NV3:** Nợ TK 211: 300tr / Có TK 411: 250tr, Có TK 214: 50tr\n**NV4:** Nợ TK 112: 132tr, Nợ TK 131: 88tr / Có TK 511: 200tr, Có TK 33311: 20tr; Nợ TK 632: 110tr / Có TK 155: 110tr\n**NV5:** Nợ TK 627: 10tr, Nợ TK 642: 5tr / Có TK 214: 15tr\n**NV6:** Lợi nhuận trước thuế = 200 - 110 - 15 = 75tr; Thuế TNDN = 15tr; Nợ TK 821: 15tr / Có TK 3334: 15tr\n\n**b) Lợi nhuận sau thuế = 75 - 15 = 60 triệu đồng**",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "Doanh nghiệp H có số dư đầu kỳ các tài khoản (triệu đồng):\n- TK 111: 50; TK 112: 150; TK 152: 80; TK 156: 120; TK 211: 600 (KH lũy kế 200); TK 331: 100; TK 341: 200; TK 411: 500; TK 421: 0\n\nPhát sinh trong kỳ:\n1. Mua hàng hóa 200tr + VAT 20tr, trả TGNH 110tr, còn lại ghi nợ.\n2. Bán hàng 300tr + VAT 30tr, giá vốn 180tr, thu TGNH 165tr, còn lại ghi nợ.\n3. Trích khấu hao TSCĐ: 40tr.\n4. Trả lãi vay 15tr bằng tiền mặt.\n5. Chi phí bán hàng + quản lý DN: 35tr (trả bằng TGNH).\n6. Thuế TNDN 20%.\n\nYêu cầu: Lập Bảng cân đối kế toán cuối kỳ.",
            correctAnswer: "**Bảng cân đối kế toán cuối kỳ (triệu đồng)**\n\nLợi nhuận trước thuế = 300 - 180 - 40 - 15 - 35 = 30tr\nThuế TNDN = 6tr; LNST = 24tr\n\n| TÀI SẢN | Số tiền | NGUỒN VỐN | Số tiền |\n|---------|---------|-----------|---------|\n| A. Tài sản ngắn hạn | 595 | A. Nợ phải trả | 360 |\n|  Tiền mặt (50-15) | 35 |  Phải trả người bán (100+110) | 210 |\n|  Tiền gửi NH (150-110+165-35) | 170 |  Vay và nợ thuê TC (200) | 200 |\n|  Phải thu KH (165) | 165 | | |\n|  Hàng tồn kho (120+200-180) | 140 | B. Vốn chủ sở hữu | 524 |\n|  NVL (80) | 80 |  Vốn góp (500) | 500 |\n| B. Tài sản dài hạn | 360 |  Lợi nhuận KPT (24) | 24 |\n|  TSCĐ HH (600-200-40+40) | 400 | | |\n|  (-) KH lũy kế (200+40) | (40) | | |\n|  GT còn lại TSCĐ | 360 | | |\n| **Tổng tài sản** | **955** | **Tổng nguồn vốn** | **955** |",
            orderIndex: 14,
          },
        ],
      },
      {
        title: "Kế toán Tài chính – NEU (Nâng cao)",
        source: "Đại học Kinh tế Quốc dân",
        tags: ["ke_toan_tai_chinh", "khau_hao", "bao_cao_tai_chinh", "roe_roa", "thanh_khoan"],
        questions: [
          {
            type: "mcq",
            content: "Doanh nghiệp I có TSCĐ hữu hình nguyên giá 1.200 triệu, thời gian sử dụng hữu ích 10 năm, giá trị残留 120 triệu. Đã sử dụng 4 năm theo phương pháp đường thẳng. Năm thứ 5, doanh nghiệp đánh giá lại thời gian sử dụng còn 5 năm (thay vì 6), giá trị残留 mới 60 triệu. Mức khấu hao năm thứ 5 là:",
            options: ["108 triệu/năm", "120 triệu/năm", "96 triệu/năm", "132 triệu/năm"],
            correctAnswer: "120 triệu/năm",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "Cho số liệu (triệu đồng): Doanh thu thuần 800, giá vốn hàng bán 480, chi phí bán hàng 60, chi phí quản lý DN 40, thu nhập hoạt động tài chính 20, chi phí tài chính 35, thu nhập khác 10, chi phí khác 15, thuế TNDN 20%. Vòng quay hàng tồn kho (giả sử HTK bình quân 100tr) là:",
            options: ["4.8 vòng", "5.0 vòng", "8.0 vòng", "3.2 vòng"],
            correctAnswer: "4.8 vòng",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Doanh nghiệp J có số liệu: Lợi nhuận sau thuế 120tr, tổng tài sản bình quân 1.000tr, vốn chủ sở hữu bình quân 600tr, doanh thu thuần 1.500tr. ROE (tỷ suất lợi nhuận trên VCSH) là:",
            options: ["12%", "20%", "8%", "15%"],
            correctAnswer: "20%",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "Báo cáo lưu chuyển tiền tệ theo phương pháp GIÁN TIẾP: Dòng tiền từ hoạt động kinh doanh được điều chỉnh từ lợi nhuận trước thuế bằng cách:",
            options: [
              "Cộng khấu hao, cộng giảm tài sản ngắn hạn, trừ tăng tài sản ngắn hạn, cộng tăng nợ ngắn hạn, trừ giảm nợ ngắn hạn",
              "Cộng khấu hao, cộng tăng tài sản ngắn hạn, trừ giảm tài sản ngắn hạn",
              "Trừ khấu hao, cộng tăng nợ ngắn hạn",
              "Cộng doanh thu, trừ chi phí",
            ],
            correctAnswer: "Cộng khấu hao, cộng giảm tài sản ngắn hạn, trừ tăng tài sản ngắn hạn, cộng tăng nợ ngắn hạn, trừ giảm nợ ngắn hạn",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "DN K có tỷ suất thanh toán hiện hành = 0.8, tỷ suất thanh toán nhanh = 0.7. Phát biểu nào ĐÚNG?",
            options: [
              "Doanh nghiệp có thanh khoản tốt, hàng tồn kho chiếm tỷ trọng thấp",
              "Doanh nghiệp gặp rủi ro thanh khoản, hàng tồn kho chiếm tỷ trọng thấp trong tài sản ngắn hạn",
              "Doanh nghiệp có thanh khoản tốt nhưng hàng tồn kho chiếm tỷ trọng cao",
              "Tỷ suất thanh toán nhanh = 0.7 cho thấy DN đủ khả năng thanh toán nợ ngắn hạn",
            ],
            correctAnswer: "Doanh nghiệp gặp rủi ro thanh khoản, hàng tồn kho chiếm tỷ trọng thấp trong tài sản ngắn hạn",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Một khoản chi phí sửa chữa lớn TSCĐ 50 triệu được thực hiện. Chi phí này làm tăng năng lực sản xuất và kéo dài thời gian sử dụng hữu ích thêm 3 năm. Xử lý kế toán ĐÚNG là:",
            options: [
              "Ghi nhận toàn bộ vào chi phí sản xuất kinh doanh trong kỳ",
              "Vốn hóa: Nợ TK 211 / Có TK 111,112: 50 triệu, tăng nguyên giá TSCĐ",
              "Ghi nhận vào chi phí trả trước và phân bổ dần",
              "Ghi nhận vào chi phí khác",
            ],
            correctAnswer: "Vốn hóa: Nợ TK 211 / Có TK 111,112: 50 triệu, tăng nguyên giá TSCĐ",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "DN L có doanh thu thuần 500tr, tổng tài sản bình quân 800tr, tài sản ngắn hạn bình quân 300tr, hàng tồn kho bình quân 100tr. Vòng quay tài sản tổng (total asset turnover) là:",
            options: ["0.625 vòng", "1.6 vòng", "5 vòng", "1.67 vòng"],
            correctAnswer: "0.625 vòng",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "Theo VAS 01, nguyên tắc 'nhất quán' yêu cầu:",
            options: [
              "Các chính sách kế toán phải được áp dụng nhất quán trong các kỳ kế toán, chỉ thay đổi khi có quy định mới hoặc sự thay đổi đáng kể về bản chất nghiệp vụ",
              "Mọi nghiệp vụ phải được ghi nhận cùng một cách bất kể hoàn cảnh",
              "Phải sử dụng cùng một phương pháp khấu hao cho tất cả TSCĐ",
              "BCTC phải được lập theo cùng định dạng mỗi năm",
            ],
            correctAnswer: "Các chính sách kế toán phải được áp dụng nhất quán trong các kỳ kế toán, chỉ thay đổi khi có quy định mới hoặc sự thay đổi đáng kể về bản chất nghiệp vụ",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "DN M trích lập dự phòng giảm giá hàng tồn kho 15 triệu. Định khoản ĐÚNG theo VAS 02 là:",
            options: [
              "Nợ TK 632: 15tr / Có TK 2293: 15tr",
              "Nợ TK 627: 15tr / Có TK 2293: 15tr",
              "Nợ TK 632: 15tr / Có TK 156: 15tr",
              "Nợ TK 641: 15tr / Có TK 2293: 15tr",
            ],
            correctAnswer: "Nợ TK 632: 15tr / Có TK 2293: 15tr",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "Cho BCDKT của DN N (triệu đồng): Tiền 100, phải thu KH 200, HTK 150, TSCĐ 800 (KH lũy kế 300), phải trả người bán 180, vay ngắn hạn 120, vay dài hạn 200, vốn góp 400, LNST 50. Tỷ suất nợ trên vốn chủ sở hữu (D/E) là:",
            options: ["0.75", "0.67", "1.0", "0.82"],
            correctAnswer: "0.82",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "DN P bán một TSCĐ hữu hình: nguyên giá 500tr, khấu hao lũy kế 350tr, giá bán 180tr (chưa VAT). Lãi/gỗ từ việc thanh lý TSCĐ này là:",
            options: [
              "Lãi 30tr — ghi nhận vào TK 711 (Thu nhập khác)",
              "Lỗ 30tr — ghi nhận vào TK 811 (Chi phí khác)",
              "Lãi 180tr — ghi nhận vào TK 711",
              "Không lãi không lỗ — ghi nhận vào TK 421",
            ],
            correctAnswer: "Lãi 30tr — ghi nhận vào TK 711 (Thu nhập khác)",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "Doanh nghiệp Q có lợi nhuận gộp 300tr, chi phí bán hàng 80tr, chi phí quản lý DN 50tr, doanh thu hoạt động tài chính 15tr, chi phí tài chính 25tr. Biên lợi nhuận hoạt động (operating margin) trên doanh thu thuần 1.000tr là:",
            options: ["17%", "15%", "24%", "21.5%"],
            correctAnswer: "17%",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "Doanh nghiệp R có BCDKT ngày 31/12/2024 (triệu đồng):\n\n**TÀI SẢN:** Tiền mặt 80, TGNH 220, phải thu KH 150 (dự phòng 20), hàng tồn kho 180, TSCĐ HH nguyên giá 900 (KH lũy kế 300), TSCĐ vô hình 100 (KH lũy kế 40)\n**NGUỒN VỐN:** Phải trả người bán 160, vay ngắn hạn 140, vay dài hạn 250, vốn góp 500, lợi nhuận KPT 120, các quỹ 80\n\nTrong năm 2025 phát sinh:\n1. Mua TSCĐ HH mới 200tr trả bằng TGNH.\n2. Khấu hao năm 2025: TSCĐ HH 90tr, TSCĐ vô hình 15tr.\n3. Bán một TSCĐ HH: nguyên giá 150tr, KH lũy kế 100tr, giá bán 70tr (chưa VAT), thu bằng TGNH.\n4. Lợi nhuận sau thuế năm 2025: 85tr.\n\nYêu cầu: Lập BCDKT ngày 31/12/2025.",
            correctAnswer: "**Bảng cân đối kế toán 31/12/2025 (triệu đồng)**\n\n**TÀI SẢN:**\n- Tiền mặt: 80\n- TGNH: 220 - 200 + 70 = 90\n- Phải thu KH (net): 150 - 20 = 130\n- Hàng tồn kho: 180\n- TSCĐ HH: nguyên giá (900 + 200 - 150) = 950; KH lũy kế (300 + 90 - 100) = 290; GT còn lại = 660\n- TSCĐ vô hình: nguyên giá 100; KH lũy kế (40 + 15) = 55; GT còn lại = 45\n- **Tổng tài sản: 80 + 90 + 130 + 180 + 660 + 45 = 1.185**\n\n**NGUỒN VỐN:**\n- Phải trả người bán: 160\n- Vay ngắn hạn: 140\n- Vay dài hạn: 250\n- Vốn góp: 500\n- Lợi nhuận KPT: 120 + 85 + lãi thanh lý (70 - 50 = 20) = 225\n- Các quỹ: 80\n- **Tổng nguồn vốn: 160 + 140 + 250 + 500 + 225 + 80 = 1.355**\n\n*Lưu ý: Cần kiểm tra lại số liệu để cân bằng. Có thể cần điều chỉnh dự phòng hoặc các khoản khác.*",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "Doanh nghiệp S cung cấp Báo cáo kết quả hoạt động kinh doanh năm 2025 (triệu đồng):\n- Doanh thu bán hàng và cung cấp dịch vụ: 1.200\n- Các khoản giảm trừ doanh thu: 50\n- Giá vốn hàng bán: 680\n- Chi phí bán hàng: 90\n- Chi phí quản lý doanh nghiệp: 60\n- Doanh thu hoạt động tài chính: 25\n- Chi phí tài chính: 40 (trong đó chi phí lãi vay 35)\n- Thu nhập khác: 15\n- Chi phí khác: 20\n- Thuế TNDN 20%\n\nYêu cầu:\n1. Lập Báo cáo kết quả hoạt động kinh doanh theo mẫu VAS.\n2. Tính EBIT (Lợi nhuận trước thuế và lãi vay).\n3. Tính tỷ suất lợi nhuận gộp (gross profit margin).",
            correctAnswer: "**1. Báo cáo KQKD (triệu đồng):**\n- Doanh thu thuần = 1.200 - 50 = 1.150\n- Lợi nhuận gộp = 1.150 - 680 = 470\n- Lợi nhuận từ HĐKD = 470 - 90 - 60 = 320\n- Lợi nhuận từ HĐTC = 25 - 40 = -15\n- Lợi nhuận từ HĐ khác = 15 - 20 = -5\n- Lợi nhuận trước thuế = 320 - 15 - 5 = 300\n- Thuế TNDN (20%) = 60\n- **Lợi nhuận sau thuế = 240**\n\n**2. EBIT = Lợi nhuận trước thuế + Chi phí lãi vay = 300 + 35 = 335 triệu**\n\n**3. Tỷ suất LN gộp = 470 / 1.150 × 100% = 40.87%**",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "Phân tích sự khác biệt giữa nguyên tắc 'thận trọng' và nguyên tắc 'trung thực' trong kế toán. Cho ví dụ về tình huống mà việc áp dụng nguyên tắc thận trọng có thể dẫn đến thông tin không phản ánh trung thực giá trị tài sản.",
            correctAnswer: "**Nguyên tắc thận trọng (Prudence/Conservatism):**\n- Không ghi nhận lãi khi chưa thực hiện\n- Phải ghi nhận ngay các khoản lỗ hoặc rủi ro có thể xảy ra\n- Trích lập dự phòng giảm giá, nợ khó đòi\n\n**Nguyên tắc trung thực (Faithful Representation):**\n- Thông tin phải phản ánh đúng bản chất kinh tế của nghiệp vụ\n- Không thiên vị, không nhấn mạnh hay giấu giếm\n\n**Xung đột:**\n- Trích lập dự phòng giảm giá HTK quá mức → giá trị HTK trên BCTC thấp hơn giá trị thực tế → không trung thực\n- Ghi nhận lỗ dự kiến nhưng không ghi nhận lãi dự kiến → BCTC thiên lệch về phía bi quan\n- Ví dụ: HTK có giá trị thuần có thể thực hiện được 120tr nhưng trích lập dự phòng 40tr (thay vì 20tr thực tế cần thiết) → GT ghi trên BCTC = 80tr, thấp hơn thực tế 100tr",
            orderIndex: 14,
          },
        ],
      },
      {
        title: "Kế toán Quản trị – ĐH Mở TP.HCM (Nâng cao)",
        source: "Đại học Mở TP.HCM",
        tags: ["ke_toan_quan_tri", "tinh_gia", "fifo", "hoa_von", "bien_dong_gop"],
        questions: [
          {
            type: "mcq",
            content: "DN sản xuất sản phẩm X có số liệu:\n- Giá bán: 150.000đ/sp\n- Chi phí NVL trực tiếp: 50.000đ/sp\n- Chi phí NC trực tiếp: 30.000đ/sp\n- Chi phí SX chung biến đổi: 20.000đ/sp\n- Chi phí SX chung cố định: 60.000.000đ/kỳ\n- Chi phí bán hàng biến đổi: 10.000đ/sp\n- Chi phí quản lý cố định: 30.000.000đ/kỳ\nĐiểm hòa vốn (số lượng) là:",
            options: ["1.500 sản phẩm", "1.200 sản phẩm", "2.000 sản phẩm", "1.000 sản phẩm"],
            correctAnswer: "1.500 sản phẩm",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "Doanh nghiệp nhập kho NVL theo 4 lần:\n- Lần 1: 200kg × 15.000đ/kg\n- Lần 2: 300kg × 16.000đ/kg\n- Lần 3: 150kg × 14.500đ/kg\n- Lần 4: 250kg × 17.000đ/kg\n\nXuất kho 600kg theo phương pháp bình quân gia quyền cuối kỳ. Giá trị xuất kho là:",
            options: ["9.600.000đ", "9.525.000đ", "9.450.000đ", "9.700.000đ"],
            correctAnswer: "9.600.000đ",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "DN có chi phí hỗn hợp (mixed cost) 80 triệu/kỳ, trong đó chi phí cố định 30 triệu. Sản lượng kỳ này 10.000 sp. Nếu sản lượng tăng 20%, tổng chi phí hỗn hợp mới là:",
            options: ["96 triệu", "90 triệu", "86 triệu", "92 triệu"],
            correctAnswer: "90 triệu",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "Phân tích CVP: DN có giá bán 200.000đ/sp, chi phí biến đổi 120.000đ/sp, chi phí cố định 80.000.000đ/kỳ. Nếu DN muốn đạt lợi nhuận sau thuế 60.000.000đ (thuế TNDN 20%), sản lượng cần bán là:",
            options: ["2.000 sp", "1.750 sp", "2.250 sp", "1.500 sp"],
            correctAnswer: "2.000 sp",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "DN sản xuất 2 sản phẩm A và B trên cùng một dây chuyền. Chi phí chung sản xuất 200 triệu/kỳ. Tiêu thức phân bổ: giờ máy. A dùng 1.500 giờ, B dùng 2.500 giờ. Nếu sản xuất A 5.000 sp và B 8.000 sp, chi phí chung phân bổ cho 1 sp B là:",
            options: ["25.000đ", "20.000đ", "30.000đ", "18.750đ"],
            correctAnswer: "25.000đ",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Theo phương pháp tính giá theo công đoạn (process costing), chi phí sản xuất chung được phân bổ cho sản phẩm hoàn thành và sản phẩm dở dang cuối kỳ dựa trên:",
            options: [
              "Số lượng sản phẩm hoàn thành và mức độ hoàn thành tương đương của sản phẩm dở dang",
              "Chỉ tính cho sản phẩm hoàn thành, sản phẩm dở dang không tính chi phí",
              "Tỷ lệ giữa chi phí đầu kỳ và chi phí phát sinh trong kỳ",
              "Thời gian thực tế sản xuất mỗi sản phẩm",
            ],
            correctAnswer: "Số lượng sản phẩm hoàn thành và mức độ hoàn thành tương đương của sản phẩm dở dang",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "DN có dữ liệu ngân sách:\n- Sản lượng kế hoạch: 10.000 sp\n- Chi phí cố định: 50.000.000đ\n- Chi phí biến đổi: 40.000đ/sp\n\nThực tế:\n- Sản lượng: 9.000 sp\n- Chi phí cố định: 52.000.000đ\n- Chi phí biến đổi: 42.000đ/sp\n\nChênh lệch chi phí biến đổi (variable cost variance) là:",
            options: ["18.000.000đ bất lợi", "20.000.000đ bất lợi", "2.000.000đ bất lợi", "18.000.000đ có lợi"],
            correctAnswer: "18.000.000đ bất lợi",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "Một doanh nghiệp có biên đóng góp đơn vị 40.000đ/sp, tỷ lệ đóng góp 25%. Giá bán đơn vị là:",
            options: ["160.000đ", "200.000đ", "100.000đ", "120.000đ"],
            correctAnswer: "160.000đ",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Phân tích 'make or buy': DN đang tự sản xuất linh kiện với chi phí biến đổi 30.000đ/sp, chi phí cố định có thể tránh 15.000.000đ/năm nếu ngừng sản xuất. Nhà cung cấp báo giá 35.000đ/sp. Nhu cầu năm 10.000 sp. Quyết định ĐÚNG là:",
            options: [
              "Mua ngoài vì 35.000 < 30.000 + 15.000 = 31.500 (phân bổ cố định)",
              "Tự sản xuất vì chi phí tự làm = 30.000×10.000 + 15.000.000 = 315tr, mua ngoài = 35.000×10.000 = 350tr",
              "Mua ngoài vì tiết kiệm được 15.000.000đ cố định",
              "Tự sản xuất vì chi phí biến đổi 30.000 < 35.000",
            ],
            correctAnswer: "Tự sản xuất vì chi phí tự làm = 30.000×10.000 + 15.000.000 = 315tr, mua ngoài = 35.000×10.000 = 350tr",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "Chi phí cơ hội (opportunity cost) trong ra quyết định quản trị là:",
            options: [
              "Chi phí đã phát sinh trong quá khứ, không thể thu hồi",
              "Lợi ích bị bỏ lỡ khi chọn phương án này thay vì phương án khác tốt nhất",
              "Chi phí chênh lệch giữa hai phương án",
              "Chi phí cố định có thể tránh được",
            ],
            correctAnswer: "Lợi ích bị bỏ lỡ khi chọn phương án này thay vì phương án khác tốt nhất",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "DN áp dụng phương pháp định phí (variable costing) cho BCTC nội bộ. Khác biệt chính so với phương pháp toàn bộ (absorption costing) là:",
            options: [
              "Chi phí cố định sản xuất được ghi nhận là chi phí theo kỳ, không vốn hóa vào giá thành sản phẩm",
              "Chi phí biến đổi không được ghi nhận vào giá thành",
              "Chi phí bán hàng được vốn hóa vào hàng tồn kho",
              "Không có khác biệt giữa hai phương pháp",
            ],
            correctAnswer: "Chi phí cố định sản xuất được ghi nhận là chi phí theo kỳ, không vốn hóa vào giá thành sản phẩm",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "DN có dữ liệu bán hàng: Quý 1: 8.000 sp, Quý 2: 10.000 sp, Quý 3: 12.000 sp, Quý 4: 15.000 sp. Chi phí cố định 40tr/kỳ, chi phí biến đổi 50.000đ/sp, giá bán 100.000đ/sp. Quý nào có biên đóng góp lớn nhất?",
            options: ["Quý 4", "Quý 3", "Quý 2", "Quý 1"],
            correctAnswer: "Quý 4",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "Doanh nghiệp T sản xuất sản phẩm Z có dữ liệu năm 2025:\n- Giá bán: 200.000đ/sp\n- Chi phí NVL trực tiếp: 60.000đ/sp\n- Chi phí NC trực tiếp: 40.000đ/sp\n- Chi phí SX chung biến đổi: 30.000đ/sp\n- Chi phí SX chung cố định: 90.000.000đ/năm\n- Chi phí bán hàng biến đổi: 10.000đ/sp\n- Chi phí quản lý cố định: 40.000.000đ/năm\n- Thuế TNDN 20%\n\nYêu cầu:\n1. Tính điểm hòa vốn (số lượng và doanh thu).\n2. Tính lợi nhuận sau thuế khi bán 5.000 sp.\n3. Tính sản lượng cần bán để đạt LNST 120.000.000đ.",
            correctAnswer: "**1. Điểm hòa vốn:**\n- Biên đóng góp đơn vị = 200.000 - 60.000 - 40.000 - 30.000 - 10.000 = 60.000đ/sp\n- Chi phí cố định tổng = 90.000.000 + 40.000.000 = 130.000.000đ\n- Điểm hòa vốn (sl) = 130.000.000 / 60.000 = **2.167 sản phẩm** (làm tròn)\n- Điểm hòa vốn (doanh thu) = 2.167 × 200.000 = **433.400.000đ**\n\n**2. LNST khi bán 5.000 sp:**\n- Doanh thu = 5.000 × 200.000 = 1.000.000.000đ\n- Chi phí biến đổi = 5.000 × (60.000+40.000+30.000+10.000) = 5.000 × 140.000 = 700.000.000đ\n- Chi phí cố định = 130.000.000đ\n- LNTT = 1.000.000.000 - 700.000.000 - 130.000.000 = 170.000.000đ\n- Thuế TNDN = 34.000.000đ\n- **LNST = 136.000.000đ**\n\n**3. Sản lượng cho LNST 120.000.000đ:**\n- LNTT mục tiêu = 120.000.000 / (1 - 0.2) = 150.000.000đ\n- Sản lượng = (130.000.000 + 150.000.000) / 60.000 = **4.667 sản phẩm**",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "DN U sản xuất sản phẩm có dữ liệu định mức và thực tế:\n\n**Định mức:** 10.000 sp, NVL 2kg/sp × 20.000đ/kg, NC 1.5 giờ/sp × 30.000đ/giờ\n**Thực tế:** 9.500 sp, NVL 19.500kg × 21.000đ/kg, NC 14.000 giờ × 32.000đ/giờ\n\nYêu cầu: Tính chênh lệch giá và chênh lệch lượng cho NVL và NC. Cho biết chênh lệch có lợi hay bất lợi.",
            correctAnswer: "**Chênh lệch NVL:**\n- Định mức cho 9.500 sp: 19.000kg × 20.000đ = 380.000.000đ\n- Thực tế: 19.500kg × 21.000đ = 409.500.000đ\n- **Chênh lệch giá NVL** = (20.000 - 21.000) × 19.500 = **-19.500.000đ (bất lợi)**\n- **Chênh lệch lượng NVL** = (19.000 - 19.500) × 20.000 = **-10.000.000đ (bất lợi)**\n- Tổng chênh lệch NVL = -29.500.000đ\n\n**Chênh lệch NC:**\n- Định mức cho 9.500 sp: 14.250 giờ × 30.000đ = 427.500.000đ\n- Thực tế: 14.000 giờ × 32.000đ = 448.000.000đ\n- **Chênh lệch giá NC** = (30.000 - 32.000) × 14.000 = **-28.000.000đ (bất lợi)**\n- **Chênh lệch lượng NC** = (14.250 - 14.000) × 30.000 = **+7.500.000đ (có lợi)**\n- Tổng chênh lệch NC = -20.500.000đ",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "So sánh phương pháp tính giá toàn bộ (absorption costing) và phương pháp tính giá định phí (variable costing). Phân tích tác động của mỗi phương pháp đến lợi nhuận ghi nhận khi sản lượng sản xuất khác sản lượng bán ra.",
            correctAnswer: "**Absorption Costing (Toàn bộ):**\n- Giá thành sản phẩm = NVL trực tiếp + NC trực tiếp + SX chung biến đổi + SX chung cố định\n- Chi phí cố định SX được vốn hóa vào hàng tồn kho\n- Khi sản xuất > bán hàng: một phần chi phí cố định nằm trong HTK → LNST cao hơn\n- Khi bán hàng > sản xuất: giải phóng chi phí cố định từ HTK → LNST thấp hơn\n\n**Variable Costing (Định phí):**\n- Giá thành sản phẩm = NVL trực tiếp + NC trực tiếp + SX chung biến đổi\n- Chi phí cố định SX ghi nhận là chi phí theo kỳ\n- LNST không phụ thuộc vào sản lượng sản xuất, chỉ phụ thuộc vào sản lượng bán ra\n\n**Kết luận:**\n- Khi SX > Bán: LNST(absorption) > LNST(variable) vì chi phí cố định nằm trong HTK\n- Khi SX < Bán: LNST(absorption) < LNST(variable) vì giải phóng chi phí cố định từ HTK\n- Khi SX = Bán: LNST(absorption) = LNST(variable)",
            orderIndex: 14,
          },
        ],
      },
      {
        title: "Kế toán Chi phí – ĐH Kinh tế Huế (Nâng cao)",
        source: "Đại học Kinh tế Huế",
        tags: ["ke_toan_chi_phi", "chi_phi_sx", "tinh_gia_thanh", "phan_bo_chi_phi", "dinh_muc"],
        questions: [
          {
            type: "mcq",
            content: "DN có chi phí sản xuất trong tháng: NVL trực tiếp 150tr, NC trực tiếp 80tr, SX chung biến đổi 40tr, SX chung cố định 60tr. Sản lượng hoàn thành 10.000 sp, sản phẩm dở dang cuối kỳ 2.000 sp (hoàn thành 50% về chi phí chung). Chi phí sản xuất chung phân bổ cho sản phẩm dở dang là:",
            options: ["10 triệu", "12 triệu", "15 triệu", "8 triệu"],
            correctAnswer: "12 triệu",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "Chi phí sản xuất dở dang đầu kỳ 30tr, trong kỳ phát sinh chi phí: NVL 200tr, NC 100tr, SX chung 80tr. Chi phí sản xuất trong kỳ 380tr. Sản phẩm dở dang cuối kỳ 50tr. Giá thành sản phẩm hoàn thành trong kỳ là:",
            options: ["360 triệu", "380 triệu", "410 triệu", "330 triệu"],
            correctAnswer: "360 triệu",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Phương pháp tính giá theo đơn đặt hàng (job order costing) phù hợp với doanh nghiệp:",
            options: [
              "Sản xuất hàng loạt sản phẩm đồng nhất",
              "Sản xuất theo đơn đặt hàng riêng biệt, mỗi đơn có đặc điểm khác nhau",
              "Sản xuất liên tục theo công đoạn",
              "Cung cấp dịch vụ đại trà",
            ],
            correctAnswer: "Sản xuất theo đơn đặt hàng riêng biệt, mỗi đơn có đặc điểm khác nhau",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "DN sản xuất theo công đoạn có 3 công đoạn liên tiếp. Chi phí thêm vào công đoạn 2: NVL 50tr, NC 30tr, SX chung 20tr. Sản phẩm chuyển từ công đoạn 1 sang: 100tr. Hoàn thành công đoạn 2: 8.000 sp. Dở dang cuối công đoạn 2: 2.000 sp (hoàn thành 60%). Giá thành 1 sp hoàn thành công đoạn 2 là:",
            options: ["20.000đ", "22.500đ", "25.000đ", "18.750đ"],
            correctAnswer: "22.500đ",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "Định mức chi phí NVL: 3kg/sp × 15.000đ/kg. Thực tế sản xuất 5.000 sp, tiêu hao 15.500kg × 14.500đ/kg. Chênh lệch tổng chi phí NVL là:",
            options: [
              "2.250.000đ bất lợi",
              "7.750.000đ có lợi",
              "5.500.000đ bất lợi",
              "2.250.000đ có lợi",
            ],
            correctAnswer: "7.750.000đ có lợi",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Chi phí chung phân bổ theo định mức: 20.000đ/giờ máy. Thực tế chi phí chung phát sinh 85tr, giờ máy thực tế 4.000 giờ, giờ máy định mức cho sản lượng thực tế 3.800 giờ. Chênh lệch hiệu quả chi phí chung (efficiency variance) là:",
            options: [
              "4.000.000đ bất lợi",
              "5.000.000đ bất lợi",
              "4.000.000đ có lợi",
              "9.000.000đ bất lợi",
            ],
            correctAnswer: "4.000.000đ bất lợi",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "Phân loại chi phí theo cách ứng xử (cost behavior) gồm:",
            options: [
              "Chi phí cố định, chi phí biến đổi, chi phí hỗn hợp",
              "Chi phí trực tiếp, chi phí gián tiếp",
              "Chi phí sản xuất, chi phí bán hàng, chi phí quản lý",
              "Chi phí nguyên vật liệu, chi phí nhân công, chi phí khấu hao",
            ],
            correctAnswer: "Chi phí cố định, chi phí biến đổi, chi phí hỗn hợp",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "Chi phí có thể kiểm soát (controllable cost) là chi phí:",
            options: [
              "Chi phí mà quản lý cấp dưới có thẩm quyền ảnh hưởng trong khoảng thời gian nhất định",
              "Chi phí cố định không thay đổi",
              "Chi phí chỉ do tổng giám đốc quyết định",
              "Chi phí không thể thay đổi trong mọi trường hợp",
            ],
            correctAnswer: "Chi phí mà quản lý cấp dưới có thẩm quyền ảnh hưởng trong khoảng thời gian nhất định",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "DN có chi phí NVL trực tiếp 120tr, NC trực tiếp 60tr, SX chung 50tr (trong đó cố định 30tr). Phương pháp absorption costing, giá thành sản xuất 10.000 sp là 230tr. Theo variable costing, giá thành sản xuất 10.000 sp là:",
            options: ["200 triệu", "230 triệu", "180 triệu", "210 triệu"],
            correctAnswer: "200 triệu",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "Bản phân tích chi phí theo yếu tố cho thấy: Chi phí NVL 180tr, chi phí NC 90tr, chi phí khấu hao 40tr, chi phí dịch vụ mua ngoài 25tr, chi phí khác bằng tiền 15tr. Tổng chi phí theo yếu tố là:",
            options: ["350 triệu", "330 triệu", "335 triệu", "345 triệu"],
            correctAnswer: "350 triệu",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "Chi phí chuẩn (standard cost) khác chi phí định mức (budgeted cost) ở điểm:",
            options: [
              "Chi phí chuẩn tính trên đơn vị sản phẩm, chi phí định mức tính trên tổng thể kỳ kế hoạch",
              "Chi phí chuẩn luôn cao hơn chi phí định mức",
              "Không có khác biệt",
              "Chi phí chuẩn chỉ áp dụng cho NVL, chi phí định mức cho tất cả yếu tố",
            ],
            correctAnswer: "Chi phí chuẩn tính trên đơn vị sản phẩm, chi phí định mức tính trên tổng thể kỳ kế hoạch",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "DN có sản phẩm dở dang đầu kỳ 500 sp (hoàn thành 60% về chi phí chung), sản lượng hoàn thành trong kỳ 8.000 sp, sản phẩm dở dang cuối kỳ 700 sp (hoàn thành 40% về chi phí chung). Sản lượng tương đương về chi phí chung theo phương pháp FIFO là:",
            options: ["7.980 sp", "8.200 sp", "7.680 sp", "8.080 sp"],
            correctAnswer: "7.980 sp",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "DN V sản xuất sản phẩm theo 2 công đoạn:\n\n**Công đoạn 1:** NVL đưa vào đầu công đoạn 200tr, NC 80tr, SX chung 60tr. Hoàn thành 10.000 sp chuyển sang công đoạn 2. Dở dang cuối CD1: 1.000 sp (hoàn thành 50% về NC và SX chung, NVL đưa vào 100%).\n\n**Công đoạn 2:** Nhận 10.000 sp từ CD1, thêm NVL 100tr, NC 50tr, SX chung 40tr. Hoàn thành 9.000 sp. Dở dang cuối CD2: 2.000 sp (hoàn thành 50% về NC và SX chung, NVL thêm vào 100%).\n\nYêu cầu: Tính giá thành 1 sản phẩm hoàn thành ở mỗi công đoạn.",
            correctAnswer: "**Công đoạn 1:**\n- Tổng chi phí CD1 = 200 + 80 + 60 = 340tr\n- SL tương đương NVL = 10.000 + 1.000 = 11.000 sp\n- SL tương đương NC+SXC = 10.000 + 1.000×50% = 10.500 sp\n- Giá thành 1 sp NVL = 200tr / 11.000 = 18.182đ\n- Giá thành 1 sp NC+SXC = (80+60)tr / 10.500 = 13.333đ\n- **Giá thành 1 sp hoàn thành CD1 = 18.182 + 13.333 = 31.515đ**\n- Giá trị sp chuyển sang CD2 = 10.000 × 31.515 = 315.150.000đ\n\n**Công đoạn 2:**\n- Tổng chi phí CD2 = 315.15 + 100 + 50 + 40 = 505.15tr\n- SL tương đương NVL thêm = 9.000 + 2.000 = 11.000 sp\n- SL tương đương NC+SXC = 9.000 + 2.000×50% = 10.000 sp\n- Giá thành 1 sp NVL thêm = 100tr / 11.000 = 9.091đ\n- Giá thành 1 sp NC+SXC = (50+40)tr / 10.000 = 9.000đ\n- Giá vốn từ CD1 = 315.15tr / 11.000 = 28.650đ/sp\n- **Giá thành 1 sp hoàn thành CD2 = 28.650 + 9.091 + 9.000 = 46.741đ**",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "DN W có số liệu định mức và thực tế về chi phí nhân công trực tiếp:\n\n**Định mức:** 2 giờ/sp × 25.000đ/giờ, sản lượng kế hoạch 12.000 sp\n**Thực tế:** 23.000 giờ × 27.000đ/giờ, sản lượng 11.500 sp\n\nYêu cầu: Tính chênh lệch giá nhân công, chênh lệch lượng nhân công, và chênh lệch tổng chi phí nhân công. Cho biết mỗi chênh lệch là có lợi hay bất lợi.",
            correctAnswer: "**Định mức cho 11.500 sp:**\n- Giờ định mức = 11.500 × 2 = 23.000 giờ\n- Chi phí định mức = 23.000 × 25.000 = 575.000.000đ\n\n**Thực tế:**\n- Chi phí thực tế = 23.000 × 27.000 = 621.000.000đ\n\n**Chênh lệch giá NC (Rate Variance):**\n= (Đơn giá định mức - Đơn giá thực tế) × Giờ thực tế\n= (25.000 - 27.000) × 23.000\n= **-46.000.000đ (bất lợi)**\n\n**Chênh lệch lượng NC (Efficiency Variance):**\n= (Giờ định mức - Giờ thực tế) × Đơn giá định mức\n= (23.000 - 23.000) × 25.000\n= **0đ (không có chênh lệch)**\n\n**Tổng chênh lệch chi phí NC**\n= 575.000.000 - 621.000.000\n= **-46.000.000đ (bất lợi)**\n\nNguyên nhân: Do đơn giá nhân công tăng từ 25.000đ lên 27.000đ/giờ, trong khi số giờ thực tế đúng định mức.",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "Trình bày phương pháp phân bổ chi phí chung sản xuất theo 3 tiêu thức: giờ máy, giờ nhân công trực tiếp, và đơn vị sản phẩm. Phân tích ưu nhược điểm của từng tiêu thức và tình huống áp dụng phù hợp.",
            correctAnswer: "**1. Phân bổ theo giờ máy (Machine hours):**\n- Phù hợp khi chi phí chung chủ yếu liên quan đến máy móc (khấu hao, điện, bảo trì)\n- Ưu: Phản ánh chính xác mức độ sử dụng tài sản cố định\n- Nhược: Không phù hợp khi sản xuất thâm dụng lao động\n\n**2. Phân bổ theo giờ nhân công trực tiếp (Direct labor hours):**\n- Phù hợp khi sản xuất thâm dụng lao động, chi phí chung liên quan đến quản lý lao động\n- Ưu: Đơn giản, dễ thu thập dữ liệu\n- Nhược: Không phản ánh đúng khi tự động hóa cao\n\n**3. Phân bổ theo đơn vị sản phẩm (Units produced):**\n- Phù hợp khi tất cả sản phẩm đồng nhất, tiêu hao chi phí chung như nhau\n- Ưu: Đơn giản nhất, dễ tính toán\n- Nhược: Không phù hợp khi sản phẩm có độ phức tạp khác nhau\n\n**Kết luận:** Việc chọn tiêu thức phân bổ ảnh hưởng trực tiếp đến tính chính xác của giá thành sản phẩm. Tiêu thức phải có mối quan hệ nhân quả với chi phí chung cần phân bổ.",
            orderIndex: 14,
          },
        ],
      },
      {
        title: "Báo cáo Tài chính – NEU (Nâng cao)",
        source: "Đại học Kinh tế Quốc dân",
        tags: ["bao_cao_tai_chinh", "vas", "thuyet_minh_bctc", "phan_tich_bctc", "du_phong"],
        questions: [
          {
            type: "mcq",
            content: "Theo VAS 21, khi trình bày BCTC, doanh nghiệp phải lập các báo cáo nào sau đây?",
            options: [
              "Bảng cân đối kế toán, Báo cáo KQKD, Báo cáo LCTT, Thuyết minh BCTC",
              "Chỉ Bảng cân đối kế toán và Báo cáo KQKD",
              "Báo cáo quản trị, Báo cáo tài chính nội bộ",
              "Báo cáo thuế, Báo cáo kiểm toán",
            ],
            correctAnswer: "Bảng cân đối kế toán, Báo cáo KQKD, Báo cáo LCTT, Thuyết minh BCTC",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "Trích lập dự phòng phải thu khó đòi theo VAS 18: DN có phải thu khách hàng 300tr, trong đó quá hạn 60 ngày 50tr, quá hạn 120 ngày 30tr, quá hạn trên 1 năm 20tr. Tỷ lệ trích lập: 30 ngày-6 tháng: 30%; 6 tháng-1 năm: 50%; trên 1 năm: 100%. Mức trích lập dự phòng tối đa là:",
            options: ["39 triệu", "50 triệu", "35 triệu", "44 triệu"],
            correctAnswer: "39 triệu",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Sự kiện phát sinh sau ngày khóa sổ (subsequent events) theo VAS 23: DN phát hiện sau ngày BCTC rằng một khách hàng nợ 50tr đã phá sản. Xử lý ĐÚNG là:",
            options: [
              "Điều chỉnh giảm phải thu và trích lập dự phòng trong BCTC kỳ báo cáo",
              "Chỉ thuyết minh trong phần sự kiện sau ngày khóa sổ, không điều chỉnh BCTC",
              "Ghi nhận vào chi phí kỳ sau",
              "Không cần xử lý gì",
            ],
            correctAnswer: "Điều chỉnh giảm phải thu và trích lập dự phòng trong BCTC kỳ báo cáo",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "DN có chỉ số thanh toán: Tỷ suất thanh toán hiện hành 1.5, tỷ suất thanh toán nhanh 0.9, hàng tồn kho 200tr. Tổng nợ ngắn hạn là 400tr. Tài sản ngắn hạn là:",
            options: ["600 triệu", "360 triệu", "560 triệu", "400 triệu"],
            correctAnswer: "600 triệu",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "Lợi thế thương mại (goodwill) được ghi nhận trên BCDKT khi:",
            options: [
              "Doanh nghiệp tự đánh giá giá trị thương hiệu của mình",
              "Doanh nghiệp mua lại doanh nghiệp khác với giá cao hơn giá trị hợp lý của tài sản thuần",
              "Doanh nghiệp đầu tư vào quảng cáo",
              "Doanh nghiệp đăng ký nhãn hiệu",
            ],
            correctAnswer: "Doanh nghiệp mua lại doanh nghiệp khác với giá cao hơn giá trị hợp lý của tài sản thuần",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Thuế TNDN hoãn lại (deferred tax) phát sinh khi:",
            options: [
              "Chênh lệch giữa lợi nhuận kế toán và lợi nhuận chịu thuế do khác biệt thời gian ghi nhận doanh thu/chi phí",
              "Doanh nghiệp nộp thuế chậm",
              "Doanh nghiệp được miễn thuế",
              "Thuế GTGT đầu vào lớn hơn đầu ra",
            ],
            correctAnswer: "Chênh lệch giữa lợi nhuận kế toán và lợi nhuận chịu thuế do khác biệt thời gian ghi nhận doanh thu/chi phí",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "DN X có doanh thu thuần 2.000tr, lợi nhuận gộp 600tr, LNST 120tr. Biên lợi nhuận gộp (gross margin) và biên lợi nhuận ròng (net margin) lần lượt là:",
            options: ["30% và 6%", "20% và 6%", "30% và 12%", "25% và 10%"],
            correctAnswer: "30% và 6%",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "Phân tích Dupont (DuPont analysis) phân tách ROE thành:",
            options: [
              "Biên lợi nhuận ròng × Vòng quay tài sản × Đòn bẩy tài chính",
              "Lợi nhuận gộp × Doanh thu × Tổng tài sản",
              "ROA × Tỷ lệ nợ",
              "Lợi nhuận / Vốn góp",
            ],
            correctAnswer: "Biên lợi nhuận ròng × Vòng quay tài sản × Đòn bẩy tài chính",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Theo VAS 02, giá trị hàng tồn kho được ghi nhận theo:",
            options: [
              "Giá gốc (thấp hơn giữa giá gốc và giá trị thuần có thể thực hiện được)",
              "Giá trị thị trường",
              "Giá bán",
              "Giá gốc cộng chi phí lưu kho",
            ],
            correctAnswer: "Giá gốc (thấp hơn giữa giá gốc và giá trị thuần có thể thực hiện được)",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "DN Y có P/E ratio = 15, EPS = 20.000đ. Giá cổ phiếu trên thị trường là:",
            options: ["300.000đ", "150.000đ", "200.000đ", "75.000đ"],
            correctAnswer: "300.000đ",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "Báo cáo LCTT theo phương pháp trực tiếp: Dòng tiền thu từ khách hàng được tính bằng:",
            options: [
              "Doanh thu thuần + Giảm phải thu khách hàng - Tăng phải thu khách hàng",
              "Doanh thu thuần + Tăng phải thu khách hàng",
              "Lợi nhuận trước thuế + Khấu hao",
              "Doanh thu - Chi phí",
            ],
            correctAnswer: "Doanh thu thuần + Giảm phải thu khách hàng - Tăng phải thu khách hàng",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "Tài sản vô hình (intangible assets) theo VAS 03 bao gồm:",
            options: [
              "Quyền sử dụng đất, phần mềm máy tính, bản quyền, bằng sáng chế, nhãn hiệu thương mại",
              "Máy móc thiết bị, nhà xưởng, phương tiện vận tải",
              "Hàng tồn kho, tiền, phải thu",
              "Đầu tư chứng khoán ngắn hạn",
            ],
            correctAnswer: "Quyền sử dụng đất, phần mềm máy tính, bản quyền, bằng sáng chế, nhãn hiệu thương mại",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "DN Z có BCTC năm 2025 (triệu đồng):\n\n**BCDKT:** Tiền 150, phải thu KH 250, HTK 200, TSCĐ 1.200 (KH lũy kế 400), tài sản khác 100. Phải trả người bán 300, vay ngắn hạn 200, vay dài hạn 400, vốn góp 700, LNST 100, quỹ 200.\n\n**BCKQKD:** Doanh thu thuần 1.500, giá vốn 900, chi phí bán 100, chi phí quản lý 80, chi phí tài chính 60 (lãi vay 50), thuế TNDN 20%.\n\nYêu cầu: Tính 5 chỉ số tài chính: (1) Tỷ suất thanh toán hiện hành, (2) Vòng quay HTK, (3) Biên LN gộp, (4) ROE, (5) Đòn bẩy tài chính (D/E).",
            correctAnswer: "**1. Tỷ suất thanh toán hiện hành**\n= TSNH / Nợ ngắn hạn = (150+250+200) / (300+200) = 600 / 500 = **1.2**\n\n**2. Vòng quay HTK**\n= Giá vốn / HTK bình quân = 900 / 200 = **4.5 vòng**\n\n**3. Biên LN gộp**\n= LN gộp / Doanh thu thuần = (1.500-900) / 1.500 = 600/1.500 = **40%**\n\n**4. ROE**\n= LNST / VCSH = 100 / (700+200) = 100/900 = **11.1%**\n\n**5. D/E (Đòn bẩy tài chính)**\n= Tổng nợ / VCSH = (300+200+400) / 900 = 900/900 = **1.0**",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "Trình bày nội dung cơ bản của VAS 26 về Thông tin tài chính liên quan đến các khoản vay và thấu chi. DN cần thuyết minh những thông tin gì về các khoản vay trên BCTC?",
            correctAnswer: "**VAS 26 — Thông tin tài chính liên quan đến khoản vay và thấu chi:**\n\nDN phải thuyết minh:\n1. **Giá trị khoản vay** tại ngày BCTC, phân loại theo ngắn hạn và dài hạn\n2. **Lãi suất** áp dụng cho từng khoản vay (cố định/thả nổi)\n3. **Thời hạn vay** và lịch trình trả nợ\n4. **Tài sản đảm bảo** cho khoản vay (nếu có)\n5. **Các điều kiện đặc biệt** liên quan đến khoản vay (ràng buộc về tỷ lệ tài chính, hạn chế chia cổ tức)\n6. **Chi phí lãi vay** ghi nhận trong kỳ, phân loại theo hoạt động\n7. **Khoản vay từ cổ đông, công ty mẹ, công ty liên kết** — thuyết minh riêng biệt\n8. **Nợ xấu** và các khoản vay quá hạn\n\nMục đích: Giúp người sử dụng BCTC đánh giá rủi ro tài chính và khả năng thanh toán của DN.",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "Phân tích tác động của lạm phát đến BCTC được lập theo nguyên tắc giá gốc (historical cost). Nêu các hạn chế và đề xuất cải thiện.",
            correctAnswer: "**Tác động của lạm phát đến BCTC theo giá gốc:**\n\n1. **Tài sản bị định giá thấp:** TSCĐ ghi theo giá gốc mua, nhưng giá thay thế hiện tại cao hơn nhiều do lạm phát → BCDKT không phản ánh đúng giá trị thực tế\n\n2. **Chi phí khấu hao không thực tế:** Khấu hao tính trên nguyên giá gốc, không đủ để tái đầu tư TSCĐ khi hết thời gian sử dụng\n\n3. **Lợi nhuận bị phóng đại:** Doanh thu ghi theo giá hiện tại (lạm phát), nhưng giá vốn và khấu hao ghi theo giá gốc → lợi nhuận cao hơn thực tế\n\n4. **So sánh kỳ không chính xác:** Các kỳ khác nhau có mức giá khác nhau, so sánh không phản ánh đúng xu hướng\n\n**Hạn chế:**\n- Nguyên tắc giá gốc đảm bảo tính xác thực, khách quan (có chứng từ)\n- Nhưng trong môi trường lạm phát cao, BCTC mất đi tính hữu ích\n\n**Đề xuất cải thiện:**\n- Lập BCTC điều chỉnh lạm phát (inflation-adjusted financial statements) theo phương pháp giá hiện tại (Current Cost Accounting)\n- Thuyết minh thêm thông tin về tác động lạm phát\n- Sử dụng phương pháp đánh giá lại TSCĐ định kỳ theo quy định",
            orderIndex: 14,
          },
        ],
      },
    ],
  },
  // ── Tài chính – Ngân hàng (Banking) — 5 đề ───────────────────────
  {
    slug: "tai_chinh_ngan_hang",
    name: "Tài chính – Ngân hàng",
    deThi: [
      {
        title: "Tài chính – Tiền tệ – HVNH (Nâng cao)",
        source: "Học viện Ngân hàng",
        tags: ["tai_chinh_tien_te", "lai_suat", "chinh_sach_tien_te", "gia_tri_hien_tai", "lam_phat"],
        questions: [
          {
            type: "mcq",
            content: "Một người gửi 200.000.000đ vào ngân hàng, lãi suất 7.5%/năm, tính lãi kép theo năm. Sau 5 năm, số tiền nhận được là:",
            options: ["287.013.000đ", "275.000.000đ", "290.145.000đ", "281.356.000đ"],
            correctAnswer: "287.013.000đ",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "DN vay 1.000.000.000đ, lãi suất 12%/năm, thời hạn 4 năm, trả đều theo năm. Cho biết hệ số hoàn vốn (CRF) tại 12%, n=4 là 0.3292. Khoản trả mỗi năm là:",
            options: ["329.200.000đ", "300.000.000đ", "350.000.000đ", "312.000.000đ"],
            correctAnswer: "329.200.000đ",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Lãi suất danh nghĩa 12%/năm, ghép lãi theo tháng. Lãi suất thực hiệu quả (EAR) là:",
            options: ["12.68%", "12%", "12.55%", "12.75%"],
            correctAnswer: "12.68%",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "Ngân hàng trung ương tăng tỷ lệ dự trữ bắt buộc từ 8% lên 10%. Hệ số nhân tiền giảm từ bao nhiêu xuống bao nhiêu (giả sử tỷ lệ giữ tiền mặt của công chúng c = 20%, không giữ dự trữ thừa)?",
            options: ["Từ 3.57 xuống 3.0", "Từ 4.0 xuống 3.5", "Từ 3.33 xuống 3.0", "Từ 3.85 xuống 3.25"],
            correctAnswer: "Từ 3.57 xuống 3.0",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "Một trái phiếu mệnh giá 1.000.000đ, lãi suất coupon 8%/năm, trả lãi năm, thời hạn 5 năm. Lãi suất thị trường (YTM) hiện là 10%. Giá trái phiếu hiện tại là:",
            options: ["924.180đ", "1.000.000đ", "1.075.820đ", "950.000đ"],
            correctAnswer: "924.180đ",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Công thức Fisher chính xác: 1 + i = (1 + r)(1 + π). Nếu lãi suất thực r = 4%, lạm phát π = 6%, lãi suất danh nghĩa i là:",
            options: ["10.24%", "10%", "10.5%", "9.8%"],
            correctAnswer: "10.24%",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "Chính sách tiền tệ mở rộng KHÔNG bao gồm nghiệp vụ nào sau đây?",
            options: [
              "Giảm tỷ lệ dự trữ bắt buộc",
              "Mua trái phiếu chính phủ trên thị trường mở",
              "Giảm lãi suất tái chiết khấu",
              "Bán ngoại tệ trên thị trường ngoại hối",
            ],
            correctAnswer: "Bán ngoại tệ trên thị trường ngoại hối",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "DN đầu tư dự án: chi phí đầu tư 500tr, dòng tiền ròng năm 1-3: 180tr/năm, năm 4-5: 200tr/năm. Chi phí vốn 10%. NPV của dự án là (cho biết: PVIFA 10%,3=2.487; PVIF 10%,4=0.683; PVIF 10%,5=0.621):",
            options: ["175.8 triệu", "150.2 triệu", "200 triệu", "130.5 triệu"],
            correctAnswer: "175.8 triệu",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Theo lý thuyết cấu trúc vốn Modigliani-Miller (không có thuế), khi DN tăng tỷ lệ nợ:",
            options: [
              "Chi phí vốn bình quân (WACC) giảm",
              "Chi phí vốn bình quân (WACC) không đổi",
              "Chi phí vốn chủ sở hữu không đổi",
              "Giá trị doanh nghiệp tăng",
            ],
            correctAnswer: "Chi phí vốn bình quân (WACC) không đổi",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "WACC: DN có cấu trúc vốn: nợ 40% (chi phí nợ sau thuế 6%), VCSH 60% (chi phí VCSH 14%). WACC là:",
            options: ["10.8%", "11.2%", "10%", "12%"],
            correctAnswer: "10.8%",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "Beta của cổ phiếu X là 1.3, lãi suất phi rủi ro 6%, lợi suất thị trường 12%. Theo CAPM, lợi suất kỳ vọng của cổ phiếu X là:",
            options: ["13.8%", "12%", "10.8%", "15.6%"],
            correctAnswer: "13.8%",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "Một khoản đầu tư 100tr, dòng tiền năm 1: 40tr, năm 2: 50tr, năm 3: 60tr. Thời gian hoàn vốn (payback period) là:",
            options: ["2.17 năm", "2.5 năm", "2 năm", "3 năm"],
            correctAnswer: "2.17 năm",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "Một doanh nghiệp đang xem xét 2 dự án đầu tư A và B (đvt: triệu đồng):\n\n**Dự án A:** Đầu tư 500, dòng tiền ròng: N1=200, N2=200, N3=200, N4=100\n**Dự án B:** Đầu tư 600, dòng tiền ròng: N1=150, N2=200, N3=250, N4=300\n\nChi phí vốn 10%. Cho biết: PVIF 10%,1=0.909; PVIF 10%,2=0.826; PVIF 10%,3=0.751; PVIF 10%,4=0.683\n\nYêu cầu:\n1. Tính NPV của từng dự án.\n2. Tính PI (Profitability Index) của từng dự án.\n3. Chọn dự án nào nếu chỉ được chọn 1?",
            correctAnswer: "**1. NPV:**\n\n**Dự án A:**\nPV dòng tiền = 200×0.909 + 200×0.826 + 200×0.751 + 100×0.683\n= 181.8 + 165.2 + 150.2 + 68.3 = 565.5tr\nNPV(A) = 565.5 - 500 = **65.5 triệu**\n\n**Dự án B:**\nPV dòng tiền = 150×0.909 + 200×0.826 + 250×0.751 + 300×0.683\n= 136.35 + 165.2 + 187.75 + 204.9 = 694.2tr\nNPV(B) = 694.2 - 600 = **94.2 triệu**\n\n**2. PI (Profitability Index):**\nPI(A) = 565.5 / 500 = **1.131**\nPI(B) = 694.2 / 600 = **1.157**\n\n**3. Chọn dự án B** vì NPV(B) > NPV(A) và PI(B) > PI(A) > 1. Cả hai dự án đều khả thi, nhưng B tạo ra giá trị gia tăng cao hơn.",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "Phân tích tác động của chính sách tiền tệ thắt chặt của Ngân hàng Nhà nước đến:\n1. Cung tiền và lãi suất thị trường\n2. Hoạt động tín dụng của ngân hàng thương mại\n3. Hoạt động sản xuất kinh doanh của doanh nghiệp\n4. Lạm phát và tăng trưởng kinh tế",
            correctAnswer: "**Tác động của chính sách tiền tệ thắt chặt:**\n\n**1. Cung tiền và lãi suất:**\n- Tăng dự trữ bắt buộc, bán trái phiếu trên TTM, tăng lãi suất tái chiết khấu → cung tiền giảm\n- Lãi suất thị trường tăng do nguồn cung vốn khan hiếm\n\n**2. Hoạt động tín dụng NHTM:**\n- Ngân hàng phải giữ dự trữ cao hơn, vốn cho vay giảm\n- Lãi suất cho vay tăng, điều kiện thẩm định khắt khe hơn\n- Nhu cầu vay giảm do lãi suất cao\n\n**3. Hoạt động SXKD doanh nghiệp:**\n- Chi phí vốn tăng → giảm đầu tư mở rộng\n- Dự án mới bị hoãn do NPV giảm (chi phí vốn cao)\n- DN gặp khó khăn thanh khoản, có thể phá sản\n\n**4. Lạm phát và tăng trưởng:**\n- Tổng cầu giảm → lạm phát giảm (mục tiêu chính sách)\n- Tuy nhiên, tăng trưởng kinh tế chậm lại, có thể suy thoái nếu thắt chặt quá mức\n- Thất nghiệp tăng do DN thu hẹp sản xuất",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "Một trái phiếu chính phủ mệnh giá 1.000.000đ, lãi suất coupon 9%/năm, trả lãi nửa năm một lần, thời hạn 4 năm. Lãi suất thị trường (YTM) 10%/năm.\n\nYêu cầu: Tính giá trái phiếu hiện tại.",
            correctAnswer: "Trái phiếu trả lãi nửa năm:\n- Coupon nửa năm = 1.000.000 × 9% / 2 = 45.000đ\n- Số kỳ = 4 × 2 = 8 kỳ\n- Lãi suất nửa năm = 10% / 2 = 5%\n\nGiá trái phiếu = Σ(Coupon / (1+r)^t) + (Mệnh giá / (1+r)^n)\n\nPV coupon = 45.000 × [1 - (1.05)^(-8)] / 0.05\n= 45.000 × 6.4632 = 290.844đ\n\nPV mệnh giá = 1.000.000 / (1.05)^8 = 1.000.000 × 0.6768 = 676.800đ\n\n**Giá trái phiếu = 290.844 + 676.800 = 967.644đ**\n\nTrái phiếu bán với chiết khấu vì YTM (10%) > coupon rate (9%).",
            orderIndex: 14,
          },
        ],
      },
      {
        title: "Ngân hàng Thương mại – ĐH Kinh tế Đà Nẵng (Nâng cao)",
        source: "Đại học Kinh tế Đà Nẵng",
        tags: ["ngan_hang_thuong_mai", "tin_dung", "cho_vay", "rui_ro_tin_dung", "no_xau"],
        questions: [
          {
            type: "mcq",
            content: "NHTM A có tổng tài sản 10.000 tỷ, cho vay 6.000 tỷ, huy động vốn 7.000 tỷ, dự trữ 1.500 tỷ. Tỷ lệ LDR (Loan to Deposit Ratio) là:",
            options: ["85.7%", "75%", "60%", "90%"],
            correctAnswer: "85.7%",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "NHTM B có dư nợ cho vay 5.000 tỷ, trong đó: Nhóm 1: 4.200 tỷ, Nhóm 2: 400 tỷ, Nhóm 3: 200 tỷ, Nhóm 4: 120 tỷ, Nhóm 5: 80 tỷ. Tỷ lệ nợ xấu (NPL) là:",
            options: ["8%", "6%", "10%", "4%"],
            correctAnswer: "8%",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Với dư nợ ở câu trên, mức trích lập dự phòng cụ thể tối thiểu (theo quy định: N2=25%, N3=50%, N4=75%, N5=100%) là:",
            options: ["230 tỷ", "210 tỷ", "250 tỷ", "200 tỷ"],
            correctAnswer: "230 tỷ",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "NHTM C có: Vốn tự có 800 tỷ, Tài sản có rủi ro theo hệ số 12.000 tỷ. Tỷ lệ an toàn vốn CAR (theo Basel II, yêu cầu tối thiểu 8%) là:",
            options: ["6.67%", "8%", "10%", "12%"],
            correctAnswer: "6.67%",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "Nghiệp vụ chiết khấu thương phiếu: Ngân hàng mua thương phiếu mệnh giá 500tr, còn 90 ngày đến hạn, lãi suất chiết khấu 12%/năm. Số tiền ngân hàng trả cho khách hàng là:",
            options: ["485.000.000đ", "485.500.000đ", "490.000.000đ", "480.000.000đ"],
            correctAnswer: "485.500.000đ",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Phân tích 5C trong thẩm định tín dụng: 'Capacity' (Năng lực) đánh giá yếu tố nào?",
            options: [
              "Đạo đức, uy tín khách hàng trong thanh toán",
              "Khả năng tạo dòng tiền để trả nợ từ hoạt động kinh doanh",
              "Tài sản đảm bảo cho khoản vay",
              "Điều kiện kinh tế vĩ mô ảnh hưởng đến khách hàng",
            ],
            correctAnswer: "Khả năng tạo dòng tiền để trả nợ từ hoạt động kinh doanh",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "Cho vay theo hạn mức tín dụng (credit line): DN có hạn mức 5 tỷ, trong kỳ đã sử dụng 3 tỷ, còn hạn mức 2 tỷ. Ngân hàng tính lãi trên:",
            options: [
              "Hạn mức 5 tỷ",
              "Số đã sử dụng 3 tỷ",
              "Số chưa sử dụng 2 tỷ",
              "Tổng hạn mức + phí cam kết",
            ],
            correctAnswer: "Số đã sử dụng 3 tỷ",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "NHTM D có tỷ lệ LDR = 95%, tỷ lệ dự trữ thanh khoản = 5%. Phát biểu nào ĐÚNG về rủi ro của ngân hàng?",
            options: [
              "Ngân hàng có thanh khoản tốt, rủi ro thấp",
              "Ngân hàng gặp rủi ro thanh khoản cao, cho vay quá mức so với huy động",
              "Ngân hàng hoạt động hiệu quả, tối ưu hóa lợi nhuận",
              "Ngân hàng tuân thủ đầy đủ quy định NHNN",
            ],
            correctAnswer: "Ngân hàng gặp rủi ro thanh khoản cao, cho vay quá mức so với huy động",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Cơ cấu lại nợ (restructuring) cho khách hàng gặp khó khăn tạm thời KHÔNG bao gồm:",
            options: [
              "Gia hạn thời gian trả nợ",
              "Giảm lãi suất cho vay",
              "Xóa toàn bộ nợ gốc không cần thu hồi",
              "Chuyển nợ quá hạn thành nợ trong hạn",
            ],
            correctAnswer: "Xóa toàn bộ nợ gốc không cần thu hồi",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "Huy động vốn qua tiền gửi tiết kiệm có kỳ hạn 6 tháng, lãi suất 6%/năm. Khách hàng gửi 100tr, rút trước hạn sau 4 tháng. Theo quy định, lãi suất áp dụng通常是:",
            options: [
              "Lãi suất không kỳ hạn (thấp hơn có kỳ hạn)",
              "Lãi suất 6%/năm như cam kết",
              "Lãi suất 4%/năm (tính theo thời gian thực tế)",
              "Không trả lãi",
            ],
            correctAnswer: "Lãi suất không kỳ hạn (thấp hơn có kỳ hạn)",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "Nghiệp vụ bảo lãnh ngân hàng: Ngân hàng phát hành bảo lãnh 2 tỷ cho DN E thực hiện hợp đồng. DN E vi phạm, ngân hàng phải trả 2 tỷ cho bên thụ hưởng. Đây là rủi ro:",
            options: [
              "Rủi ro thanh khoản",
              "Rủi ro tín dụng (off-balance sheet)",
              "Rủi ro lãi suất",
              "Rủi ro ngoại hối",
            ],
            correctAnswer: "Rủi ro tín dụng (off-balance sheet)",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "NHTM F có: Huy động tiền gửi không kỳ hạn 2.000 tỷ (lãi suất 0.3%/năm), tiền gửi có kỳ hạn 5.000 tỷ (lãi suất 6%/năm). Chi phí vốn huy động bình quân là:",
            options: ["4.31%/năm", "5.0%/năm", "4.5%/năm", "3.5%/năm"],
            correctAnswer: "4.31%/năm",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "NHTM G có các số liệu (tỷ đồng):\n- Huy động vốn: 8.000 (trong đó CASA 1.500, tiền gửi kỳ hạn 6.500)\n- Cho vay: 6.500 (Nhóm 1: 5.800, Nhóm 2: 350, Nhóm 3: 180, Nhóm 4: 100, Nhóm 5: 70)\n- Vốn tự có: 650\n- Tài sản có rủi ro: 8.200\n- Lãi suất cho vay bình quân: 9%/năm\n- Lãi suất huy động bình quân: 5%/năm\n- Chi phí hoạt động: 180 tỷ/năm\n\nYêu cầu:\n1. Tính tỷ lệ LDR, tỷ lệ NPL, tỷ lệ CAR.\n2. Tính trích lập dự phòng cụ thể.\n3. Ước tính lợi nhuận trước thuế (không tính dự phòng).",
            correctAnswer: "**1. Tỷ lệ:**\n- LDR = 6.500 / 8.000 = **81.25%**\n- NPL = (180+100+70) / 6.500 = 350/6.500 = **5.38%**\n- CAR = 650 / 8.200 = **7.93%** (dưới mức tối thiểu 8% — cần tăng vốn)\n\n**2. Trích lập dự phòng cụ thể:**\n- Nhóm 2: 350 × 25% = 87.5 tỷ\n- Nhóm 3: 180 × 50% = 90 tỷ\n- Nhóm 4: 100 × 75% = 75 tỷ\n- Nhóm 5: 70 × 100% = 70 tỷ\n- **Tổng = 322.5 tỷ**\n\n**3. Lợi nhuận trước thuế (ước tính):**\n- Thu nhập lãi = 6.500 × 9% = 585 tỷ\n- Chi phí lãi = 8.000 × 5% = 400 tỷ\n- NIM = 185 tỷ\n- Trừ chi phí hoạt động: 185 - 180 = 5 tỷ\n- Trừ dự phòng: 5 - 322.5 = -317.5 tỷ\n- **LNTT ≈ -317.5 tỷ** (lỗ do trích lập dự phòng lớn)\n\n*Kết luận: Ngân hàng cần xử lý nợ xấu và tăng vốn để đáp ứng CAR.*",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "Phân tích các rủi ro trong hoạt động ngân hàng thương mại (rủi ro tín dụng, rủi ro thanh khoản, rủi ro lãi suất, rủi ro ngoại hối) và các biện pháp quản trị từng loại rủi ro theo thông lệ Basel.",
            correctAnswer: "**1. Rủi ro tín dụng (Credit Risk):**\n- Khách hàng không trả nợ đúng hạn hoặc mất khả năng thanh toán\n- **Quản trị:** Phân tích 5C, chấm điểm tín dụng, phân tách rủi ro, trích lập dự phòng, sử dụng các công cụ phái sinh tín dụng (CDS), hạn mức tín dụng\n\n**2. Rủi ro thanh khoản (Liquidity Risk):**\n- Ngân hàng không đáp ứng được nhu cầu rút tiền hoặc giải ngân\n- **Quản trị:** Duy trì tỷ lệ LDR hợp lý, dự trữ thanh khoản đủ, quản trị khe hở kỳ hạn (gap analysis), áp dụng LCR và NSFR theo Basel III\n\n**3. Rủi ro lãi suất (Interest Rate Risk):**\n- Biến động lãi suất ảnh hưởng NIM và giá trị tài sản\n- **Quản trị:** Quản trị khe hở nhạy cảm lãi suất (GAP), sử dụng lãi suất thả nổi, hợp đồng tương lai lãi suất (IRF), hoán đổi lãi suất (IRS)\n\n**4. Rủi ro ngoại hối (FX Risk):**\n- Biến động tỷ giá ảnh hưởng tài sản/nợ ngoại tệ\n- **Quản trị:** Hạn chế vị thế ngoại tệ mở, sử dụng hợp đồng kỳ hạn, hoán đổi ngoại tệ (currency swap), đa dạng hóa loại tiền tệ\n\n**Basel II/III:** Khung quản trị rủi ro toàn diện, yêu cầu CAR tối thiểu 8% (Basel II) + buffer bảo toàn 2.5% (Basel III), quản trị rủi ro tác động, rủi ro đối tác, rủi ro thị trường.",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "DN H vay ngân hàng 2.000.000.000đ, lãi suất 12%/năm, thời hạn 3 năm, trả gốc đều theo năm, lãi tính trên dư nợ gốc. Lập bảng trả nợ và tính tổng lãi phải trả.",
            correctAnswer: "**Bảng trả nợ (đồng)**\n\nGốc trả mỗi năm = 2.000.000.000 / 3 = 666.666.667đ\n\n| Năm | Dư nợ đầu năm | Trả gốc | Trả lãi | Tổng trả |\n|-----|---------------|---------|---------|----------|\n| 1 | 2.000.000.000 | 666.666.667 | 240.000.000 | 906.666.667 |\n| 2 | 1.333.333.333 | 666.666.667 | 160.000.000 | 826.666.667 |\n| 3 | 666.666.667 | 666.666.667 | 80.000.000 | 746.666.667 |\n\n**Tổng lãi = 240.000.000 + 160.000.000 + 80.000.000 = 480.000.000đ**\n**Tổng trả = 2.480.000.000đ**\n\n*Lưu ý: Lãi giảm dần vì tính trên dư nợ gốc giảm.*",
            orderIndex: 14,
          },
        ],
      },
      {
        title: "Tín dụng Ngân hàng – UEL (Nâng cao)",
        source: "Đại học Kinh tế – Luật (UEL)",
        tags: ["tin_dung", "cho_vay", "tham_dinh", "bao_lanh", "lc"],
        questions: [
          {
            type: "mcq",
            content: "L/C (Letter of Credit) xác nhận (confirmed L/C) có thêm cam kết thanh toán từ:",
            options: [
              "Ngân hàng phát hành L/C",
              "Ngân hàng thông báo (advising bank) hoặc ngân hàng xác nhận khác",
              "Người mua (người yêu cầu mở L/C)",
              "Người bán (người thụ hưởng)",
            ],
            correctAnswer: "Ngân hàng thông báo (advising bank) hoặc ngân hàng xác nhận khác",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "Trong L/C at sight (trả ngay), ngân hàng phát hành thanh toán cho người thụ hưởng:",
            options: [
              "Khi hàng hóa được giao và chứng từ hợp lệ được trình",
              "Sau 30 ngày kể từ ngày trình chứng từ",
              "Khi người mua thanh toán cho ngân hàng",
              "Chỉ khi người mua xác nhận nhận hàng",
            ],
            correctAnswer: "Khi hàng hóa được giao và chứng từ hợp lệ được trình",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Cho vay dự án: DN vay 5 tỷ, thời hạn 5 năm, thời gian ân hạn 1 năm (chỉ trả lãi). Lãi suất 11%/năm. Gốc trả đều từ năm 2-5. Tổng lãi trả trong 5 năm là:",
            options: ["2.035.000.000đ", "2.200.000.000đ", "1.870.000.000đ", "2.100.000.000đ"],
            correctAnswer: "2.035.000.000đ",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "Thẩm định tín dụng: DN I có DSCR (Debt Service Coverage Ratio) = 1.2. Phát biểu nào ĐÚNG?",
            options: [
              "DN có dòng tiền đủ trả nợ, dư 20% — rủi ro thấp",
              "DN có dòng tiền vừa đủ trả nợ — rủi ro trung bình",
              "DN có dòng tiền không đủ trả nợ — rủi ro cao",
              "DSCR = 1.2 nghĩa là DN có lợi nhuận cao",
            ],
            correctAnswer: "DN có dòng tiền đủ trả nợ, dư 20% — rủi ro thấp",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "Cho vay hợp vốn (syndicated loan) được sử dụng khi:",
            options: [
              "Khoản vay nhỏ, một ngân hàng đủ vốn",
              "Khoản vay lớn vượt quá hạn mức cho vay của một ngân hàng, cần nhiều ngân hàng cùng tham gia",
              "Khách hàng muốn giữ bí mật khoản vay",
              "Doanh nghiệp muốn vay với lãi suất thấp nhất",
            ],
            correctAnswer: "Khoản vay lớn vượt quá hạn mức cho vay của một ngân hàng, cần nhiều ngân hàng cùng tham gia",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Tài sản đảm bảo cho khoản vay: DN thế chấp TSCĐ nguyên giá 3 tỷ, khấu hao lũy kế 1 tỷ, giá trị thị trường 2.5 tỷ. Ngân hàng áp dụng tỷ lệ cho vay trên giá trị đảm bảo (LTV) 70%. Hạn mức vay tối đa là:",
            options: ["1.750 tỷ", "1.400 tỷ", "2.100 tỷ", "1.050 tỷ"],
            correctAnswer: "1.750 tỷ",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "Nghiệp vụ factoring (bán khoản phải thu): DN bán khoản phải thu 500tr cho công ty factoring với chiết khấu 3%. DN nhận được:",
            options: ["485.000.000đ", "500.000.000đ", "470.000.000đ", "490.000.000đ"],
            correctAnswer: "485.000.000đ",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "Rủi ro đạo đức (moral hazard) trong tín dụng xảy ra khi:",
            options: [
              "Khách hàng có thông tin không đầy đủ về điều kiện vay",
              "Sau khi vay, khách hàng sử dụng vốn vào mục đích rủi ro hơn vì ngân hàng không kiểm soát được",
              "Ngân hàng ấn định lãi suất quá cao",
              "Khách hàng không có tài sản đảm bảo",
            ],
            correctAnswer: "Sau khi vay, khách hàng sử dụng vốn vào mục đích rủi ro hơn vì ngân hàng không kiểm soát được",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Lựa chọn adverse (adverse selection) trong tín dụng là tình huống:",
            options: [
              "Ngân hàng chỉ cho vay khách hàng tốt, bỏ qua khách hàng rủi ro",
              "Khách hàng rủi ro cao thường là người tích cực tìm kiếm vay hơn, ngân hàng khó phân biệt trước khi cho vay",
              "Ngân hàng chọn sai loại tài sản đảm bảo",
              "Khách hàng chọn sai sản phẩm vay",
            ],
            correctAnswer: "Khách hàng rủi ro cao thường là người tích cực tìm kiếm vay hơn, ngân hàng khó phân biệt trước khi cho vay",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "Tín dụng xuất khẩu: Ngân hàng chiết khấu bộ chứng từ xuất khẩu cho DN J, mệnh giá 1 tỷ, còn 60 ngày đến hạn, lãi suất chiết khấu 10%/năm, phí 0.5% mệnh giá. DN J nhận được:",
            options: ["978.333.000đ", "980.000.000đ", "985.000.000đ", "975.000.000đ"],
            correctAnswer: "978.333.000đ",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "Xếp hạng tín dụng nội bộ (internal credit rating): DN K được xếp hạng BB. Phát biểu nào ĐÚNG về ý nghĩa?",
            options: [
              "DN có chất lượng tín dụng tốt nhất, rủi ro thấp",
              "DN có chất lượng tín dụng trung bình, có yếu tố rủi ro cần theo dõi",
              "DN có chất lượng tín dụng kém, rủi ro cao, cần hạn chế cho vay",
              "DN không đủ tiêu准 vay vốn",
            ],
            correctAnswer: "DN có chất lượng tín dụng trung bình, có yếu tố rủi ro cần theo dõi",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "Cho vay trả góp: KH vay 200tr, lãi suất 15%/năm, thời hạn 24 tháng, trả đều theo tháng. Cho biết hệ số hoàn vốn tháng (r=1.25%, n=24) = 0.0475. Khoản trả hàng tháng là:",
            options: ["9.500.000đ", "8.333.000đ", "10.000.000đ", "8.750.000đ"],
            correctAnswer: "9.500.000đ",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "DN L xin vay ngân hàng 3 tỷ để mở rộng sản xuất. Hồ sơ cho thấy:\n- Doanh thu năm 2024: 15 tỷ, 2025: 12 tỷ (giảm 20%)\n- Lợi nhuận sau thuế 2024: 800tr, 2025: 200tr\n- Tổng tài sản: 8 tỷ, nợ phải trả: 5 tỷ\n- TSCĐ thế chấp: nguyên giá 4 tỷ, KH lũy kế 1.5 tỷ, giá thị trường 3 tỷ\n- DSCR ước tính: 1.1\n\nYêu cầu: Thẩm định khoản vay theo nguyên tắc 5C và đưa ra khuyến nghị (cho vay/từ chối/cho vay có điều kiện).",
            correctAnswer: "**Thẩm định theo 5C:**\n\n**1. Character (Phẩm chất):**\n- Cần kiểm tra lịch sử tín dụng, ý thức trả nợ\n- Chưa có thông tin → cần tra cứu CIC\n\n**2. Capacity (Năng lực):**\n- Doanh thu giảm 20%, lợi nhuận giảm 75% → xu hướng xấu\n- DSCR = 1.1 → dòng tiền vừa đủ trả nợ, biên an toàn mỏng\n- **Rủi ro cao về năng lực trả nợ**\n\n**3. Capital (Vốn):**\n- Vốn chủ sở hữu = 8 - 5 = 3 tỷ (D/E = 5/3 = 1.67 → đòn bẩy cao)\n- **Cần thêm vốn tự có**\n\n**4. Collateral (Tài sản đảm bảo):**\n- TSCĐ giá trị còn lại = 4 - 1.5 = 2.5 tỷ, giá thị trường 3 tỷ\n- LTV = 3 tỷ / 3 tỷ = 100% → vượt mức an toàn (thường 70%)\n- **Tài sản đảm bảo không đủ**\n\n**5. Conditions (Điều kiện):**\n- Doanh thu giảm → có thể do thị trường thu hẹp hoặc cạnh tranh\n- Cần đánh giá triển vọng ngành\n\n**Khuyến nghị: Cho vay có điều kiện**\n- Chỉ cho vay tối đa 2.1 tỷ (70% × 3 tỷ giá thị trường)\n- Yêu cầu thêm tài sản đảm bảo hoặc bảo lãnh bên thứ 3\n- Giám sát chặt chẽ dòng tiền, yêu cầu DN trình kế hoạch phục hồi doanh thu\n- Có thể áp dụng lãi suất cao hơn do rủi ro cao",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "Trình bày quy trình cấp tín dụng tại NHTM (7 bước) và phân tích vai trò của bước thẩm định tín dụng trong việc kiểm soát rủi ro.",
            correctAnswer: "**Quy trình cấp tín dụng (7 bước):**\n\n1. **Tiếp nhận hồ sơ** — Khách hàng nộp hồ sơ vay vốn, ngân hàng kiểm tra tính hợp lệ\n2. **Thẩm định tín dụng** — Đánh giá toàn diện khách hàng theo 5C\n3. **Quyết định cho vay** — Cấp có thẩm quyền phê duyệt/từ chối\n4. **Giải ngân** — Ngân hàng giải ngân theo phương thức thỏa thuận\n5. **Kiểm tra giám sát** — Theo dõi sử dụng vốn, tình hình tài chính\n6. **Thu nợ** — Khách hàng trả gốc + lãi\n7. **Xử lý nợ** — Cơ cấu lại, thu hồi, xóa nợ (nếu có)\n\n**Vai trò của thẩm định tín dụng:**\n- Là bước quan trọng nhất, quyết định chất lượng khoản vay\n- Xác định đúng đối tượng, mục đích, thời hạn, hạn mức\n- Phát hiện rủi ro trước khi cho vay (adverse selection)\n- Xác định điều kiện cho vay phù hợp (lãi suất, tài sản đảm bảo, kỳ hạn)\n- Tránh nợ xấu từ đầu, giảm chi phí xử lý nợ sau này\n- Cơ sở cho việc ra quyết định tín dụng có thẩm quyền",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "So sánh cho vay theo hạn mức tín dụng (credit line) và cho vay từng lần (term loan). Phân tích ưu nhược điểm và tình huống áp dụng của từng hình thức.",
            correctAnswer: "**Cho vay theo hạn mức tín dụng:**\n- Ngân hàng cấp hạn mức tối đa, KH rút vốn linh hoạt theo nhu cầu\n- Lãi tính trên số thực rút, không tính trên hạn mức chưa sử dụng\n- **Ưu:** Linh hoạt, tiết kiệm chi phí lãi, phù hợp nhu cầu vốn lưu động biến động\n- **Nhược:** Rủi ro cao cho ngân hàng (KH có thể rút toàn bộ bất cứ lúc nào), cần kiểm soát chặt\n- **Áp dụng:** DN có nhu cầu vốn lưu động thường xuyên, mùa vụ (nông nghiệp, bán lẻ dịp Tết)\n\n**Cho vay từng lần:**\n- Mỗi lần vay ký hợp đồng riêng, cố định số tiền, kỳ hạn, mục đích\n- Lãi tính trên toàn bộ số vay\n- **Ưu:** Kiểm soát rủi ro tốt hơn, rõ ràng từng khoản, phù hợp vay đầu tư\n- **Nhược:** Thủ tục lặp lại nhiều lần, kém linh hoạt\n- **Áp dụng:** Vay mua TSCĐ, dự án đầu tư, vay tiêu dùng mua nhà/ô tô\n\n**Kết luận:** Hạn mức phù hợp vốn lưu động, từng lần phù hợp vốn cố định. NHTM thường kết hợp cả hai để đáp ứng đa dạng nhu cầu khách hàng.",
            orderIndex: 14,
          },
        ],
      },
      {
        title: "Quản trị Rủi ro Ngân hàng – HVNH (Nâng cao)",
        source: "Học viện Ngân hàng",
        tags: ["quan_tri_rui_ro", "basel", "var", "thanh_khoan", "thi_truong"],
        questions: [
          {
            type: "mcq",
            content: "Theo Basel III, tỷ lệ an toàn vốn tối thiểu (CAR) bao gồm:",
            options: [
              "8% (Tier 1 + Tier 2) + 2.5% buffer bảo toàn = 10.5%",
              "Chỉ 8% như Basel II",
              "12% không bao gồm buffer",
              "4.5% Tier 1 + 1.5% Tier 2",
            ],
            correctAnswer: "8% (Tier 1 + Tier 2) + 2.5% buffer bảo toàn = 10.5%",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "Value at Risk (VaR) 99% của danh mục đầu tư 100 tỷ là 5 tỷ. Phát biểu nào ĐÚNG?",
            options: [
              "Danh mục sẽ lỗ tối đa 5 tỷ trong 99% số ngày giao dịch",
              "Danh mục sẽ lỗ 5 tỷ mỗi ngày",
              "Danh mục có 99% xác suất sinh lời 5 tỷ",
              "Danh mục sẽ lỗ tối đa 100 tỷ trong 1% số ngày",
            ],
            correctAnswer: "Danh mục sẽ lỗ tối đa 5 tỷ trong 99% số ngày giao dịch",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Tỷ lệ LCR (Liquidity Coverage Ratio) theo Basel III yêu cầu:",
            options: [
              "Tài sản thanh khoản chất lượng cao / Dòng tiền ra ròng 30 ngày ≥ 100%",
              "Tài sản thanh khoản / Tổng tài sản ≥ 50%",
              "Dự trữ / Huy động ≥ 10%",
              "Cho vay / Huy động ≤ 85%",
            ],
            correctAnswer: "Tài sản thanh khoản chất lượng cao / Dòng tiền ra ròng 30 ngày ≥ 100%",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "Rủi ro thị trường (market risk) bao gồm:",
            options: [
              "Rủi ro lãi suất, rủi ro tỷ giá, rủi ro giá cổ phiếu, rủi ro giá hàng hóa",
              "Rủi ro khách hàng không trả nợ",
              "Rủi ro ngân hàng thiếu thanh khoản",
              "Rủi ro vận hành, rủi ro gian lận",
            ],
            correctAnswer: "Rủi ro lãi suất, rủi ro tỷ giá, rủi ro giá cổ phiếu, rủi ro giá hàng hóa",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "Duration của trái phiếu 5 năm, coupon 8%, YTM 10% là xấp xỉ 4.28 năm. Nếu lãi suất thị trường tăng 1% (từ 10% lên 11%), giá trái phiếu giảm xấp xỉ:",
            options: ["3.89%", "4.28%", "5%", "8%"],
            correctAnswer: "3.89%",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Rủi ro vận hành (operational risk) theo Basel II bao gồm:",
            options: [
              "Rủi ro do quy trình, con người, hệ thống, sự kiện ngoại cảnh",
              "Rủi ro do khách hàng không trả nợ",
              "Rủi ro do biến động lãi suất",
              "Rủi ro do tỷ giá thay đổi",
            ],
            correctAnswer: "Rủi ro do quy trình, con người, hệ thống, sự kiện ngoại cảnh",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "Hedging rủi ro lãi suất bằng hợp đồng hoán đổi lãi suất (Interest Rate Swap): Ngân hàng có nợ lãi suất thả nổi, muốn chuyển sang cố định. Ngân hàng sẽ:",
            options: [
              "Nhận lãi thả nổi, trả lãi cố định",
              "Nhận lãi cố định, trả lãi thả nổi",
              "Chỉ nhận lãi cố định",
              "Chỉ trả lãi thả nổi",
            ],
            correctAnswer: "Nhận lãi thả nổi, trả lãi cố định",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "NSFR (Net Stable Funding Ratio) theo Basel III đo lường:",
            options: [
              "Tỷ lệ tài sản thanh khoản / dòng tiền ra ngắn hạn",
              "Nguồn vốn ổn định / Tài sản cần vốn ổn định (yêu cầu ≥ 100%)",
              "Tỷ lệ cho vay / huy động",
              "Tỷ lệ vốn tự có / tài sản rủi ro",
            ],
            correctAnswer: "Nguồn vốn ổn định / Tài sản cần vốn ổn định (yêu cầu ≥ 100%)",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Mô hình CreditMetrics dùng để:",
            options: [
              "Đo lường rủi ro tín dụng của danh mục qua việc mô phỏng biến động xếp hạng tín dụng",
              "Đo lường rủi ro thị trường",
              "Đo lường rủi ro thanh khoản",
              "Tính toán chi phí vốn",
            ],
            correctAnswer: "Đo lường rủi ro tín dụng của danh mục qua việc mô phỏng biến động xếp hạng tín dụng",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "Stress testing (kiểm tra chịu đựng áp lực) trong ngân hàng nhằm:",
            options: [
              "Đánh giá tác động của các kịch bản bất lợi cực đoan đến tài sản và vốn của ngân hàng",
              "Kiểm tra năng lực nhân viên",
              "Kiểm tra chất lượng dịch vụ khách hàng",
              "Kiểm tra hệ thống công nghệ thông tin",
            ],
            correctAnswer: "Đánh giá tác động của các kịch bản bất lợi cực đoan đến tài sản và vốn của ngân hàng",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "Rủi ro tập trung (concentration risk) trong ngân hàng xảy ra khi:",
            options: [
              "Cho vay quá nhiều cho một khách hàng, một ngành, hoặc một khu vực địa lý",
              "Cho vay đa dạng nhiều khách hàng nhỏ",
              "Huy động vốn từ nhiều nguồn",
              "Đầu tư vào nhiều loại tài sản",
            ],
            correctAnswer: "Cho vay quá nhiều cho một khách hàng, một ngành, hoặc một khu vực địa lý",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "Mô hình Three Pillars (3 trụ cột) của Basel II bao gồm:",
            options: [
              "Trụ cột 1: Yêu cầu vốn tối thiểu; Trụ cột 2: Giám sát an toàn; Trụ cột 3: Kỷ luật thị trường",
              "Trụ cột 1: Thanh khoản; Trụ cột 2: Vốn; Trụ cột 3: Quản trị rủi ro",
              "Trụ cột 1: Tín dụng; Trụ cột 2: Thị trường; Trụ cột 3: Vận hành",
              "Trụ cột 1: CAR; Trụ cột 2: LCR; Trụ cột 3: NSFR",
            ],
            correctAnswer: "Trụ cột 1: Yêu cầu vốn tối thiểu; Trụ cột 2: Giám sát an toàn; Trụ cột 3: Kỷ luật thị trường",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "NHTM M có danh mục đầu tư trái phiếu 10 tỷ đồng. VaR 95% 1 ngày = 50 triệu. VaR 99% 1 ngày = 80 triệu.\n\nYêu cầu:\n1. Giải thích ý nghĩa của VaR 95% và VaR 99%.\n2. Nếu ngân hàng giữ danh mục 10 ngày, VaR 10 ngày 99% là bao nhiêu (giả sử phân phối bình thường)?\n3. Nếu ngân hàng muốn giảm VaR xuống 60 triệu (99%, 10 ngày), cần giảm quy mô danh mục xuống bao nhiêu?",
            correctAnswer: "**1. Ý nghĩa VaR:**\n- VaR 95% 1 ngày = 50tr: Trong 95% số ngày, danh mục lỗ tối đa 50tr. Chỉ 5% số ngày lỗ vượt 50tr.\n- VaR 99% 1 ngày = 80tr: Trong 99% số ngày, danh mục lỗ tối đa 80tr. Chỉ 1% số ngày lỗ vượt 80tr.\n\n**2. VaR 10 ngày 99%:**\nVaR_n = VaR_1 × √n\nVaR_10 = 80 × √10 = 80 × 3.162 = **253 triệu**\n\n**3. Giảm VaR xuống 60tr (99%, 10 ngày):**\nVaR tỷ lệ thuận với quy mô danh mục\nQuy mô mới = 10 tỷ × (60 / 253) = **2.37 tỷ đồng**\n\nNgân hàng cần giảm danh mục từ 10 tỷ xuống 2.37 tỷ (giảm 76%) để đạt VaR mục tiêu.",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "Phân tích các công cụ quản trị rủi ro lãi suất trong ngân hàng: GAP analysis, Duration Gap, và các công cụ phái sinh (IRS, FRA, Options). So sánh ưu nhược điểm.",
            correctAnswer: "**1. GAP Analysis (Phân tích khe hở nhạy cảm lãi suất):**\n- So sánh tài sản và nợ nhạy cảm lãi suất trong từng khoảng thời gian\n- GAP = TSNH lãi suất - Nợ nhạy cảm lãi suất\n- Ưu: Đơn giản, dễ tính, trực quan\n- Nhược: Không xét đến giá trị thị trường, chỉ xét thu nhập lãi\n\n**2. Duration Gap (Khe hở thời gian):**\n- Đo lường tác động lãi suất đến giá trị tài sản thuần của ngân hàng\n- Duration Gap = D_A - (L/A × D_L)\n- Ưu: Xét đến giá trị thị trường, chính xác hơn GAP\n- Nhược: Phức tạp hơn, cần tính duration cho từng tài sản/nợ\n\n**3. Công cụ phái sinh:**\n- **IRS (Interest Rate Swap):** Hoán đổi lãi cố định ↔ thả nổi. Ưu: Linh hoạt, không cần vốn. Nhược: Rủi ro đối tác.\n- **FRA (Forward Rate Agreement):** Khóa lãi suất tương lai. Ưu: Đơn giản. Nhược: Thanh toán 1 lần, không linh hoạt.\n- **Options (Cap/Floor/Collar):** Giới hạn lãi suất trong khoảng. Ưu: Bảo vệ 1 chiều, giữ cơ hội lợi nhuận. Nhược: Phí option cao.\n\n**Kết luận:** Ngân hàng nên kết hợp nhiều công cụ: GAP cho quản trị ngắn hạn, Duration cho trung dài hạn, phái sinh để hedging cụ thể.",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "Trình bày khung quản trị rủi ro toàn diện (Enterprise Risk Management - ERM) trong ngân hàng theo thông lệ Basel. Nêu các thành phần cơ bản và mối quan hệ giữa chúng.",
            correctAnswer: "**Khung ERM trong ngân hàng (theo Basel/COSO):**\n\n**1. Môi trường quản trị rủi ro:**\n- Ban điều hành và HĐQT cam kết quản trị rủi ro\n- Chính sách rủi ro, hạn mức, quy trình\n\n**2. Nhận diện rủi ro:**\n- Rủi ro tín dụng, thanh khoản, lãi suất, ngoại hối, vận hành, tuân thủ, chiến lược\n- Thường xuyên rà soát các rủi ro mới\n\n**3. Đo lường và đánh giá:**\n- Mô hình định lượng: VaR, CreditMetrics, Monte Carlo\n- Định tính: Chấm điểm, chuyên gia\n\n**4. Xử lý rủi ro:**\n- Tránh: Không thực hiện giao dịch rủi ro cao\n- Giảm: Phân tách, hạn mức, hedging\n- Chuyển giao: Bảo hiểm, chứng khoán hóa\n- Chấp nhận: Giữ lại trong hạn mức\n\n**5. Giám sát và báo cáo:**\n- Hệ thống cảnh báo sớm\n- Báo cáo rủi ro định kỳ cho HĐQT\n- Kiểm toán nội bộ\n\n**6. Thông tin và truyền thông:**\n- Hệ thống dữ liệu rủi ro tập trung\n- Minh bạch thông tin\n\n**Mối quan hệ:** Các thành phần liên tục tương tác — nhận diện → đo lường → xử lý → giám sát → điều chỉnh. ERM là chu trình liên tục, không phải một lần.",
            orderIndex: 14,
          },
        ],
      },
      {
        title: "Tài chính Doanh nghiệp – NEU (Nâng cao)",
        source: "Đại học Kinh tế Quốc dân",
        tags: ["tai_chinh_doanh_nghiep", "wacc", "npv", "capm", "co_cau_von"],
        questions: [
          {
            type: "mcq",
            content: "DN N có: Nợ 2.000tr (lãi suất 10%/năm, sau thuế 8%), VCSH 3.000tr (chi phí 14%). Thuế TNDN 20%. WACC là:",
            options: ["11.6%", "12%", "10.4%", "12.8%"],
            correctAnswer: "11.6%",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "Dự án đầu tư 1.000tr, dòng tiền ròng 5 năm: 300tr/năm. Chi phí vốn 12%. Cho biết PVIFA 12%,5 = 3.605. NPV là:",
            options: ["81.5 triệu", "500 triệu", "300 triệu", "81.5 triệu"],
            correctAnswer: "81.5 triệu",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "IRR của dự án đầu tư 800tr, dòng tiền 4 năm: 250tr/năm là xấp xỉ (cho biết IRR tại 9%: NPV=8.5tr; IRR tại 10%: NPV=-7.1tr):",
            options: ["9.5%", "9.3%", "10.5%", "8.8%"],
            correctAnswer: "9.5%",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "Theo CAPM: Beta = 1.5, Rf = 5%, Rm = 11%. Chi phí vốn chủ sở hữu là:",
            options: ["14%", "11%", "16.5%", "13%"],
            correctAnswer: "14%",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "Cấu trúc vốn tối ưu (theo lý thuyết đánh đổi - trade-off theory) là điểm mà:",
            options: [
              "Lợi ích thuế của nợ bù đắp chính xác chi phí phá sản tài chính tăng thêm",
              "WACC đạt mức tối đa",
              "Tỷ lệ nợ bằng 0",
              "Tỷ lệ nợ bằng 100%",
            ],
            correctAnswer: "Lợi ích thuế của nợ bù đắp chính xác chi phí phá sản tài chính tăng thêm",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "DN O có EBIT 500tr, lãi vay 100tr, thuế 20%. Nếu DN không có nợ (unlevered), giá trị DN = EBIT×(1-t)/WACC. Nếu WACC unlevered = 15%, giá trị DN không nợ là:",
            options: ["2.667 triệu", "2.400 triệu", "3.000 triệu", "2.800 triệu"],
            correctAnswer: "2.667 triệu",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "Chi phí vốn bình quân tăng khi DN tăng tỷ lệ nợ vì:",
            options: [
              "Chi phí nợ tăng do rủi ro phá sản cao hơn",
              "Chi phí VCSH tăng do đòn bẩy tài chính cao hơn",
              "Cả chi phí nợ và VCSH đều tăng khi rủi ro tăng quá mức",
              "Lợi ích thuế từ nợ giảm",
            ],
            correctAnswer: "Cả chi phí nợ và VCSH đều tăng khi rủi ro tăng quá mức",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "Dự án có NPV = 0 và IRR = chi phí vốn. Phát biểu nào ĐÚNG?",
            options: [
              "Dự án không tạo ra giá trị gia tăng, chỉ đủ bù đắp chi phí vốn",
              "Dự án nên bị từ chối",
              "Dự án tạo lợi nhuận siêu ngạch",
              "Dự án có rủi ro cao",
            ],
            correctAnswer: "Dự án không tạo ra giá trị gia tăng, chỉ đủ bù đắp chi phí vốn",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Kỳ hạn hoàn vốn (Macaulay Duration) của trái phiếu zero-coupon 5 năm là:",
            options: ["5 năm", "2.5 năm", "4 năm", "3 năm"],
            correctAnswer: "5 năm",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "DN P có EBIT 400tr, lãi vay 50tr, thuế 20%. Đòn bẩy tài chính (Degree of Financial Leverage - DFL) là:",
            options: ["1.14", "1.25", "1.0", "1.33"],
            correctAnswer: "1.14",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "Chính sách cổ tức ổn định (stable dividend policy) có đặc điểm:",
            options: [
              "Tỷ lệ cổ tức thay đổi theo lợi nhuận mỗi năm",
              "Cổ tức duy trì ổn định hoặc tăng dần, không giảm trừ khi cần thiết",
              "Không trả cổ tức, giữ lại toàn bộ lợi nhuận",
              "Trả cổ tức bằng cổ phiếu mới",
            ],
            correctAnswer: "Cổ tức duy trì ổn định hoặc tăng dần, không giảm trừ khi cần thiết",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "Chi phí vốn của lợi nhuận giữ lại (cost of retained earnings) so với chi phí phát hành cổ phiếu mới:",
            options: [
              "Thấp hơn vì không có chi phí phát hành (flotation cost)",
              "Cao hơn vì rủi ro lớn hơn",
              "Bằng nhau",
              "Không thể so sánh",
            ],
            correctAnswer: "Thấp hơn vì không có chi phí phát hành (flotation cost)",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "DN Q có cấu trúc vốn hiện tại: Nợ 2.000tr (lãi suất 10%), VCSH 3.000tr. Thuế TNDN 20%. Beta cổ phiếu = 1.2, Rf = 6%, Rm = 12%. DN đang xem xét dự án mới cần vốn 1.000tr, duy trì cấu trúc vốn hiện tại.\n\nYêu cầu:\n1. Tính chi phí nợ sau thuế, chi phí VCSH, WACC hiện tại.\n2. Nếu phát hành cổ phiếu mới với chi phí phát hành 5%, chi phí VCSH mới là bao nhiêu?\n3. Tính WACC biên (marginal WACC) cho 1.000tr vốn mới.",
            correctAnswer: "**1. Chi phí vốn hiện tại:**\n- Chi phí nợ sau thuế = 10% × (1 - 0.2) = **8%**\n- Chi phí VCSH (CAPM) = 6% + 1.2 × (12% - 6%) = 6% + 7.2% = **13.2%**\n- Trọng số: Nợ = 2000/5000 = 40%, VCSH = 3000/5000 = 60%\n- WACC = 0.4 × 8% + 0.6 × 13.2% = 3.2% + 7.92% = **11.12%**\n\n**2. Chi phí VCSH mới (có chi phí phát hành 5%):**\n- Ke_new = 13.2% / (1 - 0.05) = 13.2% / 0.95 = **13.89%**\n\n**3. WACC biên cho 1.000tr vốn mới:**\n- Vốn nợ mới = 40% × 1.000 = 400tr (chi phí 8%)\n- Vốn VCSH mới = 60% × 1.000 = 600tr (chi phí 13.89%)\n- WACC biên = 0.4 × 8% + 0.6 × 13.89% = 3.2% + 8.334% = **11.53%**\n\n*WACC biên cao hơn WACC hiện tại do chi phí phát hành cổ phiếu mới.*",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "DN R đang xem xét dự án mở rộng với các số liệu:\n- Chi phí đầu tư ban đầu: 2.000tr (TSCĐ 1.800tr + vốn lưu động 200tr)\n- Thời gian dự án: 5 năm\n- Doanh thu năm: 1.500tr\n- Chi phí vận hành (không khấu hao): 800tr/năm\n- Khấu hao TSCĐ: đường thẳng, giá trị残留 0\n- Thuế TNDN 20%\n- Chi phí vốn 12%\n- Giá trị残留 TSCĐ cuối năm 5: 100tr\n- Thu hồi vốn lưu động cuối năm 5: 200tr\n\nCho biết: PVIFA 12%,5 = 3.605; PVIF 12%,5 = 0.567\n\nYêu cầu: Tính NPV và đưa ra quyết định đầu tư.",
            correctAnswer: "**Tính dòng tiền ròng mỗi năm (OCF):**\n- Khấu hao năm = 1.800 / 5 = 360tr\n- EBIT = 1.500 - 800 - 360 = 340tr\n- Thuế = 340 × 20% = 68tr\n- LNST = 340 - 68 = 272tr\n- OCF = LNST + Khấu hao = 272 + 360 = **632tr/năm**\n\n**Dòng tiền cuối năm 5 (năm cuối):**\n- OCF năm 5 = 632tr\n- Thu hồi giá trị残留 TSCĐ = 100tr\n- Thu hồi vốn lưu động = 200tr\n- Dòng tiền năm 5 = 632 + 100 + 200 = **932tr**\n\n**NPV:**\n- PV dòng tiền năm 1-4 = 632 × PVIFA 12%,4 = 632 × 3.037 = 1.919.4tr\n- PV dòng tiền năm 5 = 932 × PVIF 12%,5 = 932 × 0.567 = 528.4tr\n- Tổng PV dòng tiền = 1.919.4 + 528.4 = 2.447.8tr\n- NPV = 2.447.8 - 2.000 = **447.8 triệu**\n\n**Quyết định: Chấp nhận dự án** vì NPV > 0. Dự án tạo ra giá trị gia tăng 447.8 triệu cho doanh nghiệp.",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "Phân tích các nhân tố ảnh hưởng đến chính sách cổ tức của doanh nghiệp. Nêu 4 lý thuyết về chính sách cổ tức và đánh giá tính ứng dụng thực tế.",
            correctAnswer: "**Nhân tố ảnh hưởng chính sách cổ tức:**\n\n1. **Lợi nhuận và dòng tiền** — Cổ tức trả từ lợi nhuận, cần dòng tiền dương\n2. **Cơ hội đầu tư** — Nhiều cơ hội → giữ lại lợi nhuận, ít cổ tức\n3. **Thanh khoản** — DN cần tiền mặt để trả cổ tức\n4. **Hạn chế pháp lý/nợ** — Hợp đồng vay có thể hạn chế trả cổ tức\n5. **Thị trường và cổ đông** — Cổ đông thích cổ tức ổn định\n\n**4 lý thuyết:**\n\n1. **Lý thuyết không liên quan (Modigliani-Miller):**\n- Giá trị DN không phụ thuộc chính sách cổ tức, chỉ phụ thuộc khả năng sinh lời\n- Thực tế: Không đúng hoàn toàn do thuế, chi phí giao dịch, thông tin bất cân xứng\n\n2. **Lý thuyết 'con chim trong tay' (Gordon & Lintner):**\n- Cổ đông thích cổ tức hiện tại hơn lợi nhuận tương lai (rủi ro thấp hơn)\n- Thực tế: DN trả cổ tức cao thường được thị trường đánh giá cao\n\n3. **Lý thuyết tín hiệu (Signaling):**\n- Tăng cổ tức là tín hiệu tích cực về triển vọng tương lai\n- Thực tế: Đúng, thị trường thường phản ứng tích cực khi tăng cổ tức\n\n4. **Lý thuyết khách hàng (Clientele Effect):**\n- Mỗi chính sách cổ tức thu hút nhóm cổ đông khác nhau\n- Thực tế: DN thay đổi chính sách có thể mất nhóm cổ đông hiện tại",
            orderIndex: 14,
          },
        ],
      },
    ],
  },
  // ── Quản trị Kinh doanh (Business) — 5 đề ────────────────────────
  {
    slug: "quan_tri_kinh_doanh",
    name: "Quản trị Kinh doanh",
    deThi: [
      {
        title: "Quản trị Marketing – ĐH Mở TP.HCM (Nâng cao)",
        source: "Đại học Mở TP.HCM",
        tags: ["quan_tri_marketing", "chien_luoc_marketing", "4p", "phan_khuc", "dinh_vi"],
        questions: [
          {
            type: "mcq",
            content: "DN A bán sản phẩm với giá 100.000đ, chi phí biến đổi 60.000đ/sp, chi phí cố định 200tr/kỳ. Tỷ lệ đóng góp (contribution margin ratio) là 40%. Nếu DN giảm giá 10% để tăng sản lượng, sản lượng cần tăng tối thiểu bao nhiêu % để giữ nguyên lợi nhuận?",
            options: ["25%", "30%", "20%", "15%"],
            correctAnswer: "25%",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "Chiến lược giá 'hớt váng' (cream skimming) phù hợp khi:",
            options: [
              "Sản phẩm大众化, cạnh tranh gay gắt về giá",
              "Sản phẩm mới, độc quyền, công nghệ cao, khách hàng nhạy cảm về chất lượng hơn giá",
              "Thị trường bão hòa, sản phẩm cuối chu kỳ sống",
              "Doanh nghiệp muốn nhanh chóng giành thị phần",
            ],
            correctAnswer: "Sản phẩm mới, độc quyền, công nghệ cao, khách hàng nhạy cảm về chất lượng hơn giá",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Phân tích PESTEL: DN B đang xem xét thâm nhập thị trường Đông Nam Á. Yếu tố nào KHÔNG thuộc PESTEL?",
            options: [
              "Chính sách thương mại tự do của ASEAN (Political)",
              "Tăng trưởng GDP khu vực (Economic)",
              "Số lượng đối thủ cạnh tranh trong ngành (Rivalry)",
              "Tỷ lệ tiếp cận internet (Technological)",
            ],
            correctAnswer: "Số lượng đối thủ cạnh tranh trong ngành (Rivalry)",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "Vòng đời sản phẩm: Sản phẩm ở giai đoạn 'tăng trưởng' (growth). Chiến lược marketing mix ĐÚNG là:",
            options: [
              "Giá cao, phân phối hạn chế, quảng cáo tạo nhận biết",
              "Giá duy trì hoặc giảm nhẹ, mở rộng kênh phân phối, quảng cáo tạo sự ưa thích",
              "Giá giảm mạnh, rút dần kênh phân phối, cắt giảm quảng cáo",
              "Giá thấp nhất, phân phối đại trà, khuyến mãi mạnh",
            ],
            correctAnswer: "Giá duy trì hoặc giảm nhẹ, mở rộng kênh phân phối, quảng cáo tạo sự ưa thích",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "STP trong marketing bao gồm 3 bước:",
            options: [
              "Segmentation, Targeting, Positioning",
              "Strategy, Tactics, Planning",
              "Survey, Test, Promote",
              "Segment, Trend, Price",
            ],
            correctAnswer: "Segmentation, Targeting, Positioning",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Ma trận Ansoff: DN hiện có sản phẩm A bán trên thị trường hiện tại. DN phát triển sản phẩm B mới bán trên thị trường hiện tại. Đây là chiến lược:",
            options: [
              "Thâm nhập thị trường (market penetration)",
              "Phát triển sản phẩm (product development)",
              "Phát triển thị trường (market development)",
              "Đa dạng hóa (diversification)",
            ],
            correctAnswer: "Phát triển sản phẩm (product development)",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "Customer Lifetime Value (CLV): Khách hàng trung bình chi tiêu 2tr/năm, tỷ lệ giữ chân 80%, chi phí phục vụ 500.000đ/năm, chi phí thu hút 1tr. Giả sử vô hạn năm, lãi suất chiết khấu 10%. CLV là:",
            options: ["12 triệu", "15 triệu", "10 triệu", "8 triệu"],
            correctAnswer: "12 triệu",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "Kênh phân phối đa kênh (omnichannel) khác đa kênh (multichannel) ở điểm:",
            options: [
              "Omnichannel tích hợp trải nghiệm khách hàng xuyên suốt trên tất cả kênh, multichannel chỉ có nhiều kênh riêng biệt",
              "Omnichannel chỉ bán online, multichannel bán cả online và offline",
              "Không có khác biệt",
              "Omnichannel chỉ dành cho doanh nghiệp lớn",
            ],
            correctAnswer: "Omnichannel tích hợp trải nghiệm khách hàng xuyên suốt trên tất cả kênh, multichannel chỉ có nhiều kênh riêng biệt",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Marketing dịch vụ: Đặc điểm 'tính không thể lưu trữ' (perishability) của dịch vụ nghĩa là:",
            options: [
              "Dịch vụ không thể lưu kho để bán sau, công suất không sử dụng sẽ mất",
              "Dịch vụ không thể đo lường chất lượng",
              "Dịch vụ không thể vận chuyển",
              "Dịch vụ luôn đồng nhất",
            ],
            correctAnswer: "Dịch vụ không thể lưu kho để bán sau, công suất không sử dụng sẽ mất",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "Thương hiệu số (digital brand): Chỉ số NPS (Net Promoter Score) đo lường:",
            options: [
              "Tỷ lệ khách hàng quay lại mua hàng",
              "Mức độ khách hàng sẵn sàng giới thiệu thương hiệu cho người khác (trừ đi tỷ lệ chỉ trích)",
              "Tổng doanh thu từ khách hàng mới",
              "Số lượng người theo dõi trên mạng xã hội",
            ],
            correctAnswer: "Mức độ khách hàng sẵn sàng giới thiệu thương hiệu cho người khác (trừ đi tỷ lệ chỉ trích)",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "Chiến lược 'cá nhân hóa' (personalization) trong marketing số:",
            options: [
              "Gửi cùng một thông điệp đến tất cả khách hàng",
              "Tùy chỉnh nội dung, ưu đãi, trải nghiệm cho từng khách hàng dựa trên dữ liệu hành vi",
              "Chỉ phân khúc theo độ tuổi và giới tính",
              "Không sử dụng dữ liệu khách hàng",
            ],
            correctAnswer: "Tùy chỉnh nội dung, ưu đãi, trải nghiệm cho từng khách hàng dựa trên dữ liệu hành vi",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "Mô hình 7P trong marketing dịch vụ thêm 3P nào vào 4P truyền thống?",
            options: [
              "People, Process, Physical evidence",
              "Price, Product, Place, Promotion",
              "Profit, Partnership, Positioning",
              "Purpose, People, Performance",
            ],
            correctAnswer: "People, Process, Physical evidence",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "DN C là thương hiệu mỹ phẩm thiên nhiên tại Việt Nam. DN muốn thâm nhập phân khúc thị trường 'gen Z' (18-25 tuổi).\n\nYêu cầu: Xây dựng chiến lược STP (Segmentation, Targeting, Positioning) cho DN C. Nêu cụ thể tiêu thức phân khúc, chiến lược targeting, và tuyên bố định vị.",
            correctAnswer: "**Segmentation (Phân khúc):**\n- Nhân khẩu học: 18-25 tuổi, sinh viên/mới đi làm, thu nhập trung bình-thấp\n- Tâm lý: Quan tâm môi trường, thích sản phẩm thiên nhiên, ưa chuộng hình ảnh đẹp trên MXH\n- Hành vi: Mua qua e-commerce (Shopee, TikTok Shop), bị ảnh hưởng bởi KOL/influencer\n\n**Targeting:**\n- Chiến lược tập trung (concentrated marketing) vào phân khúc gen Z nữ, quan tâm làm đẹp thiên nhiên\n- Lý do: Nhu cầu cao, dễ tiếp cận qua MXH, sẵn sàng thử sản phẩm mới\n\n**Positioning:**\n- Tuyên bố định vị: 'Mỹ phẩm thiên nhiên cho gen Z — An toàn cho da, thân thiện môi trường, đẹp tự nhiên'\n- Điểm khác biệt: 100% thành phần thiên nhiên, bao bì tái chế, giá phù hợp sinh viên\n- Hình ảnh: Trẻ trung, năng động, có trách nhiệm xã hội",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "Phân tích tác động của thương mại điện tử (e-commerce) và mạng xã hội đến chiến lược marketing mix (4P) của doanh nghiệp bán lẻ tiêu dùng nhanh (FMCG) tại Việt Nam.",
            correctAnswer: "**Tác động e-commerce và MXH đến 4P:**\n\n**1. Product (Sản phẩm):**\n- Đóng gói nhỏ hơn, phù hợp mua online (travel size, mini)\n- Sản phẩm phiên bản giới hạn cho chiến dịch MXH\n- Đóng gói đẹp để unboxing, tạo viral content\n\n**2. Price (Giá):**\n- Flash sale, mã giảm giá trên sàn e-commerce\n- Giá khác nhau giữa online và offline (channel conflict)\n- Bundling, freeship threshold để tăng giá trị đơn hàng\n\n**3. Place (Phân phối):**\n- Sàn e-commerce (Shopee, Lazada, TikTok Shop) trở thành kênh chính\n- Livestream selling — kênh phân phối trực tiếp mới\n- D2C (direct-to-consumer) qua website/app riêng\n\n**4. Promotion (Truyền thông):**\n- Influencer marketing (KOL, KOC) thay thế quảng cáo truyền thống\n- User-generated content (UGC) — khách hàng tự tạo nội dung\n- Livestream tương tác real-time\n- Retargeting ads dựa trên hành vi duyệt web\n\n**Kết luận:** E-commerce và MXH thay đổi căn bản cách FMCG tiếp cận, tương tác và bán hàng. DN cần tích hợp omnichannel để tối ưu hóa.",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "DN D bán sản phẩm công nghệ cao với giá 5.000.000đ/sp. Chi phí biến đổi 3.000.000đ/sp. Chi phí cố định 400.000.000đ/kỳ. Hiện bán 500 sp/kỳ.\n\nDN xem xét 2 phương án:\n- **Phương án 1:** Giảm giá 10%, dự kiến sản lượng tăng 30%\n- **Phương án 2:** Tăng chi phí quảng cáo 100tr, giữ nguyên giá, dự kiến sản lượng tăng 20%\n\nYêu cầu: Tính lợi nhuận mỗi phương án và chọn phương án tối ưu.",
            correctAnswer: "**Hiện tại:**\n- Doanh thu = 500 × 5.000.000 = 2.500tr\n- Biến phí = 500 × 3.000.000 = 1.500tr\n- LN = 2.500 - 1.500 - 400 = **600tr**\n\n**Phương án 1 (giảm giá 10%, sl tăng 30%):**\n- Giá mới = 5.000.000 × 0.9 = 4.500.000đ\n- Sản lượng = 500 × 1.3 = 650 sp\n- Doanh thu = 650 × 4.500.000 = 2.925tr\n- Biến phí = 650 × 3.000.000 = 1.950tr\n- LN = 2.925 - 1.950 - 400 = **575tr**\n\n**Phương án 2 (tăng QC 100tr, sl tăng 20%):**\n- Sản lượng = 500 × 1.2 = 600 sp\n- Doanh thu = 600 × 5.000.000 = 3.000tr\n- Biến phí = 600 × 3.000.000 = 1.800tr\n- Định phí + QC = 400 + 100 = 500tr\n- LN = 3.000 - 1.800 - 500 = **700tr**\n\n**Chọn Phương án 2** vì LN(700tr) > LN hiện tại(600tr) > LN phương án 1(575tr). Tăng quảng cáo hiệu quả hơn giảm giá.",
            orderIndex: 14,
          },
        ],
      },
      {
        title: "Quản trị Chiến lược – UEL (Nâng cao)",
        source: "Đại học Kinh tế – Luật (UEL)",
        tags: ["quan_tri_chien_luoc", "swot", "porter", "bcg", "ansoff"],
        questions: [
          {
            type: "mcq",
            content: "Phân tích 5 lực lượng Porter: Ngành có rào cản gia nhập THẤP, sản phẩm thay thế NHIỀU, quyền lực người mua CAO. Khả năng sinh lời của ngành này là:",
            options: [
              "Cao — ít cạnh tranh",
              "Thấp — cạnh tranh gay gắt, biên lợi nhuận mỏng",
              "Trung bình — cân bằng các lực lượng",
              "Không thể xác định",
            ],
            correctAnswer: "Thấp — cạnh tranh gay gắt, biên lợi nhuận mỏng",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "Ma trận BCG: Sản phẩm có thị phần tương đối 0.3, tốc độ tăng trưởng thị trường 15%/năm. Sản phẩm này thuộc nhóm:",
            options: ["Ngôi sao (Star)", "Dấu hỏi (Question Mark)", "Bò sữa (Cash Cow)", "Chó (Dog)"],
            correctAnswer: "Dấu hỏi (Question Mark)",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Chiến lược cạnh tranh toàn cầu 'chi phí thấp nhất' (global cost leadership) đòi hỏi:",
            options: [
              "Tùy biến sản phẩm cho từng thị trường địa phương",
              "Tiêu chuẩn hóa sản phẩm, sản xuất quy mô lớn tại địa điểm có chi phí thấp nhất",
              "Tập trung vào một phân khúc cao cấp",
              "Đa dạng hóa sản phẩm ở nhiều ngành",
            ],
            correctAnswer: "Tiêu chuẩn hóa sản phẩm, sản xuất quy mô lớn tại địa điểm có chi phí thấp nhất",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "Chiến lược hội nhập ngang (horizontal integration) là:",
            options: [
              "Mua lại nhà cung cấp nguyên vật liệu",
              "Mua lại đối thủ cạnh tranh cùng ngành để tăng thị phần",
              "Mua lại kênh phân phối",
              "Đa dạng hóa sang ngành mới",
            ],
            correctAnswer: "Mua lại đối thủ cạnh tranh cùng ngành để tăng thị phần",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "Ma trận GE/McKinsey đánh giá business unit theo:",
            options: [
              "Thị phần tương đối và tốc độ tăng trưởng (như BCG)",
              "Sức hấp dẫn ngành và năng lực cạnh tranh của doanh nghiệp (mỗi chiều 3 mức: cao/trung bình/thấp)",
              "Chi phí và doanh thu",
              "Số lượng nhân viên và năng suất",
            ],
            correctAnswer: "Sức hấp dẫn ngành và năng lực cạnh tranh của doanh nghiệp (mỗi chiều 3 mức: cao/trung bình/thấp)",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Chiến lược 'xanh' (green strategy) tạo lợi thế cạnh tranh khi:",
            options: [
              "Khách hàng không quan tâm đến môi trường",
              "Khách hàng sẵn sàng trả giá cao hơn cho sản phẩm thân thiện môi trường và DN có năng lực xanh vượt trội",
              "DN chỉ cần quảng cáo xanh mà không cần thực chất",
              "Chính phủ không có quy định môi trường",
            ],
            correctAnswer: "Khách hàng sẵn sàng trả giá cao hơn cho sản phẩm thân thiện môi trường và DN có năng lực xanh vượt trội",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "Chiến lược 'Blue Ocean' (Kim & Mauborgne) khuyến nghị:",
            options: [
              "Cạnh tranh gay gắt trong ngành hiện tại để giành thị phần",
              "Tạo thị trường mới không có cạnh tranh, giá trị đổi mới cho khách hàng",
              "Mua lại tất cả đối thủ để độc quyền",
              "Giảm giá đến mức đối thủ không theo kịp",
            ],
            correctAnswer: "Tạo thị trường mới không có cạnh tranh, giá trị đổi mới cho khách hàng",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "Năng lực cốt lõi (core competency) theo Prahalad & Hamel có 3 đặc điểm:",
            options: [
              "Cung cấp quyền truy cập nhiều thị trường, đóng góp đáng kể vào giá trị khách hàng, khó bắt chước",
              "Sản phẩm tốt nhất, giá thấp nhất, phân phối rộng nhất",
              "Nhiều nhân viên, nhiều nhà máy, nhiều sản phẩm",
              "Công nghệ tiên tiến, thương hiệu nổi tiếng, vốn lớn",
            ],
            correctAnswer: "Cung cấp quyền truy cập nhiều thị trường, đóng góp đáng kể vào giá trị khách hàng, khó bắt chước",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Chiến lược liên minh chiến lược (strategic alliance) so với sáp nhập (M&A) khác ở điểm:",
            options: [
              "Liên minh giữ độc lập của các bên, M&A hợp nhất thành một thực thể",
              "Liên minh luôn hiệu quả hơn M&A",
              "Không có khác biệt",
              "M&A giữ độc lập, liên minh hợp nhất",
            ],
            correctAnswer: "Liên minh giữ độc lập của các bên, M&A hợp nhất thành một thực thể",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "Tầm nhìn (vision) khác sứ mệnh (mission) ở điểm:",
            options: [
              "Tầm nhìn trả lời 'DN muốn trở thành gì trong tương lai', sứ mệnh trả lời 'DN tồn tại để làm gì hiện tại'",
              "Tầm nhìn và sứ mệnh giống nhau",
              "Tầm nhìn ngắn hạn, sứ mệnh dài hạn",
              "Tầm nhìn chỉ cho cổ đông, sứ mệnh cho nhân viên",
            ],
            correctAnswer: "Tầm nhìn trả lời 'DN muốn trở thành gì trong tương lai', sứ mệnh trả lời 'DN tồn tại để làm gì hiện tại'",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "Chiến lược 'đổi mới gián đoạn' (disruptive innovation) của Christensen xảy ra khi:",
            options: [
              "DN lớn cải tiến sản phẩm hiện tại để phục vụ khách hàng cao cấp hơn",
              "DN nhỏ tạo sản phẩm đơn giản hơn, rẻ hơn, phục vụ phân khúc thấp rồi dần dần thay thế DN lớn",
              "DN lớn mua lại tất cả đối thủ",
              "DN thay đổi logo và bao bì",
            ],
            correctAnswer: "DN nhỏ tạo sản phẩm đơn giản hơn, rẻ hơn, phục vụ phân khúc thấp rồi dần dần thay thế DN lớn",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "Balanced Scorecard (BSC) đo lường hiệu quả chiến lược qua 4 khía cạnh:",
            options: [
              "Tài chính, Khách hàng, Quy trình nội bộ, Học hỏi & phát triển",
              "Doanh thu, Lợi nhuận, Chi phí, Thuế",
              "Marketing, Sales, Sản xuất, Nhân sự",
              "Sản phẩm, Giá, Phân phối, Truyền thông",
            ],
            correctAnswer: "Tài chính, Khách hàng, Quy trình nội bộ, Học hỏi & phát triển",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "Phân tích chiến lược cạnh tranh của VinFast trong ngành ô tô tại Việt Nam, sử dụng mô hình 5 lực lượng Porter và chiến lược cạnh tranh tổng quát của Porter.",
            correctAnswer: "**5 lực lượng Porter cho VinFast:**\n\n1. **Cạnh tranh nội ngành: CAO** — Toyota, Hyundai, Kia, Honda, Mitsubishi đã có chỗ đứng vững chắc, mạng lưới đại lý rộng\n2. **Nguy cơ gia nhập mới: TRUNG BÌNH** — Rào cản vốn lớn, nhưng VinFast đã gia nhập được nhờ hậu thuẫn Vingroup\n3. **Quyền lực nhà cung cấp: TRUNG BÌNH** — VinFast tự sản xuất nhiều linh kiện, nhưng vẫn phụ thuộc pin, chip\n4. **Quyền lực người mua: CAO** — Nhiều lựa chọn, dễ so sánh, nhạy cảm giá\n5. **Sản phẩm thay thế: CAO** — Xe máy, xe điện 2 bánh, giao thông công cộng, Grab\n\n**Chiến lược cạnh tranh tổng quát:**\nVinFast chọn **chiến lược khác biệt hóa (differentiation)**:\n- Xe điện thông minh, công nghệ pin thuê (khác biệt hoàn toàn)\n- Thiết kế Pininfarina (Italy) — thẩm mỹ cao\n- Hệ sinh thái Vingroup (VinHomes, Vincom) — trải nghiệm liền mạch\n- Bảo hành dài hạn, dịch vụ hậu mãi vượt trội\n- Tài trợ sự kiện toàn cầu (APEC, G20) — xây dựng thương hiệu quốc tế",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "DN E là startup công nghệ fintech tại Việt Nam. Xây dựng phân tích SWOT và đề xuất 2 chiến lược (SO và WT) cho DN E.",
            correctAnswer: "**SWOT cho DN E (Fintech startup VN):**\n\n**Strengths:**\n- Công nghệ mới, nền tảng linh hoạt\n- Đội ngũ trẻ, năng động, am hiểu công nghệ\n- Chi phí vận hành thấp hơn ngân hàng truyền thống\n\n**Weaknesses:**\n- Thiếu vốn, phụ thuộc gọi vốn\n- Thiếu uy tín thương hiệu so với ngân hàng\n- Dữ liệu khách hàng hạn chế\n\n**Opportunities:**\n- Thanh toán không tiền mặt tăng nhanh\n- Chính phủ hỗ trợ fintech (sandbox)\n- 70% người trưởng thành chưa tiếp cận dịch vụ tài chính đầy đủ\n\n**Threats:**\n- Cạnh tranh từ ngân hàng số (MB Bank, Techcombank)\n- Quy định pháp lý chưa hoàn thiện\n- Rủi ro an ninh mạng\n\n**Chiến lược SO (Strengths-Opportunities):**\n- Sử dụng công nghệ linh hoạt để phát triển sản phẩm thanh toán cho phân khúc chưa tiếp cận ngân hàng\n- Tận dụng xu hướng không tiền mặt để mở rộng nhanh\n\n**Chiến lược WT (Weaknesses-Threats):**\n- Hợp tác với ngân hàng truyền thống để tận dụng uy tín và dữ liệu khách hàng\n- Đầu tư mạnh vào bảo mật, tuân thủ pháp lý để giảm rủi ro",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "So sánh 3 chiến lược cạnh tranh tổng quát của Porter (dẫn đạo chi phí, khác biệt hóa, tập trung). Phân tích rủi ro của mỗi chiến lược và nêu ví dụ doanh nghiệp Việt Nam áp dụng.",
            correctAnswer: "**1. Dẫn đạo chi phí (Cost Leadership):**\n- Tạo ra sản phẩm với chi phí thấp nhất trong ngành\n- **Rủi ro:** Bị vượt qua về công nghệ, thay đổi thị hiếu sang chất lượng cao, cạnh tranh giá từ nước ngoài\n- **Ví dụ VN:** Viettel — chi phí vận hành thấp nhất ngành viễn thông, giá cước rẻ nhất\n\n**2. Khác biệt hóa (Differentiation):**\n- Tạo sản phẩm độc đáo, khác biệt, được khách hàng đánh giá cao\n- **Rủi ro:** Khách hàng không chấp nhận giá cao, đối thủ bắt chước điểm khác biệt, chi phí khác biệt hóa quá cao\n- **Ví dụ VN:** VinFast — xe điện thông minh, thiết kế Italy, hệ sinh thái Vingroup\n\n**3. Tập trung (Focus):**\n- Tập trung vào phân khúc hẹp, cạnh tranh bằng chi phí thấp hoặc khác biệt hóa trong phân khúc đó\n- **Rủi ro:** Phân khúc bị thu hẹp, đối thủ lớn tìm thấy phân khúc hấp dẫn và gia nhập, chi phí phục vụ phân khúc tăng\n- **Ví dụ VN:** The Coffee House — tập trung phân khúc trung lưu trẻ, không gian làm việc, cà phê chất lượng cao\n\n**Kết luận:** Mỗi chiến lược có rủi ro riêng. DN cần chọn chiến lược phù hợp với năng lực cốt lõi và điều kiện thị trường, đồng thời liên tục đổi mới để duy trì lợi thế.",
            orderIndex: 14,
          },
        ],
      },
      {
        title: "Quản trị Nguồn nhân lực – ĐH Kinh tế Đà Nẵng (Nâng cao)",
        source: "Đại học Kinh tế Đà Nẵng",
        tags: ["quan_tri_nhan_su", "tuyen_dung", "dao_tao", "luong_thuong", "hieu_suat"],
        questions: [
          {
            type: "mcq",
            content: "Mô hình 4 chức năng quản trị nhân sự của Dessler bao gồm:",
            options: [
              "Tuyển dụng, Đào tạo, Trả công, Duy trì",
              "Marketing, Tài chính, Sản xuất, Nhân sự",
              "Kế hoạch, Tổ chức, Lãnh đạo, Kiểm tra",
              "Tuyển dụng, Sa thải, Kỷ luật, Thanh tra",
            ],
            correctAnswer: "Tuyển dụng, Đào tạo, Trả công, Duy trì",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "Phân tích công việc (job analysis) cung cấp thông tin cho:",
            options: [
              "Chỉ để tuyển dụng",
              "Basis cho bản mô tả công việc (job description) và tiêu chuẩn công việc (job specification)",
              "Chỉ để tính lương",
              "Chỉ để đánh giá hiệu suất",
            ],
            correctAnswer: "Basis cho bản mô tả công việc (job description) và tiêu chuẩn công việc (job specification)",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Phương pháp đánh giá hiệu suất 360 độ (360-degree feedback) thu thập đánh giá từ:",
            options: [
              "Chỉ từ cấp trên trực tiếp",
              "Cấp trên, cấp dưới, đồng nghiệp, khách hàng, và tự đánh giá",
              "Chỉ từ phòng nhân sự",
              "Chỉ từ khách hàng",
            ],
            correctAnswer: "Cấp trên, cấp dưới, đồng nghiệp, khách hàng, và tự đánh giá",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "Thuyết kỳ vọng của Vroom (Expectancy Theory): Động lực = Khả năng × Kỳ vọng × Giá trị phần thưởng. Nếu nhân viên tin rằng nỗ lực không dẫn đến kết quả (kỳ vọng = 0), động lực sẽ là:",
            options: ["0", "Tối đa", "Trung bình", "Phụ thuộc phần thưởng"],
            correctAnswer: "0",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "Lương 3P (3P compensation) bao gồm:",
            options: [
              "Position (lương theo vị trí), Person (lương theo năng lực), Performance (lương theo hiệu suất)",
              "Price, Product, Place",
              "Pay, Promote, Pension",
              "Plan, Process, People",
            ],
            correctAnswer: "Position (lương theo vị trí), Person (lương theo năng lực), Performance (lương theo hiệu suất)",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Tỷ lệ nghỉ việc (turnover rate) của DN F: Đầu năm 200 nhân viên, cuối năm 180, tuyển mới 30, nghỉ việc 50. Tỷ lệ nghỉ việc là:",
            options: ["25%", "15%", "10%", "20%"],
            correctAnswer: "25%",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "Chi phí thay thế một nhân viên cấp trung ước tính bao gồm:",
            options: [
              "Chỉ chi phí tuyển dụng",
              "Chi phí tuyển dụng + đào tạo + giảm năng suất trong thời gian thích nghi + chi phí overtime của nhân viên khác",
              "Chỉ lương tháng đầu",
              "Không có chi phí đáng kể",
            ],
            correctAnswer: "Chi phí tuyển dụng + đào tạo + giảm năng suất trong thời gian thích nghi + chi phí overtime của nhân viên khác",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "Mô hình Maslow: Theo thứ tự từ thấp đến cao, 5 nhu cầu là:",
            options: [
              "Sinh lý → An toàn → Xã hội → Tôn trọng → Tự thể hiện",
              "An toàn → Sinh lý → Tôn trọng → Xã hội → Tự thể hiện",
              "Tự thể hiện → Tôn trọng → Xã hội → An toàn → Sinh lý",
              "Xã hội → Sinh lý → An toàn → Tự thể hiện → Tôn trọng",
            ],
            correctAnswer: "Sinh lý → An toàn → Xã hội → Tôn trọng → Tự thể hiện",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Đào tạo theo phương pháp 'on-the-job training' (OJT) có đặc điểm:",
            options: [
              "Nhân viên học lý thuyết trong lớp, không thực hành",
              "Nhân viên học qua thực tế công việc dưới hướng dẫn của người có kinh nghiệm",
              "Chỉ áp dụng cho nhân viên cấp cao",
              "Không cần đánh giá hiệu quả",
            ],
            correctAnswer: "Nhân viên học qua thực tế công việc dưới hướng dẫn của người có kinh nghiệm",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "Employee Engagement (sự gắn kết nhân viên) khác sự hài lòng (job satisfaction) ở điểm:",
            options: [
              "Hài lòng chỉ là cảm xúc, engagement bao gồm cam kết hành động và nỗ lực tự nguyện vượt mức yêu cầu",
              "Hai khái niệm giống nhau",
              "Engagement chỉ quan tâm đến lương",
              "Hài lòng cao hơn engagement",
            ],
            correctAnswer: "Hài lòng chỉ là cảm xúc, engagement bao gồm cam kết hành động và nỗ lực tự nguyện vượt mức yêu cầu",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "Quản trị đa dạng (diversity management) trong nhân sự mang lại lợi ích:",
            options: [
              "Giảm chi phí nhân sự",
              "Tăng sáng tạo, đa góc nhìn, phù hợp thị trường đa dạng, thu hút nhân tài",
              "Chỉ để tuân thủ pháp luật",
              "Giảm năng suất do xung đột",
            ],
            correctAnswer: "Tăng sáng tạo, đa góc nhìn, phù hợp thị trường đa dạng, thu hút nhân tài",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "Phương pháp phỏng vấn hành vi (behavioral interview) dựa trên nguyên tắc:",
            options: [
              "Hỏi câu hỏi tình huống giả định để xem ứng viên sẽ làm gì",
              "Hành vi quá khứ là dự báo tốt nhất cho hành vi tương lai — hỏi về tình huống thực tế đã xảy ra",
              "Chỉ hỏi về sở thích và tính cách",
              "Đặt câu hỏi trick để thử thách ứng viên",
            ],
            correctAnswer: "Hành vi quá khứ là dự báo tốt nhất cho hành vi tương lai — hỏi về tình huống thực tế đã xảy ra",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "DN G có 500 nhân viên, tỷ lệ nghỉ việc 25%/năm (cao hơn mức trung bình ngành 15%). Chi phí thay thế mỗi nhân viên ước tính 50 triệu (tuyển dụng + đào tạo + giảm năng suất).\n\nYêu cầu:\n1. Tính tổng chi phí nghỉ việc hàng năm.\n2. Đề xuất 5 biện pháp giảm tỷ lệ nghỉ việc, kèm chi phí ước tính cho mỗi biện pháp.",
            correctAnswer: "**1. Tổng chi phí nghỉ việc:**\n- Số nhân viên nghỉ = 500 × 25% = 125 người/năm\n- Tổng chi phí = 125 × 50.000.000 = **6.250.000.000đ (6.25 tỷ/năm)**\n\n**2. 5 biện pháp giảm tỷ lệ nghỉ việc:**\n\na) **Tăng lương cạnh tranh (1 tỷ/năm)** — Đánh giá lại hệ thống lương, điều chỉnh theo thị trường. Chi phí tăng lương nhưng giảm chi phí thay thế.\n\nb) **Chương trình phát triển sự nghiệp (300tr/năm)** — Lộ trình thăng tiến rõ ràng, đào tạo kỹ năng. Nhân viên thấy tương lai → ở lại.\n\nc) **Cải thiện môi trường làm việc (200tr/năm)** — Không gian mở, thiết bị hiện đại, văn hóa cởi mở.\n\nd) **Chính sách work-life balance (100tr/năm)** — Linh hoạt thời gian, remote 2 ngày/tuần, tăng ngày phép.\n\ne) **Khảo sát exit interview & engagement (50tr/năm)** — Phỏng vấn khi nghỉ việc để hiểu nguyên nhân, khảo sát định kỳ để phát hiện sớm.\n\n**Tổng chi phí biện pháp: 1.65 tỷ/năm** — So với chi phí nghỉ việc 6.25 tỷ, đầu tư này có ROI rất cao.",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "So sánh 3 thuyết động lực: Maslow, Herzberg, và Vroom (Expectancy). Phân tích ứng dụng thực tế của mỗi thuyết trong quản trị nhân sự.",
            correctAnswer: "**1. Thuyết Maslow (Tháp nhu cầu):**\n- 5 cấp: Sinh lý → An toàn → Xã hội → Tôn trọng → Tự thể hiện\n- Nhu cầu thấp phải được thỏa mãn trước khi nhu cầu cao xuất hiện\n- **Ứng dụng:** Thiết kế hệ thống lương thưởng + phúc lợi theo từng cấp nhu cầu. Lương cơ bản đáp ứng sinh lý, bảo hiểm đáp ứng an toàn, team building đáp ứng xã hội, công nhận thành tích đáp ứng tôn trọng, giao quyền đáp ứng tự thể hiện.\n\n**2. Thuyết Herzberg (Hai yếu tố):**\n- Yếu tố duy trì (hygiene): Lương, điều kiện làm việc, chính sách công ty — thiếu thì bất mãn, đủ thì không bất mãn nhưng không động lực\n- Yếu tố động lực (motivators): Thành tựu, công nhận, bản thân công việc, trách nhiệm, thăng tiến — tạo động lực thực sự\n- **Ứng dụng:** Trả lương đủ để không bất mãn, nhưng tập trung vào giao trách nhiệm, công nhận thành tích, tạo cơ hội thăng tiến để tạo động lực.\n\n**3. Thuyết Vroom (Kỳ vọng):**\n- Động lực = Khả năng (Expectancy) × Kỳ vọng (Instrumentality) × Giá trị (Valence)\n- Nhân viên sẽ nỗ lực nếu tin rằng: nỗ lực → kết quả → phần thưởng → phần thưởng có giá trị\n- **Ứng dụng:** Đảm bảo mục tiêu khả thi, liên kết rõ ràng giữa kết quả và phần thưởng, phần thưởng phù hợp nhu cầu nhân viên.\n\n**Kết luận:** Mỗi thuyết bổ sung cho nhau. Maslow cho bức tranh tổng thể, Herzberg phân biệt duy trì/động lực, Vroom cho công thức tính động lực cụ thể.",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "DN H chuyển đổi sang mô hình làm việc hybrid (3 ngày văn phòng + 2 ngày remote). Phân tích tác động đến quản trị nhân sự: tuyển dụng, đánh giá hiệu suất, văn hóa doanh nghiệp, và đề xuất chính sách triển khai.",
            correctAnswer: "**Tác động đến quản trị nhân sự:**\n\n**1. Tuyển dụng:**\n- Thu hút nhân tài rộng hơn (không giới hạn địa lý)\n- Cần đánh giá kỹ năng tự quản lý, giao tiếp online\n- Phỏng vấn online trở thành chuẩn\n\n**2. Đánh giá hiệu suất:**\n- Chuyển từ đánh giá theo thời gian presence sang đánh giá theo kết quả (output-based)\n- Cần MBO (Management by Objectives) rõ ràng, OKR định kỳ\n- Khó đánh giá soft skills, đóng góp nhóm\n\n**3. Văn hóa doanh nghiệp:**\n- Rủi ro mất gắn kết, nhân viên cảm thấy cô lập\n- Cần đầu tư team building định kỳ, không gian virtual\n- Văn hóa giao tiếp minh bạch, tài liệu hóa\n\n**Đề xuất chính sách triển khai:**\n\na) **Chính sách hybrid rõ ràng:** 3 ngày onsite (Tue-Thu) cho họp nhóm, 2 ngày remote (Mon, Fri) cho tập trung cá nhân\n\nb) **Đánh giá theo OKR:** Mỗi nhân viên có 3-5 objectives/quý, đánh giá theo kết quả không theo giờ ngồi\n\nc) **Đầu tư công cụ:** Slack/Teams, Notion, Zoom, Miro — đảm bảo tương tác mượt mà\n\nd) **Văn phòng linh hoạt:** Hot desk, không gian họp nhóm, khu tập trung — văn phòng trở thành nơi hợp tác thay vì nơi ngồi 8 tiếng\n\ne) **Check-in định kỳ:** 1-on-1 hàng tuần với quản lý, town hall hàng tháng, offsite hàng quý",
            orderIndex: 14,
          },
        ],
      },
      {
        title: "Hành vi Người tiêu dùng – RMIT (Nâng cao)",
        source: "RMIT University Vietnam",
        tags: ["hanh_vi_nguoi_tieu_dung", "tam_ly_hoc", "quyet_dinh_mua", "thuong_hieu", "khanh_hang"],
        questions: [
          {
            type: "mcq",
            content: "Mô hình quá trình quyết định mua của người tiêu dùng gồm 5 bước:",
            options: [
              "Nhận biết nhu cầu → Tìm kiếm thông tin → Đánh giá phương án → Quyết định mua → Hành vi sau mua",
              "Xem quảng cáo → Đến cửa hàng → Mua → Dùng → Đánh giá",
              "Tìm kiếm → So sánh giá → Mua → Trả hàng → Phàn nàn",
              "Nhu cầu → Mua → Dùng → Hỏi bạn → Mua lại",
            ],
            correctAnswer: "Nhận biết nhu cầu → Tìm kiếm thông tin → Đánh giá phương án → Quyết định mua → Hành vi sau mua",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "Dissonance cognitive (Bất hòa nhận thức) sau mua xảy ra khi:",
            options: [
              "Khách hàng hoàn toàn hài lòng với sản phẩm",
              "Khách hàng cảm thấy hối tiếc, nghi ngờ quyết định mua sau khi đã mua, đặc biệt khi sản phẩm đắt và khó thay đổi",
              "Khách hàng không quan tâm đến sản phẩm",
              "Khách hàng muốn mua thêm sản phẩm khác",
            ],
            correctAnswer: "Khách hàng cảm thấy hối tiếc, nghi ngờ quyết định mua sau khi đã mua, đặc biệt khi sản phẩm đắt và khó thay đổi",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Thuyết hành vi có kế hoạch (Theory of Planned Behavior - Ajzen) cho rằng ý định hành vi phụ thuộc:",
            options: [
              "Thái độ với hành vi, Chuẩn chủ quan, Kiểm soát hành vi cảm nhận",
              "Chỉ thái độ với sản phẩm",
              "Chỉ giá sản phẩm",
              "Chỉ quảng cáo",
            ],
            correctAnswer: "Thái độ với hành vi, Chuẩn chủ quan, Kiểm soát hành vi cảm nhận",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "Người tiêu dùng Việt Nam có đặc điểm khác biệt so với phương Tây trong quyết định mua:",
            options: [
              "Hoàn toàn giống phương Tây",
              "Chịu ảnh hưởng mạnh hơn bởi nhóm tham khảo (gia đình, bạn bè), quan tâm đến giá và uy tín thương hiệu, mua online qua MXH nhiều hơn",
              "Không quan tâm đến giá",
              "Chỉ mua sản phẩm nội địa",
            ],
            correctAnswer: "Chịu ảnh hưởng mạnh hơn bởi nhóm tham khảo (gia đình, bạn bè), quan tâm đến giá và uy tín thương hiệu, mua online qua MXH nhiều hơn",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "Heuristic 'neo mỏ neo' (anchoring heuristic) trong định giá:",
            options: [
              "Khách hàng so sánh giá với mức giá tham chiếu đầu tiên nhìn thấy (anchor), từ đó đánh giá giá hiện tại rẻ hay đắt",
              "Khách hàng luôn chọn giá thấp nhất",
              "Khách hàng không bị ảnh hưởng bởi thứ tự hiển thị giá",
              "Khách hàng chỉ mua khi giá dưới 100.000đ",
            ],
            correctAnswer: "Khách hàng so sánh giá với mức giá tham chiếu đầu tiên nhìn thấy (anchor), từ đó đánh giá giá hiện tại rẻ hay đắt",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Loyalty ladder (thang lòng trung thành) từ thấp đến cao:",
            options: [
              "Nhận biết → Ưu thích → Mua thử → Mua lại → Trung thành → Ưng hộ",
              "Mua → Trả hàng → Phàn nàn → Bỏ đi",
              "Quảng cáo → Mua → Dùng → Quên",
              "Nhận biết → Mua → Trung thành (chỉ 3 bước)",
            ],
            correctAnswer: "Nhận biết → Ưu thích → Mua thử → Mua lại → Trung thành → Ưng hộ",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "Customer Journey Map (Bản đồ hành trình khách hàng) là công cụ:",
            options: [
              "Bản đồ địa lý cửa hàng",
              "Mô tả tất cả điểm chạm (touchpoints) và trải nghiệm khách hàng từ trước, trong, và sau khi mua",
              "Bản đồ đường đi của shipper",
              "Sơ đồ tổ chức phòng khách hàng",
            ],
            correctAnswer: "Mô tả tất cả điểm chạm (touchpoints) và trải nghiệm khách hàng từ trước, trong, và sau khi mua",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "Thuyết Maslow áp dụng trong marketing: Sản phẩm 'bảo hiểm nhân thọ' đáp ứng nhu cầu cấp:",
            options: [
              "Sinh lý",
              "An toàn",
              "Xã hội",
              "Tự thể hiện",
            ],
            correctAnswer: "An toàn",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Hiệu ứng 'bandwagon' (hiệu ứng đám đông) trong hành vi tiêu dùng:",
            options: [
              "Khách hàng mua vì thấy nhiều người khác cũng mua, sợ bỏ lỡ (FOMO)",
              "Khách hàng mua vì sản phẩm độc đáo, ít người có",
              "Khách hàng không bị ảnh hưởng bởi người khác",
              "Khách hàng chỉ mua khi không ai mua",
            ],
            correctAnswer: "Khách hàng mua vì thấy nhiều người khác cũng mua, sợ bỏ lỡ (FOMO)",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "Phân khúc theo hành vi (behavioral segmentation) bao gồm:",
            options: [
              "Tần suất sử dụng, lòng trung thành, dịp mua, lợi ích tìm kiếm",
              "Độ tuổi, giới tính, thu nhập",
              "Khu vực địa lý, khí hậu",
              "Tính cách, lối sống, giá trị",
            ],
            correctAnswer: "Tần suất sử dụng, lòng trung thành, dịp mua, lợi ích tìm kiếm",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "NPS (Net Promoter Score) = % Promoters - % Detractors. DN I khảo sát 1.000 khách hàng: 600 promoters, 200 passive, 200 detractors. NPS là:",
            options: ["40", "60", "20", "80"],
            correctAnswer: "40",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "Thái độ thương hiệu (brand attitude) được hình thành qua 3 thành phần:",
            options: [
              "Nhận thức (cognition) → Cảm xúc (affect) → Hành vi (conation)",
              "Giá → Chất lượng → Dịch vụ",
              "Quảng cáo → Mua → Dùng",
              "Nhãn hiệu → Bao bì → Sản phẩm",
            ],
            correctAnswer: "Nhận thức (cognition) → Cảm xúc (affect) → Hành vi (conation)",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "Phân tích hành vi người tiêu dùng gen Z Việt Nam khi mua mỹ phẩm trên TikTok Shop. Áp dụng mô hình 5 bước quyết định mua và nêu điểm khác biệt so với mua tại cửa hàng truyền thống.",
            correctAnswer: "**5 bước quyết định mua mỹ phẩm trên TikTok Shop (Gen Z VN):**\n\n**1. Nhận biết nhu cầu:**\n- Kích thích bởi video review, livestream KOL trên TikTok\n- Nhu cầu phát sinh từ 'thấy đẹp → muốn có' thay vì chủ động tìm kiếm\n- FOMO khi thấy trend mỹ phẩm viral\n\n**2. Tìm kiếm thông tin:**\n- Xem thêm video review, comment section trên TikTok\n- Hỏi bạn bè qua group Facebook, Zalo\n- So sánh giá trên Shopee, TikTok Shop\n- Đọc review trên TikTok (UGC) thay vì blog chuyên nghiệp\n\n**3. Đánh giá phương án:**\n- So sánh giá + freeship + quà tặng giữa các shop\n- Đánh giá dựa trên số lượng đã bán, rating, video review thật\n- Ảnh hưởng mạnh bởi KOL/KOC recommend\n\n**4. Quyết định mua:**\n- Mua ngay trong livestream (impulse buying) — flash sale, mã giảm giá giới hạn thời gian\n- Thanh toán qua TikTok Pay, ShopeePay\n- Quyết định nhanh hơn cửa hàng truyền thống\n\n**5. Hành vi sau mua:**\n- Quay video unboxing, review đăng TikTok\n- Tag bạn bè, chia sẻ trải nghiệm\n- Repurchase nếu hài lòng, hoặc review xấu nếu thất vọng\n\n**Khác biệt vs cửa hàng truyền thống:**\n- Nhu cầu kích thích bởi MXH thay vì chủ động\n- Tìm kiếm thông tin qua video UGC thay vì thử trực tiếp\n- Quyết định mua nhanh hơn (impulse), ít cân nhắc hơn\n- Hành vi sau mua công khai hơn (review công cộng)",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "DN J bán sản phẩm điện thoại thông minh. Chi phí sản xuất 8 triệu/sp, giá bán 15 triệu/sp. DN đang xem xét mở rộng sang phân khúc giá rẻ (5-7 triệu) để giành thị phần.\n\nYêu cầu: Phân tích rủi ro thương hiệu (brand dilution) khi mở rộng xuống phân khúc thấp. Đề xuất 2 chiến lược giảm thiểu rủi ro.",
            correctAnswer: "**Rủi ro thương hiệu (brand dilution):**\n\n1. **Giảm giá trị thương hiệu:** Khách hàng cao cấp có thể rời bỏ vì thương hiệu không còn 'đẳng cấp'\n2. **Mất định vị:** Thương hiệu vốn định vị cao cấp, mở rộng xuống thấp làm mờ định vị\n3. **Tự ăn thị phần:** Sản phẩm giá rẻ có thể lấy khách hàng của sản phẩm cao cấp thay vì lấy khách hàng mới\n4. **Chi phí vận hành:** Phải duy trì 2 chuỗi cung ứng, 2 chiến lược marketing\n\n**2 chiến lược giảm thiểu:**\n\n**Chiến lược 1: Thương hiệu con (sub-brand)**\n- Tạo thương hiệu con riêng cho phân khúc thấp (như Toyota → Lexus cao cấp, Toyota Corolla bình dân)\n- Ví dụ: DN J tạo dòng 'J-Lite' với thiết kế khác, bao bì khác, không dùng logo chính\n- Ưu: Bảo vệ thương hiệu chính, rõ ràng phân khúc\n- Nhược: Chi phí xây dựng thương hiệu con\n\n**Chiến lược 2: Đa dạng hóa theo tính năng (feature-based)**\n- Sản phẩm giá rẻ cùng thương hiệu nhưng cắt giảm tính năng cao cấp (camera đơn, màn hình thường, pin nhỏ hơn)\n- Định vị: 'Cùng chất lượng cốt lõi, mức giá phù hợp hơn'\n- Ưu: Tận dụng uy tín thương hiệu chính\n- Nhược: Vẫn có rủi ro giảm giá trị nếu không thực hiện tốt",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "Trình bày mô hình Customer Journey Map cho dịch vụ đặt đồ ăn qua ứng dụng (GrabFood/ShopeeFood). Nêu các touchpoint, cảm xúc khách hàng tại từng giai đoạn, và đề xuất cải thiện trải nghiệm.",
            correctAnswer: "**Customer Journey Map — Đặt đồ ăn qua app:**\n\n**Giai đoạn 1: Trước mua (Awareness & Consideration)**\n- Touchpoint: Quảng cáo app, bạn bè giới thiệu, notification push\n- Cảm xúc: Thèm ăn → tò mò → so sánh app\n- Cải thiện: Gợi ý món ăn dựa trên lịch sử, thời gian trong ngày\n\n**Giai đoạn 2: Tìm kiếm & chọn món (Search & Selection)**\n- Touchpoint: Mở app, tìm kiếm món/quán, xem ảnh, đọc review, so sánh giá\n- Cảm xúc: Hào hứng → choáng ngợp (quá nhiều lựa chọn) → do dự\n- Cải thiện: Filter theo loại món, khoảng cách, rating; gợi ý 'món hot hôm nay'\n\n**Giai đoạn 3: Đặt hàng (Order & Payment)**\n- Touchpoint: Thêm vào giỏ, áp mã giảm giá, chọn thanh toán, xác nhận\n- Cảm xúc: Hài lòng (có mã) → lo lắng (phí ship cao?) → chốt đơn\n- Cải thiện: Hiển thị tổng chi phí rõ ràng (giá + ship + phí), gợi ý mã phù hợp\n\n**Giai đoạn 4: Chờ giao hàng (Waiting)**\n- Touchpoint: Theo dõi đơn, thông báo trạng thái, chat với shipper\n- Cảm xúc: Mong ngóng → sốt ruột (giao chậm) → thất vọng hoặc hài lòng\n- Cải thiện: Real-time tracking, ETA chính xác, thông báo mỗi bước\n\n**Giai đoạn 5: Nhận & dùng (Delivery & Consumption)**\n- Touchpoint: Shipper giao hàng, mở hộp, ăn\n- Cảm xúc: Hào hứng → đánh giá chất lượng món → hài lòng/thất vọng\n- Cải thiện: Đóng gói giữ nhiệt, nguyên liệu kèm theo (tăm, khăn, sốt)\n\n**Giai đoạn 6: Sau mua (Post-purchase)**\n- Touchpoint: Đánh giá quán + shipper, nhận voucher tiếp theo, chia sẻ MXH\n- Cảm xúc: Hài lòng → muốn đặt lại HOẶC thất vọng → phàn nàn\n- Cải thiện: Yêu cầu review nhanh (1 chạm), voucher cảm ơn, xử lý khiếu nại nhanh",
            orderIndex: 14,
          },
        ],
      },
      {
        title: "Quản trị Dự án – NEU (Nâng cao)",
        source: "Đại học Kinh tế Quốc dân",
        tags: ["quan_tri_du_an", "pert", "gantt", "rui_ro_du_an", "agile"],
        questions: [
          {
            type: "mcq",
            content: "Tam giác quản trị dự án (Project Management Triangle) bao gồm 3 ràng buộc:",
            options: [
              "Phạm vi (scope), Thời gian (time), Chi phí (cost)",
              "Nhân viên, Thiết bị, Vốn",
              "Marketing, Tài chính, Sản xuất",
              "Chất lượng, Số lượng, Giá cả",
            ],
            correctAnswer: "Phạm vi (scope), Thời gian (time), Chi phí (cost)",
            orderIndex: 0,
          },
          {
            type: "mcq",
            content: "PERT: Dự án có hoạt động A với 3 ước tính: Tối ưu (optimistic) = 4 tuần, Có khả năng (most likely) = 6 tuần, Bi quan (pessimistic) = 10 tuần. Thời gian kỳ vọng (expected time) theo PERT là:",
            options: ["6.33 tuần", "6 tuần", "7 tuần", "5.5 tuần"],
            correctAnswer: "6.33 tuần",
            orderIndex: 1,
          },
          {
            type: "mcq",
            content: "Đường tới hạn (Critical Path) trong quản trị dự án là:",
            options: [
              "Đường ngắn nhất từ đầu đến cuối dự án",
              "Đường dài nhất từ đầu đến cuối dự án, quyết định thời gian hoàn thành dự án",
              "Đường có ít hoạt động nhất",
              "Đường có chi phí cao nhất",
            ],
            correctAnswer: "Đường dài nhất từ đầu đến cuối dự án, quyết định thời gian hoàn thành dự án",
            orderIndex: 2,
          },
          {
            type: "mcq",
            content: "Dự án có các hoạt động: A(3 tuần) → B(5 tuần) → C(2 tuần) và A(3 tuần) → D(4 tuần) → E(3 tuần). Đường tới hạn và thời gian dự án là:",
            options: [
              "A→B→C, 10 tuần",
              "A→D→E, 10 tuần",
              "A→B→C, 10 tuần (và A→D→E cũng 10 tuần — cả hai đều tới hạn)",
              "Không xác định được",
            ],
            correctAnswer: "A→B→C, 10 tuần (và A→D→E cũng 10 tuần — cả hai đều tới hạn)",
            orderIndex: 3,
          },
          {
            type: "mcq",
            content: "Phương pháp Agile quản trị dự án khác Waterfall ở điểm:",
            options: [
              "Agile hoàn thành tất cả giai đoạn trước khi chuyển sang giai đoạn tiếp theo",
              "Agile chia dự án thành các sprint ngắn (1-4 tuần), liên tục giao giá trị và thích nghi thay đổi",
              "Agile không cần lập kế hoạch",
              "Agile chỉ áp dụng cho dự án phần mềm nhỏ",
            ],
            correctAnswer: "Agile chia dự án thành các sprint ngắn (1-4 tuần), liên tục giao giá trị và thích nghi thay đổi",
            orderIndex: 4,
          },
          {
            type: "mcq",
            content: "Earned Value Management (EVM): Dự án có BAC (Budget at Completion) = 100tr. Tại thời điểm báo cáo: PV (Planned Value) = 40tr, EV (Earned Value) = 35tr, AC (Actual Cost) = 45tr. Chỉ số CPI (Cost Performance Index) là:",
            options: ["0.78", "0.875", "1.14", "0.89"],
            correctAnswer: "0.78",
            orderIndex: 5,
          },
          {
            type: "mcq",
            content: "Với số liệu câu trên, SPI (Schedule Performance Index) là:",
            options: ["0.875", "0.78", "1.14", "0.89"],
            correctAnswer: "0.875",
            orderIndex: 6,
          },
          {
            type: "mcq",
            content: "Ma trận rủi ro dự án (Risk Matrix) đánh giá rủi ro dựa trên:",
            options: [
              "Xác suất xảy ra và Mức độ tác động (probability × impact)",
              "Chỉ chi phí rủi ro",
              "Chỉ thời gian xử lý",
              "Chỉ số lượng người affected",
            ],
            correctAnswer: "Xác suất xảy ra và Mức độ tác động (probability × impact)",
            orderIndex: 7,
          },
          {
            type: "mcq",
            content: "Scrum framework bao gồm các vai trò:",
            options: [
              "Product Owner, Scrum Master, Development Team",
              "Project Manager, Developer, Tester",
              "CEO, CTO, Developer",
              "Sponsor, Manager, Employee",
            ],
            correctAnswer: "Product Owner, Scrum Master, Development Team",
            orderIndex: 8,
          },
          {
            type: "mcq",
            content: "Buffer (dự phòng) trong quản trị dự án: Dự án có 5 hoạt động nối tiếp, mỗi hoạt động có ước tính thời gian kỳ vọng và độ lệch chuẩn:\n- A: μ=4, σ=1\n- B: μ=3, σ=0.5\n- C: μ=5, σ=1.5\n- D: μ=2, σ=0.5\n- E: μ=6, σ=1\nThời gian kỳ vọng tổng và độ lệch chuẩn tổng (giả sử độc lập) là:",
            options: ["μ=20, σ=2.06", "μ=20, σ=4.5", "μ=20, σ=2.0", "μ=20, σ=3.5"],
            correctAnswer: "μ=20, σ=2.06",
            orderIndex: 9,
          },
          {
            type: "mcq",
            content: "WBS (Work Breakdown Structure) là:",
            options: [
              "Phân chia dự án thành các gói công việc nhỏ hơn, có thể quản lý được, theo cấu trúc cây",
              "Bảng lương nhân viên dự án",
              "Sơ đồ tổ chức dự án",
              "Báo cáo tài chính dự án",
            ],
            correctAnswer: "Phân chia dự án thành các gói công việc nhỏ hơn, có thể quản lý được, theo cấu trúc cây",
            orderIndex: 10,
          },
          {
            type: "mcq",
            content: "Stakeholder management: Phân loại stakeholder theo ma trận Power-Interest. Stakeholder có quyền lực CAO và sự quan tâm CAO cần:",
            options: [
              "Chỉ theo dõi",
              "Quản lý chặt chẽ (Manage closely) — tham gia tích cực",
              "Giữ hài lòng (Keep satisfied)",
              "Cung cấp thông tin (Keep informed)",
            ],
            correctAnswer: "Quản lý chặt chẽ (Manage closely) — tham gia tích cực",
            orderIndex: 11,
          },
          {
            type: "essay",
            content: "Dự án xây dựng nhà máy có các hoạt động sau:\n\n| Hoạt động | Thời gian (tuần) | Hoạt động trước |\n|-----------|------------------|-----------------|\n| A | 3 | — |\n| B | 5 | A |\n| C | 4 | A |\n| D | 6 | B |\n| E | 3 | C |\n| F | 2 | D, E |\n| G | 4 | F |\n\nYêu cầu:\n1. Vẽ sơ đồ mạng (network diagram) và xác định đường tới hạn.\n2. Tính thời gian hoàn thành dự án.\n3. Tính slack time cho hoạt động E.",
            correctAnswer: "**1. Sơ đồ mạng & đường tới hạn:**\n\nCác đường đi từ đầu đến cuối:\n- A→B→D→F→G: 3+5+6+2+4 = 20 tuần\n- A→C→E→F→G: 3+4+3+2+4 = 16 tuần\n\n**Đường tới hạn: A→B→D→F→G (20 tuần)**\n\n**2. Thời gian hoàn thành dự án: 20 tuần**\n\n**3. Slack time cho E:**\n- E nằm trên đường A→C→E→F→G: 16 tuần\n- Đường tới hạn: 20 tuần\n- Slack(E) = 20 - 16 = **4 tuần**\n\nCụ thể:\n- ES(E) = 3+4 = 7 (Early Start)\n- EF(E) = 7+3 = 10 (Early Finish)\n- LF(E) = 20-2-4 = 14 (Late Finish)\n- LS(E) = 14-3 = 11 (Late Start)\n- Slack(E) = LS(E) - ES(E) = 11 - 7 = **4 tuần**",
            orderIndex: 12,
          },
          {
            type: "essay",
            content: "Dự án phần mềm có BAC = 500tr, thời gian 12 tháng. Tại tháng 6 (50% thời gian):\n- PV (Planned Value) = 250tr\n- EV (Earned Value) = 200tr\n- AC (Actual Cost) = 220tr\n\nYêu cầu:\n1. Tính CPI, SPI và đánh giá tình trạng dự án.\n2. Dự báo EAC (Estimate at Completion) và ETC (Estimate to Complete).\n3. Đề xuất 3 biện pháp cải thiện.",
            correctAnswer: "**1. CPI & SPI:**\n- CPI = EV / AC = 200 / 220 = **0.91** (< 1 → vượt chi phí)\n- SPI = EV / PV = 200 / 250 = **0.80** (< 1 → chậm tiến độ)\n\n**Đánh giá:** Dự án chậm tiến độ (80% hiệu suất) và vượt chi phí (91% hiệu suất). Cần can thiệp.\n\n**2. Dự báo:**\n- EAC = BAC / CPI = 500 / 0.91 = **549.5tr** (dự kiến tổng chi phí)\n- ETC = EAC - AC = 549.5 - 220 = **329.5tr** (chi phí còn lại)\n- VAC = BAC - EAC = 500 - 549.5 = **-49.5tr** (vượt ngân sách 49.5tr)\n\n**3. Biện pháp cải thiện:**\n\na) **Tăng nguồn lực:** Thêm nhân sự cho các task tới hạn, nhưng cần đào tạo nhanh → chi phí tăng nhưng rút ngắn thời gian\n\nb) **Giảm phạm vi (descoping):** Ưu tiên tính năng cốt lõi, hoãn tính năng nice-to-have sang phase 2 → giảm công việc còn lại\n\nc) **Chuyển sang Agile:** Chia thành sprint ngắn, giao giá trị từng 2 tuần, liên tục đánh giá và điều chỉnh → tăng hiệu suất",
            orderIndex: 13,
          },
          {
            type: "essay",
            content: "So sánh phương pháp Waterfall và Agile trong quản trị dự án phần mềm. Phân tích ưu nhược điểm và tình huống áp dụng phù hợp cho mỗi phương pháp.",
            correctAnswer: "**Waterfall:**\n- Tuần tự: Requirements → Design → Implementation → Testing → Deployment → Maintenance\n- Hoàn thành từng giai đoạn trước khi chuyển sang giai đoạn tiếp theo\n- **Ưu:** Cấu trúc rõ ràng, dễ lập kế hoạch, tài liệu đầy đủ, phù hợp dự án yêu cầu cố định\n- **Nhược:** Không linh hoạt, phát hiện lỗi muộn (testing ở cuối), khó thay đổi yêu cầu, rủi ro cao\n- **Áp dụng:** Dự án yêu cầu rõ ràng, cố định (y tế, quốc phòng, xây dựng), quy mô nhỏ-trung bình\n\n**Agile:**\n- Lặp lại theo sprint (1-4 tuần), mỗi sprint giao phần mềm dùng được\n- Liên tục thích nghi thay đổi yêu cầu\n- **Ưu:** Linh hoạt, giao giá trị sớm, phát hiện lỗi nhanh, khách hàng tham gia liên tục\n- **Nhược:** Khó ước tính tổng chi phí/thời gian, tài liệu ít, cần đội ngũ tự quản lý, khó áp dụng quy mô lớn\n- **Áp dụng:** Dự án yêu cầu thay đổi liên tục (startup, sản phẩm mới), đội ngũ kinh nghiệm\n\n**Kết luận:**\n- Waterfall phù hợp dự án ổn định, yêu cầu rõ ràng, rủi ro thấp\n- Agile phù hợp dự án đổi mới, yêu cầu linh hoạt, rủi ro cao\n- Nhiều DN dùng Hybrid: Waterfall cho planning, Agile cho execution",
            orderIndex: 14,
          },
        ],
      },
    ],
  },
];

// ─── Seed Execution ─────────────────────────────────────────────────
async function main() {
  console.log("Seeding database...");

  let totalDeThi = 0;
  let totalQuestions = 0;

  for (const subjectData of SEED_DATA) {
    // Upsert subject
    const subject = await prisma.subject.upsert({
      where: { slug: subjectData.slug },
      update: { name: subjectData.name },
      create: { slug: subjectData.slug, name: subjectData.name },
    });

    console.log(`  Subject: ${subjectData.name} (${subjectData.slug})`);

    for (const deThiData of subjectData.deThi) {
      const uniqueSlug = slugify(deThiData.title);
      const normalized = normalizeVietnamese(deThiData.title);
      const tagsJson = JSON.stringify(deThiData.tags);

      // Delete existing questions for this đề (to allow re-seeding)
      await prisma.question.deleteMany({
        where: { deThiId: uniqueSlug },
      });

      // Upsert đề thi
      await prisma.deThi.upsert({
        where: { id: uniqueSlug },
        update: {
          title: deThiData.title,
          source: deThiData.source,
          tags: tagsJson,
          normalizedTitle: normalized,
          subjectId: subject.id,
        },
        create: {
          id: uniqueSlug,
          subjectId: subject.id,
          title: deThiData.title,
          source: deThiData.source,
          tags: tagsJson,
          normalizedTitle: normalized,
        },
      });

      // Create questions
      for (const q of deThiData.questions) {
        await prisma.question.create({
          data: {
            deThiId: uniqueSlug,
            type: q.type,
            content: q.content,
            options: q.options ? JSON.stringify(q.options) : null,
            correctAnswer: q.correctAnswer,
            orderIndex: q.orderIndex,
          },
        });
        totalQuestions++;
      }

      totalDeThi++;
      console.log(`    Đề: ${deThiData.title} — ${deThiData.questions.length} questions`);
    }
  }

  console.log(`\n  ${totalDeThi} de_thi upserted`);
  console.log(`  ${totalQuestions} questions created`);

  // ── Demo user ─────────────────────────────────────────────────────
  const demoPasswordHash = await bcrypt.hash("demo1234", 10);
  const demoUser = await prisma.user.upsert({
    where: { username: "demo" },
    update: { passwordHash: demoPasswordHash },
    create: { username: "demo", passwordHash: demoPasswordHash },
  });
  console.log("  demo user upserted (demo / demo1234)");

  // ── Demo quiz attempts (fake history) ─────────────────────────────
  // Clean previous attempts for re-seeding
  await prisma.quizAnswer.deleteMany({
    where: { attempt: { userId: demoUser.id } },
  });
  await prisma.quizAttempt.deleteMany({
    where: { userId: demoUser.id },
  });

  const allDeThi = await prisma.deThi.findMany({
    include: {
      subject: true,
      _count: { select: { questions: true } },
    },
  });
  const deThiMap = new Map(allDeThi.map((d) => [d.id, d]));

  const fakeAttempts = [
    { deThiId: "nguyen_ly_ke_toan_ftu_nang_cao", daysAgo: 60, percentage: 45 },
    { deThiId: "tai_chinh_tien_te_hvnh_nang_cao", daysAgo: 55, percentage: 52 },
    { deThiId: "quan_tri_marketing_dh_mo_tp_hcm_nang_cao", daysAgo: 50, percentage: 48 },
    { deThiId: "ke_toan_tai_chinh_neu_nang_cao", daysAgo: 42, percentage: 58 },
    { deThiId: "ngan_hang_thuong_mai_dh_kinh_te_da_nang_nang_cao", daysAgo: 38, percentage: 61 },
    { deThiId: "ke_toan_chi_phi_dh_kinh_te_hue_nang_cao", daysAgo: 33, percentage: 55 },
    { deThiId: "quan_tri_chien_luoc_uel_nang_cao", daysAgo: 28, percentage: 64 },
    { deThiId: "tin_dung_ngan_hang_uel_nang_cao", daysAgo: 22, percentage: 67 },
    { deThiId: "bao_cao_tai_chinh_neu_nang_cao", daysAgo: 18, percentage: 70 },
    { deThiId: "quan_tri_nguon_nhan_luc_dh_kinh_te_da_nang_nang_cao", daysAgo: 14, percentage: 63 },
    { deThiId: "tai_chinh_doanh_nghiep_neu_nang_cao", daysAgo: 10, percentage: 72 },
    { deThiId: "ke_toan_quan_tri_dh_mo_tp_hcm_nang_cao", daysAgo: 6, percentage: 78 },
    { deThiId: "hanh_vi_nguoi_tieu_dung_rmit_nang_cao", daysAgo: 2, percentage: 81 },
  ];

  let seededAttempts = 0;
  for (const fa of fakeAttempts) {
    const deThi = deThiMap.get(fa.deThiId);
    if (!deThi) {
      console.warn(`    skip: deThi "${fa.deThiId}" not found`);
      continue;
    }

    const totalQuestions = deThi._count.questions;
    const score = Math.round((fa.percentage / 100) * totalQuestions);
    const completedAt = new Date(
      Date.now() - fa.daysAgo * 24 * 60 * 60 * 1000
    );

    await prisma.quizAttempt.create({
      data: {
        userId: demoUser.id,
        deThiId: fa.deThiId,
        subjectId: deThi.subjectId,
        score,
        totalQuestions,
        percentage: fa.percentage,
        completedAt,
      },
    });
    seededAttempts++;
  }
  console.log(`  ${seededAttempts} quiz attempts seeded for demo user`);

  console.log("Seeding complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
