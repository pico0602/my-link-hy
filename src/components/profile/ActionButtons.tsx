"use client";

import React from "react";
import { Mail, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  likes: number;
  hasLiked: boolean;
  onCopyEmail: () => void;
  onLike: () => void;
}

export function ActionButtons({
  likes,
  hasLiked,
  onCopyEmail,
  onLike,
}: ActionButtonsProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {/* 이메일 복사 버튼 */}
      <Button
        variant="secondary"
        size="lg"
        onClick={onCopyEmail}
        className="w-full text-[14px]"
        aria-label="이메일 주소 복사하기"
      >
        <Mail className="w-4 h-4 text-[#4E5968]" />
        <span>이메일 복사</span>
      </Button>

      {/* 응원하기 버튼 */}
      <Button
        variant={hasLiked ? "weak" : "secondary"}
        size="lg"
        onClick={onLike}
        className="w-full text-[14px]"
        aria-label={hasLiked ? "응원 취소하기" : "응원하기"}
      >
        <Heart
          className={`w-4 h-4 transition-transform duration-200 ${
            hasLiked
              ? "fill-[#3182F6] text-[#3182F6] scale-110"
              : "text-[#6B7684]"
          }`}
        />
        <span>응원 {likes.toLocaleString()}</span>
      </Button>
    </div>
  );
}
