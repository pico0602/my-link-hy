"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Link2,
  BarChart3,
  Globe,
  ArrowRight,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  Layers,
  Smartphone,
  Eye,
  ShieldCheck,
  Zap,
} from "lucide-react";

// GitHub 인라인 SVG 아이콘 컴포넌트
function GithubIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

export function LandingClient() {
  const router = useRouter();
  const { user, signInWithGoogle, logout } = useAuth();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleStartCTA = async () => {
    if (user) {
      router.push("/my");
      return;
    }
    try {
      setIsLoggingIn(true);
      const loggedIn = await signInWithGoogle();
      if (loggedIn) {
        router.push("/my");
      }
    } catch (err) {
      console.error("로그인 실패:", err);
      // 로그인 창 취소 시에도 /my로 이동해 게스트 모드로 체험 가능
      router.push("/my");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#191F28] flex flex-col selection:bg-[#3182F6]/10 selection:text-[#3182F6]">
      {/* ─────────────────────────────────────────────────────────────
          1. 네비게이션 헤더 (Sticky Top Navigation)
      ────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 w-full border-b border-[#E5E8EB] bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#3182F6] text-white shadow-sm transition-transform duration-200 group-hover:scale-105">
              <Link2 className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-[#191F28] group-hover:text-[#3182F6] transition-colors">
                마이링크
              </span>
              <span className="text-[10px] font-semibold text-[#8B95A1] -mt-1 tracking-wider uppercase">
                MyLink
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#4E5968]">
            <a href="#features" className="hover:text-[#3182F6] transition-colors">
              기능 소개
            </a>
            <a href="#preview" className="hover:text-[#3182F6] transition-colors">
              미리보기
            </a>
            <Link href="/stats" className="hover:text-[#3182F6] transition-colors flex items-center gap-1">
              <BarChart3 className="w-4 h-4 text-[#3182F6]" />
              클릭 통계
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/my"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#3182F6] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1B64DA] transition-all"
                >
                  <span>내 링크 관리</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => logout()}
                  className="hidden sm:inline-flex rounded-xl border border-[#E5E8EB] bg-white px-3 py-2 text-xs font-medium text-[#6B7684] hover:bg-[#F2F4F6] transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={handleStartCTA}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-1.5 rounded-xl bg-[#3182F6] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1B64DA] active:scale-95 transition-all cursor-pointer"
              >
                <span>시작하기</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ─────────────────────────────────────────────────────────────
          2. 히어로 섹션 (Hero Section)
      ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-28">
        {/* 은은한 배경 그라데이션 장식 */}
        <div className="pointer-events-none absolute -top-40 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-gradient-to-tr from-[#3182F6]/15 via-[#00BFA5]/10 to-transparent blur-3xl" />

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          {/* 배지 */}
          <div className="inline-flex items-center gap-2 rounded-full border border-[#D1E2FF] bg-[#E8F3FF] px-4 py-1.5 text-xs sm:text-sm font-semibold text-[#1B64DA] shadow-xs mb-6">
            <Sparkles className="h-4 w-4 animate-pulse text-[#3182F6]" />
            <span>한양대학교 바이브 코딩 · 차세대 올인원 프로필 링크</span>
          </div>

          {/* 서비스 이름 및 메인 헤드라인 */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#191F28] leading-[1.2] sm:leading-[1.25]">
            흩어져 있는 나의 모든 링크,
            <br />
            <span className="bg-gradient-to-r from-[#3182F6] via-[#1B64DA] to-[#0091FF] bg-clip-text text-transparent">
              마이링크(MyLink)
            </span>
            로 한 번에 연결하세요
          </h1>

          {/* 태그라인 / 설명 */}
          <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg md:text-xl text-[#4E5968] font-normal leading-relaxed">
            SNS, 포트폴리오, 깃허브, 블로그까지 나만의 고유한 링크에 쏙!
            <br className="hidden sm:inline" />
            실시간 클릭 통계와 깔끔한 토스 디자인으로 나를 가장 감각적으로 표현해보세요.
          </p>

          {/* 히어로 CTA 버튼 그룹 */}
          <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <button
              onClick={handleStartCTA}
              disabled={isLoggingIn}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3182F6] px-7 py-4 text-base font-bold text-white shadow-lg shadow-[#3182F6]/25 hover:bg-[#1B64DA] hover:shadow-xl hover:shadow-[#3182F6]/30 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>{isLoggingIn ? "연결 중..." : "내 마이링크 무료로 만들기"}</span>
              <ArrowRight className="h-5 w-5" />
            </button>

            <a
              href="#preview"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D1D6DB] bg-white px-7 py-4 text-base font-semibold text-[#333D4B] shadow-xs hover:bg-[#F2F4F6] active:scale-[0.98] transition-all"
            >
              <Eye className="h-5 w-5 text-[#6B7684]" />
              <span>미리보기 둘러보기</span>
            </a>
          </div>

          {/* 서브 가치 제안 칩 */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-xs sm:text-sm text-[#6B7684]">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#3182F6]" />
              <span>10초 만에 간편 생성</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#3182F6]" />
              <span>실시간 클릭 분석 지원</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="h-4 w-4 text-[#3182F6]" />
              <span>모바일 최적화 반응형 UI</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          3. 기능 소개 섹션 (3 Feature Cards: 링크 관리, 클릭 통계, 개인 URL)
      ────────────────────────────────────────────────────────────── */}
      <section id="features" className="py-16 md:py-24 bg-white border-y border-[#E5E8EB]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-sm font-bold tracking-wider text-[#3182F6] uppercase">
              핵심 기능
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#191F28]">
              필요한 모든 것을 가장 직관적으로
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#6B7684]">
              복잡한 설정 없이, 핵심 기능 세 가지로 완벽한 프로필 링크를 완성합니다.
            </p>
          </div>

          {/* 3개 기능 카드 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* 카드 1: 링크 관리 */}
            <div className="group relative rounded-3xl border border-[#E5E8EB] bg-[#F9FAFB] p-6 sm:p-8 transition-all duration-300 hover:border-[#3182F6]/50 hover:bg-white hover:shadow-xl hover:shadow-[#3182F6]/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F3FF] text-[#3182F6] mb-6 transition-transform duration-300 group-hover:scale-110">
                <Layers className="h-6 w-6" />
              </div>
              <div className="inline-block rounded-md bg-[#D1E2FF]/60 px-2.5 py-0.5 text-xs font-semibold text-[#1B64DA] mb-3">
                간편한 편집
              </div>
              <h3 className="text-xl font-bold text-[#191F28]">링크 관리</h3>
              <p className="mt-2.5 text-sm sm:text-base text-[#4E5968] leading-relaxed">
                포트폴리오, GitHub, 인스타그램, 노션, 오픈채팅 등 다양한 링크를 실시간으로 간편하게 등록하고 순서와 제목을 손쉽게 편집할 수 있습니다.
              </p>

              {/* 시각적 미니 프리뷰 */}
              <div className="mt-6 rounded-2xl border border-[#E5E8EB] bg-white p-3.5 shadow-xs space-y-2">
                <div className="flex items-center justify-between rounded-xl bg-[#F2F4F6] px-3 py-2 text-xs font-medium text-[#333D4B]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#3182F6]" />
                    포트폴리오 웹사이트
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#8B95A1]" />
                </div>
                <div className="flex items-center justify-between rounded-xl bg-[#F2F4F6] px-3 py-2 text-xs font-medium text-[#333D4B]">
                  <span className="flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#191F28]" />
                    GitHub 저장소
                  </span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#8B95A1]" />
                </div>
              </div>
            </div>

            {/* 카드 2: 클릭 통계 */}
            <div className="group relative rounded-3xl border border-[#E5E8EB] bg-[#F9FAFB] p-6 sm:p-8 transition-all duration-300 hover:border-[#3182F6]/50 hover:bg-white hover:shadow-xl hover:shadow-[#3182F6]/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#E8F8F5] text-[#00A884] mb-6 transition-transform duration-300 group-hover:scale-110">
                <BarChart3 className="h-6 w-6" />
              </div>
              <div className="inline-block rounded-md bg-[#CCF4EB]/70 px-2.5 py-0.5 text-xs font-semibold text-[#008A6C] mb-3">
                실시간 분석
              </div>
              <h3 className="text-xl font-bold text-[#191F28]">클릭 통계</h3>
              <p className="mt-2.5 text-sm sm:text-base text-[#4E5968] leading-relaxed">
                방문자들이 어떤 링크에 가장 관심을 보였는지 실시간 클릭 수와 인기 순위를 한눈에 파악하고 직관적인 차트로 인사이트를 얻으세요.
              </p>

              {/* 시각적 미니 프리뷰 */}
              <div className="mt-6 rounded-2xl border border-[#E5E8EB] bg-white p-3.5 shadow-xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-[#333D4B]">오늘 총 클릭수</span>
                  <span className="inline-flex items-center text-xs font-bold text-[#00A884]">
                    <TrendingUp className="w-3 h-3 mr-0.5" /> +28.4%
                  </span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#191F28]">1,429</span>
                  <span className="text-xs text-[#8B95A1]">회 누적 집계</span>
                </div>
                <div className="mt-2.5 h-1.5 w-full bg-[#F2F4F6] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#00A884] to-[#3182F6] w-[74%] rounded-full" />
                </div>
              </div>
            </div>

            {/* 카드 3: 개인 URL */}
            <div className="group relative rounded-3xl border border-[#E5E8EB] bg-[#F9FAFB] p-6 sm:p-8 transition-all duration-300 hover:border-[#3182F6]/50 hover:bg-white hover:shadow-xl hover:shadow-[#3182F6]/5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F0EBF8] text-[#8045F5] mb-6 transition-transform duration-300 group-hover:scale-110">
                <Globe className="h-6 w-6" />
              </div>
              <div className="inline-block rounded-md bg-[#E2D5F9]/60 px-2.5 py-0.5 text-xs font-semibold text-[#6E33E4] mb-3">
                나만의 브랜딩
              </div>
              <h3 className="text-xl font-bold text-[#191F28]">개인 URL</h3>
              <p className="mt-2.5 text-sm sm:text-base text-[#4E5968] leading-relaxed">
                <code className="text-xs bg-[#E5E8EB]/70 px-1.5 py-0.5 rounded font-mono text-[#333D4B]">/[내이름]</code> 형태의 기억하기 쉬운 고유한 프로필 주소를 만들어 이력서나 인스타그램 프로필 바이오에 바로 등록하세요.
              </p>

              {/* 시각적 미니 프리뷰 */}
              <div className="mt-6 rounded-2xl border border-[#E5E8EB] bg-white p-3.5 shadow-xs">
                <div className="text-[11px] font-medium text-[#8B95A1] mb-1.5">내 고유 주소 예시</div>
                <div className="flex items-center justify-between rounded-xl bg-[#F2F4F6] px-3 py-2 text-xs font-semibold text-[#3182F6]">
                  <span className="truncate">mylink.hy/chaeyoon</span>
                  <span className="shrink-0 rounded-md bg-[#3182F6]/10 px-2 py-0.5 text-[11px] text-[#3182F6]">
                    복사
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          4. 미리보기 섹션 (Preview Mockup & CTA)
      ────────────────────────────────────────────────────────────── */}
      <section id="preview" className="py-16 md:py-24 bg-[#F2F4F6]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-sm font-bold tracking-wider text-[#3182F6] uppercase">
              실제 화면 미리보기
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-extrabold tracking-tight text-[#191F28]">
              스마트폰에서 이렇게 깔끔하게 보여요
            </h2>
            <p className="mt-3 text-base sm:text-lg text-[#6B7684]">
              토스 디자인 시스템(TDS) 스타일의 편안하고 세련된 UI로 방문자에게 최고의 첫인상을 선물합니다.
            </p>
          </div>

          {/* 목업 및 좌우 설명 영역 */}
          <div className="relative flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-14">
            {/* 좌측 부가 설명 (데스크톱) */}
            <div className="w-full lg:w-1/3 order-2 lg:order-1 space-y-4 sm:space-y-6">
              <div className="rounded-3xl border border-[#E5E8EB] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F3FF] text-[#3182F6]">
                    <Smartphone className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#191F28]">모바일 최적화 설계</h4>
                    <p className="text-xs text-[#8B95A1]">인스타 바이오 링크에 딱 맞는 규격</p>
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-[#4E5968] leading-relaxed">
                  어떤 스마트폰 기기에서도 한 손 조작이 쉽고 직관적인 모바일 퍼스트 레이아웃을 지원합니다.
                </p>
              </div>

              <div className="rounded-3xl border border-[#E5E8EB] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8F5] text-[#00A884]">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#191F28]">초고속 로딩 & 실시간 반영</h4>
                    <p className="text-xs text-[#8B95A1]">Next.js 기반 빠른 응답 속도</p>
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-[#4E5968] leading-relaxed">
                  링크를 수정하거나 추가하면 새로고침 없이 즉시 업데이트되어 방문자에게 노출됩니다.
                </p>
              </div>

              <div className="rounded-3xl border border-[#E5E8EB] bg-white p-6 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F0EBF8] text-[#8045F5]">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#191F28]">구글 안전 인증 연동</h4>
                    <p className="text-xs text-[#8B95A1]">Firebase 안전 저장소</p>
                  </div>
                </div>
                <p className="mt-3 text-xs sm:text-sm text-[#4E5968] leading-relaxed">
                  별도 가입 절차 없이 사용 중인 구글 계정으로 3초 만에 안전하게 시작할 수 있습니다.
                </p>
              </div>
            </div>

            {/* 중앙 스마트폰 실물 형태 목업 */}
            <div className="w-full max-w-[340px] sm:max-w-[360px] order-1 lg:order-2">
              <div className="relative rounded-[48px] border-[10px] border-[#1F2328] bg-white p-4 shadow-2xl ring-1 ring-black/10">
                {/* 상단 다이나믹 노치 */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 h-4 w-28 rounded-full bg-[#1F2328]" />

                {/* 스마트폰 내부 화면 콘텐츠 */}
                <div className="pt-6 pb-4 space-y-4">
                  {/* 상단 프로필 헤더 */}
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-3">
                      <div className="h-20 w-20 rounded-full bg-gradient-to-tr from-[#3182F6] to-[#00BFA5] p-1 shadow-md">
                        <div className="h-full w-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                          {/* 아바타 이니셜 */}
                          <span className="text-2xl font-black text-[#3182F6]">HY</span>
                        </div>
                      </div>
                      <span className="absolute bottom-0 right-0 flex h-6 w-6 items-center justify-center rounded-full bg-[#3182F6] text-white text-[10px] font-bold shadow-sm ring-2 ring-white">
                        ✓
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-[#191F28] flex items-center gap-1.5">
                      <span>임채윤</span>
                      <span className="text-xs font-normal text-[#8B95A1]">@chaeyoon</span>
                    </h3>
                    <p className="mt-1 text-xs text-[#4E5968] max-w-[240px] line-clamp-2">
                      한양대학교 컴퓨터소프트웨어학부 · 기술로 일상을 더 편리하게 만드는 엔지니어
                    </p>

                    {/* 태그 칩 */}
                    <div className="mt-2.5 flex flex-wrap justify-center gap-1.5">
                      <span className="rounded-full bg-[#F2F4F6] px-2.5 py-0.5 text-[11px] font-medium text-[#4E5968]">
                        🚀 협업 환영
                      </span>
                      <span className="rounded-full bg-[#E8F3FF] px-2.5 py-0.5 text-[11px] font-medium text-[#1B64DA]">
                        Next.js & AI
                      </span>
                    </div>
                  </div>

                  {/* 예시 링크 리스트 */}
                  <div className="space-y-2.5 pt-2">
                    {/* 링크 1 */}
                    <div className="flex items-center justify-between rounded-2xl border border-[#E5E8EB] bg-[#F9FAFB] p-3 transition-colors hover:border-[#3182F6] hover:bg-white shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-black text-white">
                          <GithubIcon className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-[#191F28]">GitHub 저장소</div>
                          <div className="text-[10px] text-[#8B95A1]">github.com/pico0602</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#3182F6] border border-[#E5E8EB]">
                        421 clicks
                      </span>
                    </div>

                    {/* 링크 2 */}
                    <div className="flex items-center justify-between rounded-2xl border border-[#E5E8EB] bg-[#F9FAFB] p-3 transition-colors hover:border-[#3182F6] hover:bg-white shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#3182F6] text-white">
                          <Globe className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-[#191F28]">포트폴리오 웹사이트</div>
                          <div className="text-[10px] text-[#8B95A1]">chaeyoon.dev</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#3182F6] border border-[#E5E8EB]">
                        892 clicks
                      </span>
                    </div>

                    {/* 링크 3 */}
                    <div className="flex items-center justify-between rounded-2xl border border-[#E5E8EB] bg-[#F9FAFB] p-3 transition-colors hover:border-[#3182F6] hover:bg-white shadow-xs">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#20C997] text-white">
                          <Sparkles className="h-4 w-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-xs font-bold text-[#191F28]">기술 블로그 (Velog)</div>
                          <div className="text-[10px] text-[#8B95A1]">velog.io/@chaeyoon</div>
                        </div>
                      </div>
                      <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-[#3182F6] border border-[#E5E8EB]">
                        315 clicks
                      </span>
                    </div>
                  </div>

                  {/* 하단 목업 푸터 */}
                  <div className="pt-2 text-center text-[10px] text-[#8B95A1]">
                    © MyLink · Toss Design System
                  </div>
                </div>

                {/* 하단 홈 인디케이터 바 */}
                <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-[#8B95A1]/40" />
              </div>
            </div>
          </div>

          {/* 미리보기 하단 전환 CTA */}
          <div className="mt-14 text-center">
            <div className="inline-flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={handleStartCTA}
                disabled={isLoggingIn}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-[#3182F6] px-8 py-4 text-base font-bold text-white shadow-lg shadow-[#3182F6]/25 hover:bg-[#1B64DA] active:scale-95 transition-all cursor-pointer"
              >
                <span>{isLoggingIn ? "연결 중..." : "지금 나만의 마이링크 만들기"}</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <Link
                href="/stats"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-[#D1D6DB] bg-white px-6 py-4 text-sm font-semibold text-[#4E5968] hover:bg-[#F2F4F6] transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-[#3182F6]" />
                <span>실시간 통계 현황 확인</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────
          5. 푸터 (Footer: 한양대학교 바이브 코딩 & GitHub 링크)
      ────────────────────────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-[#E5E8EB] bg-white py-12">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* 좌측 정보 */}
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#3182F6] text-white">
                  <Link2 className="h-4 w-4" />
                </div>
                <span className="font-bold text-[#191F28] tracking-tight">
                  마이링크 (MyLink)
                </span>
              </div>
              <p className="text-sm font-semibold text-[#333D4B]">
                한양대학교 바이브 코딩 (Hanyang University Vibe Coding)
              </p>
              <p className="mt-1 text-xs text-[#8B95A1]">
                누구나 손쉽게 만드는 나만의 올인원 프로필 & 링크인바이오 서비스
              </p>
            </div>

            {/* 우측 링크 및 깃허브 */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <Link
                href="/stats"
                className="text-xs font-semibold text-[#6B7684] hover:text-[#3182F6] transition-colors"
              >
                클릭 통계 대시보드
              </Link>
              <Link
                href="/my"
                className="text-xs font-semibold text-[#6B7684] hover:text-[#3182F6] transition-colors"
              >
                내 프로필 / 관리
              </Link>
              <a
                href="https://github.com/pico0602/my-link-hy"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl border border-[#D1D6DB] bg-white px-3.5 py-2 text-xs font-semibold text-[#333D4B] shadow-2xs hover:bg-[#F2F4F6] hover:text-[#191F28] transition-all"
              >
                <GithubIcon className="h-4 w-4" />
                <span>GitHub 저장소 바로가기</span>
                <ExternalLink className="h-3 w-3 text-[#8B95A1]" />
              </a>
            </div>
          </div>

          <div className="mt-8 border-t border-[#F2F4F6] pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-[#8B95A1] gap-2">
            <p>© 2026 MyLink. Hanyang Univ Vibe Coding. All rights reserved.</p>
            <p>Designed with Toss Design System (TDS) style</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
