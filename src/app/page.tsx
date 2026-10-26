"use client";

import React from "react";
import { useProfile } from "@/hooks/useProfile";
import { TopBar } from "@/components/profile/TopBar";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { StatusCards } from "@/components/profile/StatusCards";
import { LinkList } from "@/components/profile/LinkList";
import { SocialBar } from "@/components/profile/SocialBar";
import { TagChips } from "@/components/profile/TagChips";
import { BottomCTA } from "@/components/profile/BottomCTA";
import { Toast } from "@/components/profile/Toast";

export default function HomePage() {
  const {
    profile,
    isLoadingLinks,
    hasLiked,
    toastMessage,
    handleCopyEmail,
    handleShare,
    handleLike,
    handleLinkClick,
    handleAddLink,
  } = useProfile();

  return (
    <div className="relative min-h-screen w-full bg-[#F2F4F6] text-[#191F28] pb-32">
      {/* 1. TopBar (56px, Sticky) */}
      <TopBar onShare={handleShare} />

      {/* 메인 모바일 퍼스트 컨테이너 (max-w-[480px]) */}
      <main className="mx-auto flex w-full max-w-[480px] flex-col px-4 pt-4 space-y-3">
        {/* 2 & 3. 프로필 메인 카드 및 액션 버튼 행 */}
        <ProfileCard
          profile={profile}
          hasLiked={hasLiked}
          onCopyEmail={handleCopyEmail}
          onLike={handleLike}
        />

        {/* 4. 현황 요약 카드 2열 */}
        <StatusCards
          focusArea={profile.focusArea}
          status={profile.status}
        />

        {/* 5. 바로가기 링크 리스트 */}
        <LinkList
          links={profile.links}
          isLoading={isLoadingLinks}
          onLinkClick={handleLinkClick}
          onAddLink={handleAddLink}
        />

        {/* 6. 소셜 아이콘 바 */}
        <SocialBar socials={profile.socials} />

        {/* 7. 관심 키워드 칩스 */}
        <TagChips tags={profile.tags} />

        {/* 8. 푸터 */}
        <footer className="pt-6 pb-2 text-center">
          <p className="text-[13px] text-[#8B95A1]">
            © 2026 {profile.displayName || "Lim Chaeyoon"} · MyLink Toss Design System
          </p>
        </footer>
      </main>

      {/* 9. BottomCTA (이메일로 문의하기 하단 고정) */}
      <BottomCTA onCopyEmail={handleCopyEmail} />

      {/* 10. TDS Toast 알림 */}
      <Toast message={toastMessage} />
    </div>
  );
}
