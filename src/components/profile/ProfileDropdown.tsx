"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User } from "firebase/auth";
import { ChevronDown, Copy, Check, LogOut, Loader2, ShieldCheck, UserCog, Globe, ExternalLink } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface ProfileDropdownProps {
  user: User;
  username?: string;
  userPageHref?: string;
  onLogout: () => Promise<void>;
  onCopyUid?: () => void;
  onEditProfile?: () => void;
}

export function ProfileDropdown({
  user,
  username,
  userPageHref,
  onLogout,
  onCopyUid,
  onEditProfile,
}: ProfileDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 드롭다운 외부 클릭 시 닫기
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleCopyUid = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(user.uid);
      setCopied(true);
      if (onCopyUid) onCopyUid();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleLogoutClick = async () => {
    try {
      setIsLoggingOut(true);
      await onLogout();
      setIsOpen(false);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const displayName =
    user.displayName || (user.email ? user.email.split("@")[0] : "사용자");

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      {/* 트리거 버튼 (아바타 + 이름 + 드롭다운 화살표) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="flex items-center gap-1.5 sm:gap-2 rounded-full bg-[#F2F4F6] py-1 pl-1 pr-2.5 sm:pr-3 text-left transition-all hover:bg-[#E5E8EB] active:scale-[0.98] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#3182F6]/30"
      >
        <Avatar size="sm" className="h-6 w-6 border border-white">
          {user.photoURL && <AvatarImage src={user.photoURL} alt={displayName} />}
          <AvatarFallback className="text-[10px]">
            {getInitials(displayName)}
          </AvatarFallback>
        </Avatar>
        <span className="max-w-[75px] sm:max-w-[110px] truncate text-[12px] sm:text-[13px] font-semibold text-[#191F28]">
          {displayName}
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-[#8B95A1] transition-transform duration-200 ${
            isOpen ? "rotate-180 text-[#191F28]" : ""
          }`}
        />
      </button>

      {/* 드롭다운 메뉴 (TDS Card Popover 스타일) */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-white p-4 shadow-xl border border-[#E5E8EB] z-50 transition-all duration-150 animate-in fade-in zoom-in-95 origin-top-right">
          {/* 1. 프로필 아바타 & 표시 이름 & 이메일 */}
          <div className="flex items-start gap-3.5 pb-3">
            <Avatar size="lg" className="h-12 w-12 border-2 border-white shadow-xs">
              {user.photoURL && <AvatarImage src={user.photoURL} alt={displayName} />}
              <AvatarFallback className="text-[14px] font-bold bg-[#E8F3FF] text-[#3182F6]">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="text-[15px] font-bold text-[#191F28] truncate tracking-tight">
                  {displayName}
                </h3>
                {username && (
                  <span className="text-[11px] font-semibold text-[#3182F6] bg-[#E8F3FF] px-1.5 py-0.5 rounded-md">
                    @{username}
                  </span>
                )}
              </div>
              <p className="text-[12px] text-[#8B95A1] truncate mt-0.5">
                {user.email || "이메일 정보 없음"}
              </p>
              {/* Google 계정 연동 뱃지 */}
              <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#F2F4F6] px-2 py-0.5 text-[11px] font-medium text-[#4E5968]">
                <svg className="w-3 h-3 shrink-0" viewBox="0 0 24 24">
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
                <span>Google 계정 연동</span>
              </div>
            </div>
          </div>

          {/* 2. 내 고유 식별자 (UID) 정보 박스 */}
          <div className="rounded-xl bg-[#F9FAFB] p-2.5 border border-[#F2F4F6] mt-1">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-medium text-[#8B95A1]">
                고유 식별자 (UID)
              </span>
              <button
                type="button"
                onClick={handleCopyUid}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-[#3182F6] hover:text-[#1B64DA] transition-colors cursor-pointer"
                title="UID 복사"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-[#00B460]" />
                    <span className="text-[#00B460]">복사됨</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>복사</span>
                  </>
                )}
              </button>
            </div>
            <p className="font-mono text-[11px] text-[#4E5968] break-all select-all bg-white px-2 py-1 rounded-md border border-[#E5E8EB]">
              {user.uid}
            </p>
          </div>

          {/* 내 공개 페이지 바로가기 (드롭다운 내 링크) */}
          {userPageHref && (
            <Link
              href={userPageHref}
              onClick={() => setIsOpen(false)}
              className="mt-2.5 flex w-full items-center justify-center gap-2 rounded-xl py-2 px-3 text-[13px] font-semibold text-[#3182F6] bg-[#E8F3FF] hover:bg-[#D4E8FF] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Globe className="w-4 h-4 text-[#3182F6]" />
              <span>내 공개 페이지 보기</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#3182F6] opacity-70" />
            </Link>
          )}

          {/* 프로필 수정 액션 버튼 */}
          {onEditProfile && (
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                onEditProfile();
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2 px-3 text-[13px] font-semibold text-[#4E5968] bg-[#F2F4F6] hover:bg-[#E5E8EB] active:scale-[0.98] transition-all cursor-pointer"
            >
              <UserCog className="w-4 h-4 text-[#6B7684]" />
              <span>프로필 정보 수정</span>
            </button>
          )}

          {/* 구분선 */}
          <div className="my-2.5 border-t border-[#F2F4F6]" />

          {/* 3. 하단 로그아웃 액션 버튼 */}
          <button
            type="button"
            disabled={isLoggingOut}
            onClick={handleLogoutClick}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2 px-3 text-[13px] font-semibold text-[#F04452] hover:bg-[#FEECEE] transition-colors cursor-pointer disabled:opacity-50"
          >
            {isLoggingOut ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            <span>로그아웃</span>
          </button>
        </div>
      )}
    </div>
  );
}
