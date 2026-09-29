"use client";

import { useState } from "react";

// TDS 링크 데이터
const LINKS = [
  {
    id: "github",
    title: "GitHub 저장소",
    subtitle: "진행 중인 프로젝트와 오픈소스 코드",
    url: "https://github.com",
    badge: "코드",
    icon: (
      <svg className="w-5 h-5 text-[#333D4B]" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    id: "blog",
    title: "기술 블로그",
    subtitle: "바이브 코딩과 웹 개발 학습 일지",
    url: "https://velog.io",
    badge: "글",
    icon: (
      <svg className="w-5 h-5 text-[#333D4B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
  {
    id: "portfolio",
    title: "노션 포트폴리오",
    subtitle: "자기소개 및 프로젝트 상세 정리",
    url: "https://notion.so",
    badge: "이력",
    icon: (
      <svg className="w-5 h-5 text-[#333D4B]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    title: "인스타그램",
    subtitle: "일상과 소통 이야기",
    url: "https://instagram.com",
    badge: "SNS",
    icon: (
      <svg className="w-5 h-5 text-[#333D4B]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
];

// 기술 스택 (TDS Chip 스타일)
const SKILLS = [
  "Vibe Coding",
  "Next.js 16",
  "React 19",
  "TypeScript",
  "Tailwind CSS",
  "AI Agents",
];

export default function Home() {
  const [likes, setLikes] = useState(128);
  const [hasLiked, setHasLiked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("chaeyoon.lim@example.com");
    showToast("이메일 주소가 복사되었어요");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("프로필 주소가 복사되었어요");
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      showToast("소중한 응원이 전달되었어요");
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F2F4F6] text-[#191F28] pb-28">
      
      {/* 1. TDS TopBar (56px) */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between bg-white/80 px-5 backdrop-blur-md border-b border-[#E5E8EB]">
        <div className="flex items-center gap-2">
          {/* 토스 스타일 브랜드 심볼 */}
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3182F6] text-white">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>
          <span className="text-[17px] font-bold tracking-tight text-[#191F28]">
            마이링크
          </span>
        </div>

        <button
          onClick={handleShare}
          className="flex items-center gap-1 text-[14px] font-semibold text-[#4E5968] hover:text-[#191F28] active:opacity-60 transition-opacity"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          공유
        </button>
      </header>

      {/* 메인 모바일-퍼스트 컨테이너 (max-w-[480px]) */}
      <main className="mx-auto flex w-full max-w-[480px] flex-col px-4 pt-4 space-y-3">
        
        {/* 2. 프로필 메인 카드 (TDS 24px Rounding & Pure White Surface) */}
        <section className="rounded-[24px] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-[#E5E8EB]/50">
          
          {/* 상단 프로필 헤더 */}
          <div className="flex items-center gap-4">
            {/* TDS 원형 아바타 (48px) */}
            <div className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[#E8F3FF] text-[#3182F6] font-bold text-xl">
              CY
              <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#00B460]" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-[20px] font-bold tracking-tight text-[#191F28]">
                  임채윤
                </h1>
                <span className="rounded-full bg-[#E8F3FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#3182F6]">
                  대학생 메이커
                </span>
              </div>
              <p className="text-[13px] text-[#8B95A1] mt-0.5">
                chaeyoon.lim@example.com
              </p>
            </div>
          </div>

          {/* 소개글 (TDS 해요체 + 가독성 표준) */}
          <div className="mt-4 rounded-[16px] bg-[#F9FAFB] p-3.5">
            <p className="text-[14px] leading-relaxed text-[#4E5968]">
              안녕하세요, 바이브 코딩을 통해 유용한 프로덕트를 만들어가고 있어요.
              새로운 기술과 일상의 문제를 잇는 것에 관심이 많아요.
            </p>
          </div>

          {/* 보조 액션 버튼들 (Button M / L) */}
          <div className="mt-4 grid grid-cols-2 gap-2.5">
            <button
              onClick={handleCopyEmail}
              className="flex h-11 items-center justify-center gap-1.5 rounded-[12px] bg-[#F2F4F6] text-[14px] font-semibold text-[#333D4B] hover:bg-[#E5E8EB] active:bg-[#D1D6DB] transition-colors"
            >
              <svg className="w-4 h-4 text-[#4E5968]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              이메일 복사
            </button>

            <button
              onClick={handleLike}
              className={`flex h-11 items-center justify-center gap-1.5 rounded-[12px] text-[14px] font-semibold transition-colors ${
                hasLiked
                  ? "bg-[#E8F3FF] text-[#3182F6]"
                  : "bg-[#F2F4F6] text-[#333D4B] hover:bg-[#E5E8EB] active:bg-[#D1D6DB]"
              }`}
            >
              <span>{hasLiked ? "💙" : "🤍"}</span>
              응원 {likes}
            </button>
          </div>
        </section>

        {/* 3. 현황 요약 카드 (TDS 2열 스냅샷) */}
        <section className="grid grid-cols-2 gap-3">
          <div className="rounded-[20px] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-[#E5E8EB]/50">
            <span className="text-[12px] font-semibold text-[#8B95A1]">현재 집중 분야</span>
            <p className="mt-1 text-[15px] font-bold text-[#191F28] tracking-tight">
              Next.js 16 & AI
            </p>
          </div>

          <div className="rounded-[20px] bg-white p-4 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-[#E5E8EB]/50">
            <span className="text-[12px] font-semibold text-[#8B95A1]">학습 상태</span>
            <div className="mt-1 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#00B460]" />
              <p className="text-[15px] font-bold text-[#191F28] tracking-tight">
                활발히 코딩 중
              </p>
            </div>
          </div>
        </section>

        {/* 4. 링크 섹션 (TDS ListRow 표준 구현) */}
        <section className="rounded-[24px] bg-white overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-[#E5E8EB]/50">
          <div className="px-5 pt-4 pb-2">
            <h2 className="text-[15px] font-bold text-[#191F28]">
              바로가기 링크
            </h2>
          </div>

          <div className="divide-y divide-[#F2F4F6]">
            {LINKS.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-[#F9FAFB] active:bg-[#F2F4F6]"
              >
                {/* 왼쪽: TDS 아이콘 컨테이너 (44px) + 텍스트 */}
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#F2F4F6]">
                    {link.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[15px] font-semibold text-[#191F28]">
                        {link.title}
                      </span>
                      <span className="rounded-[6px] bg-[#F2F4F6] px-1.5 py-0.5 text-[10px] font-medium text-[#6B7684]">
                        {link.badge}
                      </span>
                    </div>
                    <p className="text-[13px] text-[#8B95A1] truncate mt-0.5">
                      {link.subtitle}
                    </p>
                  </div>
                </div>

                {/* 오른쪽: TDS 회색 화살표 (chevron) */}
                <div className="shrink-0 text-[#B0B8C1] pl-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* 5. 관심사 및 기술 스택 (TDS Chips & Pills) */}
        <section className="rounded-[24px] bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.03)] border border-[#E5E8EB]/50">
          <h2 className="text-[15px] font-bold text-[#191F28] mb-3">
            관심 키워드
          </h2>
          <div className="flex flex-wrap gap-2">
            {SKILLS.map((skill) => (
              <span
                key={skill}
                className="inline-flex h-[34px] items-center rounded-full border border-[#E5E8EB] bg-white px-3.5 text-[13px] font-medium text-[#333D4B]"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>

        {/* 6. 푸터 */}
        <footer className="pt-6 pb-4 text-center">
          <p className="text-[13px] text-[#8B95A1]">
            © 2026 Lim Chaeyoon · Toss Design System 스타일
          </p>
        </footer>

      </main>

      {/* 7. TDS BottomCTA (화면 하단 고정 56pt 단일 Primary 버튼 + 상단 보호 그라디언트) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
        <div className="h-8 w-full bg-gradient-to-t from-[#F2F4F6] to-transparent" />
        <div className="bg-[#F2F4F6] px-4 pb-5 pt-1">
          <div className="mx-auto max-w-[480px] pointer-events-auto">
            <button
              onClick={handleCopyEmail}
              className="flex h-14 w-full items-center justify-center rounded-[16px] bg-[#3182F6] text-[17px] font-bold text-white shadow-sm hover:bg-[#2870d4] active:bg-[#205db2] transition-colors"
            >
              이메일로 문의하기
            </button>
          </div>
        </div>
      </div>

      {/* 8. TDS Toast 알림 (grey-900 surface + green-500 원형 체크 아이콘) */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-[14px] bg-[#191F28] px-5 py-3.5 text-[14px] font-medium text-white shadow-[0_8px_24px_rgba(25,31,40,0.2)] animate-in fade-in slide-in-from-bottom-2 duration-200">
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00B460] text-white">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
