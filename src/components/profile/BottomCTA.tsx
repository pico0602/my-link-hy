"use client";

import React from "react";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BottomCTAProps {
  onCopyEmail: () => void;
}

export function BottomCTA({ onCopyEmail }: BottomCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 pointer-events-none">
      {/* 상단 부드러운 그라디언트 페이드 (design.md bottom-cta 규칙) */}
      <div className="h-8 w-full bg-gradient-to-t from-[#F2F4F6] to-transparent" />
      {/* 하단 고정 버튼 영역 */}
      <div className="bg-[#F2F4F6] px-4 pb-6 pt-1">
        <div className="mx-auto max-w-[480px] pointer-events-auto">
          <Button
            variant="primary"
            size="xl"
            onClick={onCopyEmail}
            className="w-full"
            aria-label="이메일로 문의하기"
          >
            <Mail className="w-5 h-5 text-white/90" />
            <span>이메일로 문의하기</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
