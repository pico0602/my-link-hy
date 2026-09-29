"use client";

import React from "react";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TopBarProps {
  onShare: () => void;
}

export function TopBar({ onShare }: TopBarProps) {
  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between bg-white/80 px-5 backdrop-blur-md border-b border-[#E5E8EB]">
      {/* 브랜드 로고 */}
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#3182F6] text-white shadow-xs">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
          </svg>
        </div>
        <span className="text-[17px] font-bold tracking-tight text-[#191F28]">
          마이링크
        </span>
      </div>

      {/* 공유 버튼 (TDS Button ghost 재사용) */}
      <Button
        variant="ghost"
        size="sm"
        onClick={onShare}
        className="rounded-full px-3 py-1.5 font-semibold text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28]"
        aria-label="프로필 주소 공유"
      >
        <Share2 className="w-4 h-4 text-[#4E5968]" />
        <span>공유</span>
      </Button>
    </header>
  );
}
