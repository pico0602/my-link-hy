"use client";

import React from "react";
import { Card } from "@/components/ui/card";

interface StatusCardsProps {
  focusArea?: string;
  status?: string;
}

export function StatusCards({
  focusArea = "Next.js 16 & AI",
  status = "활발히 코딩 중",
}: StatusCardsProps) {
  return (
    <section className="grid grid-cols-2 gap-3">
      {/* 카드 1: 현재 집중 분야 */}
      <Card className="p-4 rounded-[20px]">
        <span className="text-[12px] font-semibold text-[#8B95A1] block">
          현재 집중 분야
        </span>
        <p className="mt-1 text-[15px] font-bold text-[#191F28] tracking-tight truncate">
          {focusArea}
        </p>
      </Card>

      {/* 카드 2: 학습 상태 */}
      <Card className="p-4 rounded-[20px]">
        <span className="text-[12px] font-semibold text-[#8B95A1] block">
          학습 상태
        </span>
        <div className="mt-1 flex items-center gap-1.5 min-w-0">
          <span className="relative flex h-2 w-2 shrink-0">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00B460] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00B460]" />
          </span>
          <p className="text-[15px] font-bold text-[#191F28] tracking-tight truncate">
            {status}
          </p>
        </div>
      </Card>
    </section>
  );
}
