"use client";

import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useProfile } from "@/hooks/useProfile";
import { TopBar } from "@/components/profile/TopBar";
import { ProfileCard } from "@/components/profile/ProfileCard";
import { StatusCards } from "@/components/profile/StatusCards";
import { LinkList } from "@/components/profile/LinkList";
import { SocialBar } from "@/components/profile/SocialBar";
import { TagChips } from "@/components/profile/TagChips";
import { BottomCTA } from "@/components/profile/BottomCTA";
import { Toast } from "@/components/profile/Toast";
import { FirestorePathBanner } from "@/components/profile/FirestorePathBanner";
import { LoginPromptCard } from "@/components/profile/LoginPromptCard";
import { EditProfileDialog } from "@/components/profile/EditProfileDialog";

export default function HomePage() {
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const { signInWithGoogle } = useAuth();

  const {
    user,
    authLoading,
    profile,
    isLoadingLinks,
    hasLiked,
    toastMessage,
    showToast,
    handleCopyEmail,
    handleShare,
    handleLike,
    handleLinkClick,
    handleAddLink,
    handleUpdateLink,
    handleDeleteLink,
    handleUpdateProfile,
  } = useProfile();

  const handleOpenEditProfile = async () => {
    if (!user) {
      showToast("프로필을 수정하려면 먼저 로그인이 필요해요.");
      try {
        const loggedIn = await signInWithGoogle();
        if (loggedIn) {
          showToast(`${loggedIn.displayName || "사용자"}님, 환영합니다!`);
          setIsEditProfileOpen(true);
        }
      } catch (err) {
        console.error("로그인 중 에러:", err);
      }
      return;
    }
    setIsEditProfileOpen(true);
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F2F4F6] text-[#191F28] pb-32">
      {/* 1. TopBar (56px, Sticky) - Google 로그인/로그아웃 및 사용자 프로필 드롭다운 */}
      <TopBar
        username={profile.username}
        displayName={profile.displayName}
        onShare={handleShare}
        onLoginSuccess={(userName) => {
          showToast(`${userName}님, 환영합니다!`);
        }}
        onLogoutSuccess={() => {
          showToast("로그아웃되었어요");
        }}
        onCopyUid={() => {
          showToast("고유 식별자(UID)가 복사되었어요");
        }}
        onEditProfile={handleOpenEditProfile}
      />

      {/* 메인 모바일 퍼스트 컨테이너 (max-w-[480px]) */}
      <main className="mx-auto flex w-full max-w-[480px] flex-col px-4 pt-4 space-y-3">
        {/* 2 & 3. 프로필 메인 카드 및 액션 버튼 행 */}
        <ProfileCard
          profile={profile}
          hasLiked={hasLiked}
          isLoggedIn={!authLoading && !!user}
          onCopyEmail={handleCopyEmail}
          onLike={handleLike}
          onEditProfile={handleOpenEditProfile}
        />

        {/* 4. 현황 요약 카드 2열 */}
        <StatusCards
          focusArea={profile.focusArea}
          status={profile.status}
        />

        {/* Firestore 경로 유지 정보 배너 (로그인 시 노출: users/{user.uid}/links) */}
        {!authLoading && user && (
          <FirestorePathBanner
            uid={user.uid}
            onCopy={() => showToast("Firestore 경로가 복사되었어요")}
          />
        )}

        {/* 5. 로그인 상태에 따른 화면 구성 */}
        {authLoading ? (
          <div className="rounded-3xl bg-white p-8 text-center border border-[#E5E8EB]">
            <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#3182F6] border-t-transparent" />
            <p className="mt-2 text-[13px] text-[#8B95A1]">
              계정 정보를 불러오는 중...
            </p>
          </div>
        ) : user ? (
          /* 로그인 상태: 개인화된 users/{user.uid}/links 링크 리스트 및 관리 기능 */
          <LinkList
            links={profile.links}
            isLoading={isLoadingLinks}
            onLinkClick={handleLinkClick}
            onAddLink={handleAddLink}
            onUpdateLink={handleUpdateLink}
            onDeleteLink={handleDeleteLink}
          />
        ) : (
          /* 비로그인 상태: 로그인 후 이용 설명 안내 카드 */
          <LoginPromptCard
            onLoginSuccess={(userName) => {
              showToast(`${userName}님, 환영합니다!`);
            }}
          />
        )}

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

      {/* 10. 프로필 수정 다이얼로그 (users/{user.uid}/profile에 저장) */}
      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        userId={user?.uid || ""}
        initialData={{
          username: profile.username || "",
          displayName: profile.displayName || "",
          bio: profile.bio || "",
        }}
        onSave={handleUpdateProfile}
      />

      {/* 11. TDS Toast 알림 */}
      <Toast message={toastMessage} />
    </div>
  );
}
