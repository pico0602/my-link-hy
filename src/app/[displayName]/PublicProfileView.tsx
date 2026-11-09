"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  Share2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Heart,
  Copy,
  Mail,
  Sparkles,
  BookOpen,
  FileText,
  FolderGit2,
  Coffee,
} from "lucide-react";
import { LinkItem, LinkCategoryType, CategoryItem } from "@/types/link";
import { SearchedUser, incrementLinkClick, subscribeFirestoreLinks } from "@/lib/firestore";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback, AvatarIndicator } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { Toast } from "@/components/profile/Toast";
import { formatRelativeTime } from "@/lib/utils";

interface PublicProfileViewProps {
  user: SearchedUser;
  initialLinks: LinkItem[];
}

const CATEGORIES: CategoryItem[] = [
  { id: "all", name: "전체" },
  { id: "project", name: "프로젝트" },
  { id: "blog", name: "블로그·글" },
  { id: "social", name: "SNS" },
  { id: "contact", name: "연락처" },
];

function renderLinkIcon(link: LinkItem) {
  const iconClass = "w-5 h-5";

  if (link.iconType === "github" || link.id === "github") {
    return (
      <svg className={`${iconClass} text-[#333D4B]`} fill="currentColor" viewBox="0 0 24 24">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    );
  }

  if (link.iconType === "notion" || link.id === "portfolio-notion") {
    return <FileText className={`${iconClass} text-[#333D4B]`} />;
  }

  if (link.id === "project-ai-note" || link.id === "project-vibe") {
    return <Sparkles className={`${iconClass} text-[#3182F6]`} />;
  }

  if (link.iconType === "blog" || link.id === "tech-blog") {
    return <BookOpen className={`${iconClass} text-[#333D4B]`} />;
  }

  if (link.id === "design-system" || link.id === "project-design-system") {
    return <FolderGit2 className={`${iconClass} text-[#333D4B]`} />;
  }

  if (link.id === "linkedin") {
    return (
      <svg className={`${iconClass} text-[#0A66C2]`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    );
  }

  if (link.iconType === "instagram" || link.id === "instagram") {
    return (
      <svg className={`${iconClass} text-[#E4405F]`} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    );
  }

  if (link.id === "coffee-chat") {
    return <Coffee className={`${iconClass} text-[#F59E0B]`} />;
  }

  if (link.id === "contact-mail" || link.url.startsWith("mailto:")) {
    return <Mail className={`${iconClass} text-[#333D4B]`} />;
  }

  return <ExternalLink className={`${iconClass} text-[#333D4B]`} />;
}

export function PublicProfileView({ user, initialLinks }: PublicProfileViewProps) {
  const [links, setLinks] = useState<LinkItem[]>(initialLinks);
  const [activeCategory, setActiveCategory] = useState<LinkCategoryType>("all");
  const [likes, setLikes] = useState<number>(user.likes ?? 0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    const timer = setTimeout(() => setToastMessage(null), 2400);
    return () => clearTimeout(timer);
  }, []);

  // Firestore users/{userId}/links 실시간 동기화
  useEffect(() => {
    if (!user.userId || user.userId === "anonymous") return;

    const unsubscribe = subscribeFirestoreLinks(
      user.userId,
      (updatedLinks) => {
        if (updatedLinks && updatedLinks.length > 0) {
          setLinks(updatedLinks);
        }
      },
      (err) => {
        console.warn("PublicProfileView link subscription error:", err);
      }
    );

    return () => {
      unsubscribe();
    };
  }, [user.userId]);

  // 이니셜 생성
  const getInitials = (name: string) => {
    if (!name) return "MY";
    return name.slice(0, 2).toUpperCase();
  };

  // 링크 클릭 핸들러 (새 탭으로 열기 + 클릭 수 카운트 증가)
  const handleLinkClick = useCallback(
    (linkId: string, url: string) => {
      // 1. 로컬 상태 즉시 증가
      setLinks((prev) =>
        prev.map((l) =>
          l.id === linkId
            ? {
                ...l,
                clicks: (l.clicks ?? l.clickCount ?? 0) + 1,
                clickCount: (l.clickCount ?? l.clicks ?? 0) + 1,
              }
            : l
        )
      );

      // 2. Firestore 클릭 수 증가 시도
      incrementLinkClick(user.userId, linkId);

      // 3. 새 탭으로 링크 열기
      if (typeof window !== "undefined") {
        window.open(url, "_blank", "noopener,noreferrer");
      }
    },
    [user.userId]
  );

  // 이메일 복사
  const handleCopyEmail = useCallback(() => {
    if (!user.email) {
      showToast("등록된 이메일이 없어요");
      return;
    }
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(user.email);
    }
    showToast("이메일 주소가 복사되었어요");
  }, [user.email, showToast]);

  // 공유하기
  const handleShare = useCallback(async () => {
    if (typeof window === "undefined") return;

    const shareData = {
      title: `${user.displayName}의 마이링크`,
      text: user.bio,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("프로필 주소가 복사되었어요");
    }
  }, [user.displayName, user.bio, showToast]);

  // 응원하기
  const handleLike = useCallback(() => {
    setHasLiked((prev) => {
      const next = !prev;
      setLikes((curr) => (next ? curr + 1 : Math.max(0, curr - 1)));
      if (next) {
        showToast("소중한 응원이 전달되었어요 ❤️");
      }
      return next;
    });
  }, [showToast]);

  // 카테고리 필터링
  const activeLinks = links
    .filter((link) => link.isActive !== false)
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bTime - aTime;
    });

  const displayedLinks =
    activeCategory === "all"
      ? activeLinks
      : activeLinks.filter((link) => link.category === activeCategory);

  return (
    <div className="relative min-h-screen w-full bg-[#F2F4F6] text-[#191F28] pb-24">
      {/* 1. 상단 탑바 */}
      <header className="sticky top-0 z-40 flex h-14 w-full items-center justify-between bg-white/80 px-4 sm:px-5 backdrop-blur-md border-b border-[#E5E8EB]">
        {/* 로고 */}
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

        {/* 우측 액션 */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="h-8 rounded-full px-2.5 sm:px-3 font-semibold text-[#4E5968] hover:bg-[#F2F4F6]"
            aria-label="공유하기"
          >
            <Share2 className="w-3.5 h-3.5 text-[#4E5968] sm:mr-1" />
            <span className="hidden sm:inline text-[13px]">공유</span>
          </Button>

          <Link href="/">
            <Button
              variant="secondary"
              size="sm"
              className="h-8 rounded-xl px-2.5 sm:px-3 text-[12px] sm:text-[13px] font-semibold text-[#3182F6] bg-[#E8F3FF] hover:bg-[#DBECFF] border-none"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>내 링크 만들기</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* 2. 메인 컨테이너 (max-w-[480px]) */}
      <main className="mx-auto flex w-full max-w-[480px] flex-col px-4 pt-4 space-y-3">
        {/* 상단: 프로필 카드 (이름, 소개글, 아바타, 액션) */}
        <Card className="p-6 relative">
          <div className="flex items-center gap-4">
            {/* 원형 아바타 (56px) + 온라인 점 */}
            <Avatar size="xl">
              {user.avatarUrl && (
                <AvatarImage src={user.avatarUrl} alt={user.displayName} />
              )}
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
              <AvatarIndicator status="online" />
            </Avatar>

            {/* 이름, 뱃지, username, 이메일 */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-[20px] font-bold tracking-tight text-[#191F28]">
                  {user.displayName}
                </h1>
                {user.badge && <Badge variant="brand">{user.badge}</Badge>}
              </div>

              <div className="flex items-center gap-2 text-[13px] text-[#8B95A1] mt-0.5 truncate">
                {user.username && (
                  <span className="font-semibold text-[#3182F6]">
                    @{user.username}
                  </span>
                )}
                {user.username && user.email && (
                  <span className="text-[#D1D6DB]">·</span>
                )}
                {user.email && <span className="truncate">{user.email}</span>}
              </div>
            </div>
          </div>

          {/* 소개글 박스 */}
          {user.bio && (
            <div className="mt-4 rounded-[16px] bg-[#F9FAFB] p-3.5 border border-[#F2F4F6]">
              <p className="text-[14px] leading-relaxed text-[#4E5968] break-keep">
                {user.bio}
              </p>
            </div>
          )}

          {/* 액션 버튼 행 (이메일 복사 / 응원하기) */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            <Button
              variant="secondary"
              size="md"
              onClick={handleCopyEmail}
              className="h-10 rounded-xl text-[13px] font-semibold text-[#4E5968] bg-[#F2F4F6] hover:bg-[#E5E8EB]"
            >
              <Copy className="w-3.5 h-3.5 mr-1.5 text-[#6B7684]" />
              이메일 복사
            </Button>

            <Button
              variant={hasLiked ? "primary" : "secondary"}
              size="md"
              onClick={handleLike}
              className={`h-10 rounded-xl text-[13px] font-semibold transition-all ${
                hasLiked
                  ? "bg-[#3182F6] text-white"
                  : "text-[#4E5968] bg-[#F2F4F6] hover:bg-[#E5E8EB]"
              }`}
            >
              <Heart
                className={`w-3.5 h-3.5 mr-1.5 ${
                  hasLiked ? "fill-white text-white" : "text-[#6B7684]"
                }`}
              />
              응원하기 {likes > 0 ? likes : ""}
            </Button>
          </div>
        </Card>

        {/* 하단: 링크 목록 (클릭 시 새 탭) */}
        <Card className="overflow-hidden">
          {/* 헤더 및 카테고리 필터 탭 */}
          <div className="px-5 pt-4 pb-2">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <h2 className="text-[16px] font-bold text-[#191F28] tracking-tight">
                  바로가기 링크
                </h2>
                <Badge variant="default" className="rounded-full">
                  {displayedLinks.length}
                </Badge>
              </div>
              <span className="text-[12px] text-[#8B95A1]">최신순</span>
            </div>

            {/* 카테고리 필터 칩 */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat.id}
                  active={activeCategory === cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="h-7 text-[12px] px-3 cursor-pointer"
                >
                  {cat.name}
                </Chip>
              ))}
            </div>
          </div>

          {/* 링크 리스트 */}
          <div className="divide-y divide-[#F2F4F6] border-t border-[#F2F4F6]">
            {displayedLinks.length === 0 ? (
              <div className="py-12 text-center px-4">
                <p className="text-[14px] font-medium text-[#4E5968] mb-1">
                  등록된 링크가 없어요
                </p>
                <p className="text-[12px] text-[#8B95A1]">
                  {activeCategory === "all"
                    ? "아직 공개된 바로가기 링크가 등록되지 않았습니다."
                    : "해당 카테고리에 등록된 링크가 없습니다."}
                </p>
              </div>
            ) : (
              displayedLinks.map((link) => {
                const clicks = link.clicks ?? link.clickCount ?? 0;

                return (
                  <div
                    key={link.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleLinkClick(link.id, link.url)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleLinkClick(link.id, link.url);
                      }
                    }}
                    className="group flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-[#F9FAFB] cursor-pointer focus:outline-none select-none"
                  >
                    {/* 왼쪽 아이콘 + 제목/부제목 */}
                    <div className="flex flex-1 items-center gap-3.5 min-w-0 pr-2">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] bg-[#F2F4F6] group-hover:bg-[#E8F3FF] transition-colors">
                        {renderLinkIcon(link)}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[15px] font-semibold text-[#191F28] group-hover:text-[#3182F6] transition-colors tracking-tight">
                            {link.title}
                          </span>
                          {link.badge && (
                            <Badge
                              variant={
                                link.badge === "신규"
                                  ? "success"
                                  : link.badge === "대표"
                                  ? "brand"
                                  : "default"
                              }
                            >
                              {link.badge}
                            </Badge>
                          )}
                        </div>
                        {(link.subtitle || link.updatedAt) && (
                          <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                            {link.subtitle && (
                              <p className="text-[13px] text-[#8B95A1] truncate max-w-[200px] xs:max-w-[240px] sm:max-w-[280px]">
                                {link.subtitle}
                              </p>
                            )}
                            {link.updatedAt && (
                              <span className="text-[11px] text-[#B0B8C1] shrink-0">
                                {link.subtitle ? "· " : ""}수정됨{" "}
                                {formatRelativeTime(link.updatedAt)}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 오른쪽 클릭수 + 새 탭 이동 Chevron */}
                    <div className="flex items-center gap-2 shrink-0 pl-1">
                      {clicks > 0 && (
                        <span className="hidden sm:inline-flex items-center gap-0.5 text-[11px] font-medium text-[#8B95A1]">
                          <TrendingUp className="w-3 h-3 text-[#B0B8C1]" />
                          {clicks.toLocaleString()}
                        </span>
                      )}
                      <div className="p-1 text-[#B0B8C1] group-hover:text-[#3182F6] group-hover:translate-x-0.5 transition-all">
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* 하단 내 링크 만들기 CTA 카드 */}
        <Link href="/" className="block pt-2">
          <Card className="p-4 bg-gradient-to-r from-[#E8F3FF] to-[#F2F4F6] border border-[#D0E4FF] flex items-center justify-between hover:shadow-xs transition-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#3182F6] text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-[#191F28]">
                  나만의 링크 페이지 만들기
                </p>
                <p className="text-[12px] text-[#6B7684]">
                  Google 계정으로 10초 만에 시작하세요
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-[#3182F6]" />
          </Card>
        </Link>

        {/* 푸터 */}
        <footer className="pt-6 pb-2 text-center">
          <p className="text-[13px] text-[#8B95A1]">
            © 2026 {user.displayName} · MyLink Toss Design System
          </p>
        </footer>
      </main>

      {/* TDS Toast 알림 */}
      <Toast message={toastMessage} />
    </div>
  );
}
