import React from "react";
import Link from "next/link";
import { UserX, Home, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="relative min-h-screen w-full bg-[#F2F4F6] text-[#191F28]">
      {/* TopBar */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between bg-white/80 px-4 sm:px-5 backdrop-blur-md border-b border-[#E5E8EB]">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3182F6] text-white shadow-xs">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
            </svg>
          </div>
          <span className="text-[16px] sm:text-[17px] font-bold tracking-tight text-[#191F28]">
            마이링크
          </span>
        </Link>
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="h-8 rounded-full px-3 text-[13px] font-semibold text-[#4E5968] hover:bg-[#F2F4F6]"
          >
            <Home className="w-3.5 h-3.5 mr-1 text-[#4E5968]" />
            홈으로
          </Button>
        </Link>
      </header>

      {/* Main Container */}
      <main className="mx-auto flex w-full max-w-[480px] flex-col px-4 pt-16 sm:pt-20">
        <Card className="p-8 text-center border border-[#E5E8EB] shadow-xs">
          {/* 아이콘 */}
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#FEECEE] text-[#F04452] mb-5">
            <UserX className="h-8 w-8 stroke-[2.2]" />
          </div>

          {/* 에러 코드 뱃지 */}
          <div className="inline-block rounded-full bg-[#F2F4F6] px-3 py-1 text-[12px] font-bold text-[#8B95A1] mb-2">
            404 NOT FOUND
          </div>

          {/* 타이틀 및 설명 */}
          <h1 className="text-[22px] font-bold text-[#191F28] tracking-tight mb-2">
            사용자를 찾을 수 없어요
          </h1>
          <p className="text-[14px] leading-relaxed text-[#6B7684] break-keep mb-8 max-w-[320px] mx-auto">
            요청하신 사용자 이름(username)이 올바르지 않거나, 아직 프로필이 등록되지 않은 페이지입니다.
          </p>

          {/* 액션 버튼 */}
          <div className="flex flex-col gap-2.5">
            <Link href="/" className="w-full">
              <Button
                variant="primary"
                size="lg"
                className="w-full h-12 rounded-2xl text-[15px] font-semibold shadow-xs"
              >
                <Home className="w-4 h-4 mr-2" />
                마이링크 홈으로 가기
              </Button>
            </Link>

            <Link href="/" className="w-full">
              <Button
                variant="secondary"
                size="lg"
                className="w-full h-12 rounded-2xl text-[14px] font-semibold text-[#4E5968] bg-[#F2F4F6] hover:bg-[#E5E8EB]"
              >
                <Sparkles className="w-4 h-4 mr-2 text-[#3182F6]" />
                나만의 마이링크 만들기
              </Button>
            </Link>
          </div>
        </Card>

        {/* 푸터 */}
        <footer className="pt-10 pb-6 text-center">
          <p className="text-[13px] text-[#8B95A1]">
            © 2026 MyLink · Toss Design System
          </p>
        </footer>
      </main>
    </div>
  );
}
