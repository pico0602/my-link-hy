"use client";

import React from "react";
import { UserLinkPage } from "@/types/link";
import { Card } from "@/components/ui/card";
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarIndicator,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ActionButtons } from "./ActionButtons";

interface ProfileCardProps {
  profile: UserLinkPage;
  hasLiked: boolean;
  onCopyEmail: () => void;
  onLike: () => void;
}

export function ProfileCard({
  profile,
  hasLiked,
  onCopyEmail,
  onLike,
}: ProfileCardProps) {
  // 이니셜 생성
  const getInitials = (name: string) => {
    if (!name) return "CY";
    if (name === "임채윤") return "CY";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="p-6">
      {/* 상단 프로필 헤더 */}
      <div className="flex items-center gap-4">
        {/* 원형 아바타 (56px) + 온라인 상태 점 */}
        <Avatar size="xl">
          {profile.avatarUrl && (
            <AvatarImage src={profile.avatarUrl} alt={profile.displayName} />
          )}
          <AvatarFallback>{getInitials(profile.displayName)}</AvatarFallback>
          <AvatarIndicator status="online" />
        </Avatar>

        {/* 이름, 역할 뱃지, 이메일 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-[20px] font-bold tracking-tight text-[#191F28]">
              {profile.displayName}
            </h1>
            {profile.badge && (
              <Badge variant="brand">{profile.badge}</Badge>
            )}
          </div>
          <p className="text-[13px] text-[#8B95A1] mt-0.5 truncate">
            {profile.email}
          </p>
        </div>
      </div>

      {/* 소개글 박스 */}
      {profile.bio && (
        <div className="mt-4 rounded-[16px] bg-[#F9FAFB] p-3.5 border border-[#F2F4F6]">
          <p className="text-[14px] leading-relaxed text-[#4E5968] break-keep">
            {profile.bio}
          </p>
        </div>
      )}

      {/* 액션 버튼 행 (이메일 복사 / 응원하기) */}
      <div className="mt-4">
        <ActionButtons
          likes={profile.likes}
          hasLiked={hasLiked}
          onCopyEmail={onCopyEmail}
          onLike={onLike}
        />
      </div>
    </Card>
  );
}
