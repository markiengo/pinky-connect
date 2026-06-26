import { ArrowRight, BookOpen, BarChart3, Sparkles, MessageSquare, FileText, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const subjects = [
  {
    label: "Kế toán",
    desc: "Nguyên lý kế toán, BCTC, kế toán quản trị, kế toán chi phí",
    color: "#9F7AEA",
    slug: "ke-toan",
    examCount: "5 đề",
  },
  {
    label: "Tài chính – Ngân hàng",
    desc: "Tài chính tiền tệ, ngân hàng thương mại, tín dụng, quản trị rủi ro",
    color: "#7C6FDB",
    slug: "tai-chinh-ngan-hang",
    examCount: "5 đề",
  },
  {
    label: "Quản trị Kinh doanh",
    desc: "Marketing, chiến lược, nhân sự, hành vi tiêu dùng, dự án",
    color: "#F4899A",
    slug: "quan-tri-kinh-doanh",
    examCount: "5 đề",
  },
] as const;

const features = [
  {
    icon: MessageSquare,
    title: "AI tìm đề phù hợp",
    desc: "Chat với AI, nói môn học và chủ đề bạn cần ôn. Hệ thống gợi ý đề thi phù hợp nhất.",
  },
  {
    icon: FileText,
    title: "Đề thi cấp độ đại học",
    desc: "225 câu hỏi khó, bám sát chương trình các trường hàng đầu: NEU, FTU, UEL, RMIT.",
  },
  {
    icon: BarChart3,
    title: "Phân tích kết quả",
    desc: "Xem lịch sử làm bài, biểu đồ tiến bộ, điểm trung bình theo từng môn học.",
  },
] as const;

const steps = [
  {
    num: "01",
    title: "Chat với AI",
    desc: "Mô tả môn học, chủ đề, hoặc trường đại học bạn đang ôn thi.",
  },
  {
    num: "02",
    title: "Làm bài thi",
    desc: "Trắc nghiệm và tự luận với giao diện học thuật, hỗ trợ Markdown.",
  },
  {
    num: "03",
    title: "Xem kết quả",
    desc: "Chấm điểm tức thì, lưu lịch sử, theo dõi tiến bộ qua biểu đồ.",
  },
] as const;


function SubjectPattern({ slug }: { slug: string }) {
  if (slug === "ke-toan") {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-[0.12] pointer-events-none" preserveAspectRatio="xMidYMid slice">
        <defs>
          <pattern id="landing-ledger" x="0" y="0" width="40" height="32" patternUnits="userSpaceOnUse">
            <line x1="0" y1="8" x2="40" y2="8" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="0" y1="16" x2="40" y2="16" stroke="#FFFFFF" strokeWidth="1" />
            <line x1="0" y1="24" x2="40" y2="24" stroke="#FFFFFF" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#landing-ledger)" />
      </svg>
    );
  }
  if (slug === "tai-chinh-ngan-hang") {
    return (
      <svg className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none" preserveAspectRatio="xMidYMid slice">
        <g stroke="#FFFFFF" strokeWidth="1.5" fill="none">
          <line x1="20%" y1="20%" x2="20%" y2="75%" />
          <rect x="16%" y="35%" width="8%" height="25%" fill="#FFFFFF" fillOpacity="0.3" />
          <line x1="45%" y1="15%" x2="45%" y2="65%" />
          <rect x="41%" y="25%" width="8%" height="30%" fill="#FFFFFF" fillOpacity="0.3" />
          <line x1="70%" y1="25%" x2="70%" y2="80%" />
          <rect x="66%" y="40%" width="8%" height="30%" fill="#FFFFFF" fillOpacity="0.3" />
        </g>
      </svg>
    );
  }
  return (
    <svg className="absolute inset-0 w-full h-full opacity-[0.15] pointer-events-none" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">
      <polyline points="20,160 60,120 100,130 140,70 180,50" fill="none" stroke="#FFFFFF" strokeWidth="2" />
      <polygon points="180,50 170,55 175,62" fill="#FFFFFF" />
      <line x1="20" y1="160" x2="180" y2="160" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="4 4" />
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-[#E8E4F2]">
      {/* ── HERO — Cinematic background ── */}
      <section className="relative min-h-[100dvh] overflow-hidden">
        {/* Background image — unoptimized Next.js Image */}
        <Image
          src="/background.png"
          alt="Dreamy cinematic app background"
          fill
          priority
          sizes="100vw"
          unoptimized
          className="object-cover"
        />

        {/* Gradient overlay — lighter, only darken top & bottom for legibility */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(30,27,58,0.25) 0%, rgba(30,27,58,0.05) 25%, rgba(30,27,58,0.05) 55%, rgba(30,27,58,0.55) 100%)",
          }}
        />

        {/* Nav bar — transparent over illustration */}
        <nav className="relative z-10 flex items-center justify-between px-6 md:px-12 py-5">
          <div className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.25)" }}
            >
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-sans font-semibold text-[15px] text-white">
              Đề Thi AI
            </span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Tính năng", "Môn học", "Cách hoạt động"].map((item) => (
              <a
                key={item}
                href={item === "Môn học" ? "#subjects" : item === "Cách hoạt động" ? "#how" : "#features"}
                className="font-sans text-[14px] font-normal transition-colors duration-200"
                style={{ color: "rgba(255,255,255,0.65)" }}
              >
                {item}
              </a>
            ))}
          </div>
          <Link
            href="/login"
            className="font-sans font-medium text-[14px] rounded-[999px] px-5 py-2.5 transition-all duration-200 btn-press"
            style={{
              background: "rgba(255,255,255,0.10)",
              border: "1px solid rgba(255,255,255,0.22)",
              color: "white",
              backdropFilter: "blur(4px)",
            }}
          >
            Đăng nhập
          </Link>
        </nav>

        {/* Hero content — centered, sits in the lighter middle area */}
        <div
          className="relative z-10 flex flex-col items-center justify-center text-center px-6"
          style={{ minHeight: "calc(100dvh - 80px)" }}
        >
          {/* Badge */}
          <div
            className="flex items-center gap-2 mb-8 rounded-[999px] px-4 py-2"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.15)",
              backdropFilter: "blur(6px)",
            }}
          >
            <Sparkles className="w-3.5 h-3.5 text-white/70" />
            <span className="font-sans text-[12px] font-medium" style={{ color: "rgba(255,255,255,0.8)" }}>
              15 đề thi · 225 câu hỏi khó
            </span>
          </div>

          {/* H1 */}
          <h1
            className="font-serif font-normal leading-[1.05] tracking-[-0.02em] mb-6 text-white"
            style={{ fontSize: "clamp(40px, 6vw, 72px)" }}
          >
            Học để hiểu,
            <br />
            không chỉ để{" "}
            <em className="font-serif italic" style={{ color: "rgba(255,255,255,0.6)" }}>
              thi
            </em>
          </h1>

          {/* Subheading */}
          <p
            className="font-sans font-normal leading-[1.6] mb-10 max-w-[520px]"
            style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)" }}
          >
            Kho đề thi đại học được sàng lọc, giao diện làm bài học thuật,
            và AI tìm đề phù hợp với syllabus của bạn.
          </p>

          {/* CTAs */}
          <div className="flex items-center gap-4 flex-wrap justify-center">
            <Link
              href="/signup"
              className="font-sans font-semibold text-[14px] rounded-[999px] px-7 py-3.5 transition-all duration-200 btn-press inline-flex items-center gap-2"
              style={{
                background: "white",
                color: "#1E1B3A",
                boxShadow: "0 4px 24px rgba(30,27,58,0.15)",
              }}
            >
              Bắt đầu miễn phí
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="font-sans font-medium text-[14px] rounded-[999px] px-7 py-3.5 transition-all duration-200 btn-press"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                color: "white",
                backdropFilter: "blur(4px)",
              }}
            >
              Khám phá tính năng
            </a>
          </div>
        </div>

        {/* Bottom fade into next section */}
        <div
          className="absolute bottom-0 left-0 right-0 z-10"
          style={{
            height: "80px",
            background: "linear-gradient(180deg, transparent, #E8E4F2)",
          }}
        />
      </section>

      {/* ── STATS BAR ── */}
      <section className="px-6 md:px-12 py-12 md:py-16" style={{ background: "#E8E4F2" }}>
        <div className="max-w-[1000px] mx-auto grid grid-cols-3 gap-4 md:gap-8">
          {[
            { num: "15", label: "Đề thi" },
            { num: "225", label: "Câu hỏi khó" },
            { num: "3", label: "Môn học" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div
                className="font-serif font-normal mb-1"
                style={{ fontSize: "clamp(28px, 4vw, 44px)", color: "#1E1B3A" }}
              >
                {stat.num}
              </div>
              <div
                className="font-sans"
                style={{ fontSize: "13px", color: "#8F8AA3" }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-20 md:py-28 px-6 md:px-12" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1100px] mx-auto">
          <div className="mb-14 max-w-[560px]">
            <span
              className="font-sans font-semibold text-[13px] uppercase tracking-[0.08em] mb-3 block"
              style={{ color: "#5B8A7A" }}
            >
              Tính năng
            </span>
            <h2
              className="font-serif font-normal leading-[1.15] tracking-[-0.01em] mb-4"
              style={{ fontSize: "clamp(28px, 3.5vw, 42px)", color: "#1E1B3A" }}
            >
              Mọi thứ bạn cần để ôn thi hiệu quả
            </h2>
            <p
              className="font-sans leading-[1.6]"
              style={{ fontSize: "15px", color: "#5C5875" }}
            >
              Từ tìm đề phù hợp đến phân tích kết quả, tất cả trong một nền tảng.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="reveal"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div
                  className="w-11 h-11 rounded-[10px] flex items-center justify-center mb-5"
                  style={{ background: "rgba(159,122,234,0.10)" }}
                >
                  <f.icon className="w-5 h-5" style={{ color: "#9F7AEA" }} />
                </div>
                <h3
                  className="font-sans font-bold mb-2"
                  style={{ fontSize: "17px", color: "#1E1B3A" }}
                >
                  {f.title}
                </h3>
                <p
                  className="font-sans leading-[1.6]"
                  style={{ fontSize: "14px", color: "#5C5875" }}
                >
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUBJECT SHOWCASE ── */}
      <section id="subjects" className="py-20 md:py-28 px-6 md:px-12" style={{ background: "#E8E4F2" }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="mb-14 max-w-[560px]">
            <span
              className="font-sans font-semibold text-[13px] uppercase tracking-[0.08em] mb-3 block"
              style={{ color: "#5B8A7A" }}
            >
              Môn học
            </span>
            <h2
              className="font-serif font-normal leading-[1.15] tracking-[-0.01em] mb-4"
              style={{ fontSize: "clamp(28px, 3.5vw, 42px)", color: "#1E1B3A" }}
            >
              Ba môn học. Mười lăm đề thi.
            </h2>
            <p
              className="font-sans leading-[1.6]"
              style={{ fontSize: "15px", color: "#5C5875" }}
            >
              Nội dung bám sát chương trình đại học, được biên soạn bởi sinh viên
              từ các trường hàng đầu: NEU, FTU, UEL, RMIT, ĐH Mở TP.HCM.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {subjects.map((s, i) => (
              <div
                key={s.label}
                className="rounded-[16px] p-7 text-white reveal relative overflow-hidden transition-transform duration-300 hover:scale-[1.02]"
                style={{
                  background: s.color,
                  animationDelay: `${i * 80}ms`,
                  boxShadow: "0 4px 24px rgba(30,27,58,0.08)",
                }}
              >
                <SubjectPattern slug={s.slug} />
                <div className="relative z-10">
                  <h3
                    className="font-sans font-bold leading-tight mb-3"
                    style={{ fontSize: "22px" }}
                  >
                    {s.label}
                  </h3>
                  <p
                    className="font-sans font-normal mb-8 leading-[1.5]"
                    style={{ fontSize: "14px", color: "rgba(255,255,255,0.85)" }}
                  >
                    {s.desc}
                  </p>
                  <div
                    className="flex items-center gap-2 font-sans font-medium"
                    style={{ fontSize: "13px", color: "rgba(255,255,255,0.75)" }}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {s.examCount} · 15 câu mỗi đề
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" className="py-20 md:py-28 px-6 md:px-12" style={{ background: "#FFFFFF" }}>
        <div className="max-w-[1000px] mx-auto">
          <div className="mb-14 text-center">
            <span
              className="font-sans font-semibold text-[13px] uppercase tracking-[0.08em] mb-3 block"
              style={{ color: "#5B8A7A" }}
            >
              Cách hoạt động
            </span>
            <h2
              className="font-serif font-normal leading-[1.15] tracking-[-0.01em] mb-4"
              style={{ fontSize: "clamp(28px, 3.5vw, 42px)", color: "#1E1B3A" }}
            >
              Ba bước đơn giản
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
            {steps.map((step, i) => (
              <div key={step.num} className="relative">
                {i < steps.length - 1 && (
                  <div
                    className="hidden md:block absolute top-8 left-[60%] w-full h-[1px]"
                    style={{ background: "#D9D3E6" }}
                  />
                )}
                <div className="relative">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-5 font-sans font-bold"
                    style={{
                      fontSize: "20px",
                      background: "rgba(159,122,234,0.10)",
                      color: "#9F7AEA",
                      border: "2px solid rgba(159,122,234,0.20)",
                    }}
                  >
                    {step.num}
                  </div>
                  <h3
                    className="font-sans font-bold mb-2"
                    style={{ fontSize: "17px", color: "#1E1B3A" }}
                  >
                    {step.title}
                  </h3>
                  <p
                    className="font-sans leading-[1.6]"
                    style={{ fontSize: "14px", color: "#5C5875" }}
                  >
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 md:py-32 px-6 md:px-12" style={{ background: "#E8E4F2" }}>
        <div className="max-w-[700px] mx-auto text-center">
          <h2
            className="font-serif font-normal leading-[1.15] tracking-[-0.01em] mb-5"
            style={{ fontSize: "clamp(28px, 4vw, 44px)", color: "#1E1B3A" }}
          >
            Bắt đầu luyện thi hôm nay
          </h2>
          <p
            className="font-sans mb-10 leading-[1.6]"
            style={{ fontSize: "16px", color: "#5C5875" }}
          >
            Tạo tài khoản miễn phí. Làm bài ngay. Xem kết quả tức thì.
          </p>
          <Link
            href="/signup"
            className="font-sans font-semibold text-[15px] rounded-[999px] px-8 py-4 transition-all duration-200 btn-press inline-flex items-center gap-2"
            style={{
              background: "#1E1B3A",
              color: "white",
              boxShadow: "0 4px 24px rgba(30,27,58,0.15)",
            }}
          >
            Tham gia ngay
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p
            className="font-sans mt-6"
            style={{ fontSize: "13px", color: "#8F8AA3" }}
          >
            Miễn phí. Không cần thẻ tín dụng.
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="px-6 md:px-12 py-8 border-t"
        style={{ borderColor: "#D9D3E6", background: "#FFFFFF" }}
      >
        <div className="max-w-[1200px] mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center"
              style={{ background: "rgba(159,122,234,0.12)" }}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#9F7AEA]" />
            </div>
            <span
              className="font-sans font-semibold text-[14px]"
              style={{ color: "#1E1B3A" }}
            >
              Đề Thi AI
            </span>
          </div>
          <p
            className="font-sans text-[13px]"
            style={{ color: "#8F8AA3" }}
          >
            Sản phẩm học thuật, vì sinh viên Việt Nam.
          </p>
        </div>
      </footer>
    </div>
  );
}
