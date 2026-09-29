"use client";

import { useState, useEffect, useCallback } from "react";
import { UserLinkPage, LinkCategoryType } from "@/types/link";
import {
  DEFAULT_PROFILE,
  getStoredProfile,
  saveStoredProfile,
  getStoredHasLiked,
  setStoredHasLiked,
} from "@/lib/storage";

export function useProfile() {
  const [profile, setProfile] = useState<UserLinkPage>(DEFAULT_PROFILE);
  const [isMounted, setIsMounted] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LinkCategoryType>("all");

  // SSR 하이드레이션 후 로컬스토리지 데이터 로드
  useEffect(() => {
    setIsMounted(true);
    const stored = getStoredProfile();
    const storedLike = getStoredHasLiked();
    setProfile(stored);
    setHasLiked(storedLike);
  }, []);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  // 이메일 복사
  const handleCopyEmail = useCallback(() => {
    const email = profile.email || "chaeyoon.lim@example.com";
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(email);
    }
    showToast("이메일 주소가 복사되었어요");
  }, [profile.email, showToast]);

  // 페이지 URL 공유 (Web Share API 지원시 시스템 공유, 아니면 클립보드 복사)
  const handleShare = useCallback(async () => {
    if (typeof window === "undefined") return;

    const shareData = {
      title: `${profile.displayName}의 마이링크`,
      text: profile.bio,
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // 사용자가 취소한 경우 에러 무시
        if ((err as Error).name === "AbortError") return;
      }
    }

    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast("프로필 주소가 복사되었어요");
    }
  }, [profile.displayName, profile.bio, showToast]);

  // 응원하기 (하트 토글)
  const handleLike = useCallback(() => {
    setProfile((prev) => {
      const nextLiked = !hasLiked;
      const nextLikes = nextLiked ? prev.likes + 1 : Math.max(0, prev.likes - 1);
      const updated = {
        ...prev,
        likes: nextLikes,
      };

      setHasLiked(nextLiked);
      setStoredHasLiked(nextLiked);
      saveStoredProfile(updated);

      if (nextLiked) {
        showToast("소중한 응원이 전달되었어요");
      }

      return updated;
    });
  }, [hasLiked, showToast]);

  // 링크 클릭 트래킹 및 이동
  const handleLinkClick = useCallback((linkId: string, url: string) => {
    // 1. 상태 및 로컬 스토리지 클릭수 증가
    setProfile((prev) => {
      const nextLinks = prev.links.map((link) => {
        if (link.id === linkId) {
          const currentCount = link.clicks ?? link.clickCount ?? 0;
          return {
            ...link,
            clicks: currentCount + 1,
            clickCount: currentCount + 1,
          };
        }
        return link;
      });

      const updated = { ...prev, links: nextLinks };
      saveStoredProfile(updated);
      return updated;
    });

    // 2. Mock API 백엔드 트래킹 비동기 전송
    try {
      fetch("/api/links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ linkId }),
      }).catch(() => {
        // 오프라인이거나 개발 모드일 때 무시
      });
    } catch {
      // ignore
    }

    // 3. 외부 링크 새 탭 오픈
    if (typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, []);

  // 링크 추가
  const handleAddLink = useCallback((data: {
    title: string;
    url: string;
    subtitle?: string;
    category?: "project" | "blog" | "social" | "contact";
    badge?: string;
    badgeColor?: string;
    iconType?: string;
  }) => {
    let formattedUrl = data.url.trim();
    if (!formattedUrl.startsWith("http://") && !formattedUrl.startsWith("https://") && !formattedUrl.startsWith("mailto:")) {
      formattedUrl = `https://${formattedUrl}`;
    }

    const newLink = {
      id: `link-${Date.now()}`,
      title: data.title.trim(),
      subtitle: data.subtitle?.trim() || undefined,
      url: formattedUrl,
      category: data.category || "project",
      badge: data.badge?.trim() || undefined,
      badgeColor: data.badgeColor || (data.badge === "신규" ? "#00B460" : data.badge === "대표" ? "#3182F6" : "#333D4B"),
      iconType: data.iconType || "custom",
      isPinned: false,
      isActive: true,
      order: 0, // 최상단에 배치
      clicks: 0,
      clickCount: 0,
      createdAt: new Date().toISOString(),
    };

    setProfile((prev) => {
      // 기존 링크들의 order를 1씩 밀어내고 맨 앞에 추가
      const reorderedLinks = prev.links.map((link) => ({
        ...link,
        order: link.order + 1,
      }));
      const updatedLinks = [newLink, ...reorderedLinks];
      const updated = {
        ...prev,
        links: updatedLinks,
      };
      saveStoredProfile(updated);
      return updated;
    });

    showToast("새 링크가 추가되었어요");
  }, [showToast]);

  return {
    profile,
    isMounted,
    hasLiked,
    toastMessage,
    selectedCategory,
    setSelectedCategory,
    showToast,
    handleCopyEmail,
    handleShare,
    handleLike,
    handleLinkClick,
    handleAddLink,
  };
}
