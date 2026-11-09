"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Share2, Loader2, Globe, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileDropdown } from "@/components/profile/ProfileDropdown";

interface TopBarProps {
  onShare: () => void;
  username?: string;
  displayName?: string;
  userPageHref?: string;
  onLoginSuccess?: (userName: string) => void;
  onLogoutSuccess?: () => void;
  onCopyUid?: () => void;
  onEditProfile?: () => void;
}

export function TopBar({
  onShare,
  username,
  displayName,
  userPageHref,
  onLoginSuccess,
  onLogoutSuccess,
  onCopyUid,
  onEditProfile,
}: TopBarProps) {
  const { user, loading, signInWithGoogle, logout } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const targetHref =
    userPageHref ||
    (displayName
      ? `/${encodeURIComponent(displayName)}`
      : username
      ? `/${encodeURIComponent(username)}`
      : user?.displayName
      ? `/${encodeURIComponent(user.displayName)}`
      : null);

  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      const loggedInUser = await signInWithGoogle();
      if (loggedInUser && onLoginSuccess) {
        onLoginSuccess(loggedInUser.displayName || loggedInUser.email || "사용자");
      }
    } catch (error) {
      console.error("로그인 중 에러:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      if (onLogoutSuccess) {
        onLogoutSuccess();
      }
    } catch (error) {
      console.error("로그아웃 중 에러:", error);
    }
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between bg-white/80 px-3 sm:px-5 backdrop-blur-md border-b border-[#E5E8EB]">
      {/* 브랜드 로고 */}
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

      {/* 우측 인증 및 액션 영역 */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
        {loading ? (
          <div className="h-8 w-24 animate-pulse rounded-xl bg-[#F2F4F6]" />
        ) : user ? (
          <>
            {/* 1번: 프로필 아바타 바로 옆 내 페이지 바로가기 버튼 (반응형: 모바일 아이콘 캡슐 / 데스크톱 라벨) */}
            {targetHref && (
              <Link
                href={targetHref}
                className="inline-flex h-8 items-center justify-center rounded-full bg-[#E8F3FF] px-2 sm:px-2.5 text-[12px] sm:text-[13px] font-semibold text-[#3182F6] hover:bg-[#DBECFF] active:scale-95 transition-all shrink-0 border border-[#D4E8FF]/60"
                title="내 공개 페이지 바로가기"
                aria-label="내 공개 페이지 바로가기"
              >
                <Globe className="w-3.5 h-3.5 text-[#3182F6] shrink-0" />
                <span className="hidden sm:inline ml-1 font-semibold">내 페이지</span>
                <ExternalLink className="w-3 h-3 text-[#3182F6] opacity-70 hidden sm:inline ml-0.5" />
              </Link>
            )}

            {/* 사용자 프로필 드롭다운 메뉴 (아바타) */}
            <ProfileDropdown
              user={user}
              username={username}
              userPageHref={targetHref || undefined}
              onLogout={handleLogout}
              onCopyUid={onCopyUid}
              onEditProfile={onEditProfile}
            />
          </>
        ) : (
          /* 로그아웃 상태: "Google로 로그인" 버튼 (클릭 시 구글 팝업) */
          <Button
            variant="secondary"
            size="sm"
            disabled={isSubmitting}
            onClick={handleLogin}
            className="h-8 rounded-xl px-2.5 sm:px-3 text-[12px] sm:text-[13px] font-semibold text-[#191F28] bg-white border border-[#E5E8EB] shadow-2xs hover:bg-[#F9FAFB] active:scale-[0.98]"
            aria-label="Google로 로그인"
          >
            {isSubmitting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5 text-[#3182F6]" />
            ) : (
              <svg className="w-3.5 h-3.5 mr-1.5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Google로 로그인</span>
          </Button>
        )}

        {/* 공유 버튼 (TDS Button ghost 재사용) */}
        <Button
          variant="ghost"
          size="sm"
          onClick={onShare}
          className="h-8 rounded-full px-2 sm:px-2.5 font-semibold text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28]"
          aria-label="프로필 주소 공유"
        >
          <Share2 className="w-3.5 h-3.5 text-[#4E5968] sm:mr-1" />
          <span className="hidden sm:inline text-[13px]">공유</span>
        </Button>
      </div>
    </header>
  );
}
