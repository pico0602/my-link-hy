"use client";

import { useState } from "react";

// 소셜 / 외부 링크 데이터
const LINKS = [
  {
    id: "github",
    title: "GitHub 저장소",
    description: "진행 중인 프로젝트와 오픈소스 코드 기록",
    url: "https://github.com",
    badge: "Code",
    badgeColor: "bg-slate-800 text-slate-100 dark:bg-zinc-700",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
    gradient: "from-zinc-900 to-zinc-700",
  },
  {
    id: "blog",
    title: "기술 블로그 & 기록",
    description: "바이브 코딩과 웹 개발 학습 일지",
    url: "https://velog.io",
    badge: "Blog",
    badgeColor: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    gradient: "from-teal-500 to-emerald-600",
  },
  {
    id: "portfolio",
    title: "노션 포트폴리오",
    description: "학력, 활동 내역, 프로젝트 상세 정리",
    url: "https://notion.so",
    badge: "Resume",
    badgeColor: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    gradient: "from-blue-600 to-indigo-600",
  },
  {
    id: "instagram",
    title: "인스타그램",
    description: "일상과 관심사, 사진 공유",
    url: "https://instagram.com",
    badge: "Daily",
    badgeColor: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    gradient: "from-pink-500 via-rose-500 to-amber-500",
  },
];

// 기술 스택 및 관심사 태그
const SKILL_TAGS = [
  "⚡ Vibe Coding",
  "⚛️ Next.js 16",
  "🎨 Tailwind CSS",
  "🤖 AI Agents",
  "📘 TypeScript",
  "💡 Problem Solving",
];

export default function Home() {
  const [likes, setLikes] = useState(42);
  const [hasLiked, setHasLiked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleCopyEmail = () => {
    const email = "chaeyoon.lim@example.com";
    navigator.clipboard.writeText(email);
    showToast("이메일 주소가 클립보드에 복사되었어요! 💌");
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      showToast("프로필 링크가 복사되었습니다! 🔗");
    }
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
      showToast("응원 감사합니다! 힘이 불끈불끈 💪✨");
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
      {/* 화려한 오로라 블러 배경 효과 */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-indigo-600/30 via-purple-600/25 to-pink-500/20 blur-[130px]" />
      <div className="pointer-events-none absolute top-1/3 -left-20 h-72 w-72 rounded-full bg-sky-500/20 blur-[110px]" />
      <div className="pointer-events-none absolute bottom-10 -right-20 h-80 w-80 rounded-full bg-indigo-500/20 blur-[120px]" />

      {/* 상단 액션 바 (공유하기 & 테마 느낌) */}
      <header className="mx-auto flex w-full max-w-lg items-center justify-between px-6 pt-7 pb-2">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
          열정 가득 공부 중
        </span>

        <button
          onClick={handleShare}
          className="group flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-md transition-all hover:border-white/25 hover:bg-white/10 hover:text-white active:scale-95"
          title="프로필 공유하기"
        >
          <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          공유
        </button>
      </header>

      {/* 메인 컨테이너 */}
      <div className="relative mx-auto flex w-full max-w-lg flex-col px-5 pt-4 pb-16">
        
        {/* 프로필 카드 헤더 */}
        <section className="relative mb-6 overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-7 text-center shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-white/20">
          
          {/* 장식용 은은한 내부 백라이트 */}
          <div className="pointer-events-none absolute -top-12 left-1/2 h-36 w-36 -translate-x-1/2 rounded-full bg-indigo-500/30 blur-2xl" />

          {/* 아바타 영역 */}
          <div className="relative mx-auto mb-4 flex justify-center">
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 p-1 shadow-xl shadow-indigo-500/25 transition-transform duration-300 hover:scale-105">
              <div className="flex h-full w-full items-center justify-center rounded-full bg-slate-900 text-3xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-tr from-sky-300 via-indigo-200 to-pink-200">
                CY
              </div>
            </div>
            {/* 상태 배지 */}
            <span className="absolute bottom-1 right-[calc(50%-52px)] rounded-full border-2 border-slate-900 bg-emerald-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-md">
              ONLINE
            </span>
          </div>

          {/* 이름 & 소속 */}
          <div className="space-y-1">
            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              임채윤
              <span className="ml-2 text-sm font-normal text-slate-400">Chaeyoon Lim</span>
            </h1>
            <p className="text-xs font-medium uppercase tracking-widest text-indigo-400">
              Tech Explorer & Vibe Coder
            </p>
          </div>

          {/* 자기소개 글 */}
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-slate-300">
            안녕하세요! 아이디어를 코드로 실현하는 것을 좋아하는 대학생입니다. 
            AI와 바이브 코딩으로 매일 새로운 경험을 만듭니다 ✨
          </p>

          {/* 빠른 액션 버튼: 이메일 문의 & 응원하기 */}
          <div className="mt-5 flex items-center justify-center gap-3">
            <button
              onClick={handleCopyEmail}
              className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white shadow-sm transition-all hover:bg-white/20 hover:scale-[1.02] active:scale-95"
            >
              <svg className="w-4 h-4 text-indigo-300" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              이메일 복사
            </button>

            <button
              onClick={handleLike}
              className={`flex items-center gap-1.5 rounded-xl border px-4 py-2 text-xs font-semibold transition-all active:scale-95 ${
                hasLiked
                  ? "border-rose-500/40 bg-rose-500/20 text-rose-300"
                  : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className={`transition-transform ${hasLiked ? "scale-125" : ""}`}>
                {hasLiked ? "❤️" : "🤍"}
              </span>
              응원 {likes}
            </button>
          </div>
        </section>

        {/* Bento 스타일 하이라이트 위젯 */}
        <section className="mb-6 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition-all hover:border-white/20">
            <span className="text-xl">🌱</span>
            <h2 className="mt-2 text-xs font-medium text-slate-400">Current Focus</h2>
            <p className="mt-1 text-sm font-semibold text-slate-200">
              Next.js 16 & AI 에이전트
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition-all hover:border-white/20">
            <span className="text-xl">🎯</span>
            <h2 className="mt-2 text-xs font-medium text-slate-400">Today&apos;s Vibe</h2>
            <p className="mt-1 text-sm font-semibold text-slate-200">
              상상을 코드로 구현하기
            </p>
          </div>
        </section>

        {/* 링크 목록 섹션 */}
        <section className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Featured Links
            </h2>
            <span className="text-xs text-slate-500">{LINKS.length} links</span>
          </div>

          {LINKS.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-400/40 hover:bg-white/[0.07] hover:shadow-indigo-500/10 active:scale-[0.99]"
            >
              {/* 왼쪽: 아이콘 + 텍스트 */}
              <div className="flex items-center gap-3.5">
                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr ${link.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
                >
                  {link.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-100 group-hover:text-indigo-300 transition-colors">
                      {link.title}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${link.badgeColor}`}
                    >
                      {link.badge}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-slate-400 line-clamp-1">
                    {link.description}
                  </p>
                </div>
              </div>

              {/* 오른쪽: 화살표 아이콘 */}
              <div className="shrink-0 text-slate-500 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-indigo-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </a>
          ))}
        </section>

        {/* 태그 / 스킬 섹션 */}
        <section className="mt-7">
          <h2 className="mb-3 px-1 text-xs font-bold uppercase tracking-wider text-slate-400">
            Skills & Interests
          </h2>
          <div className="flex flex-wrap gap-2">
            {SKILL_TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1.5 text-xs font-medium text-slate-300 backdrop-blur-sm transition-colors hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-indigo-200"
              >
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* 푸터 */}
        <footer className="mt-12 text-center text-xs text-slate-500">
          <p>© 2026 Lim Chaeyoon. All rights reserved.</p>
          <p className="mt-1 text-[11px] text-slate-600">
            Built with Next.js 16 & Tailwind CSS v4 ✨
          </p>
        </footer>
      </div>

      {/* 토스트 알림 */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 rounded-2xl border border-white/20 bg-slate-900/90 px-4 py-2.5 text-xs font-semibold text-white shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-4 duration-200">
          <span>{toastMessage}</span>
        </div>
      )}
    </main>
  );
}

