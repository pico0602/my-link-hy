"use client";

import { useState, useEffect, useCallback } from "react";

import { UserLinkPage, LinkCategoryType, LinkItem } from "@/types/link";
import {
  DEFAULT_PROFILE,
  getStoredProfile,
  saveStoredProfile,
  getStoredHasLiked,
  setStoredHasLiked,
} from "@/lib/storage";
import {
  addLinkToFirestore,
  subscribeFirestoreLinks,
  sortByCreatedAtDesc,
  AddLinkInput,
} from "@/lib/firestore";

export function useProfile() {
  const [profile, setProfile] = useState<UserLinkPage>(DEFAULT_PROFILE);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LinkCategoryType>("all");

  // SSR 하이드레이션 후 로컬스토리지 데이터 로드 및 Firestore users/anonymous/links 실시간 구독
  useEffect(() => {
    setIsMounted(true);
    const stored = getStoredProfile();
    const storedLike = getStoredHasLiked();
    setProfile(stored);
    setHasLiked(storedLike);

    // Firestore users/anonymous/links 실시간 동기화 (최초 로드 시에도 즉시 links 불러옴)
    const unsubscribe = subscribeFirestoreLinks(
      (firestoreLinks) => {
        setProfile((prev) => {
          const updated = {
            ...prev,
            links: firestoreLinks,
          };
          saveStoredProfile(updated);
          return updated;
        });
        setIsLoadingLinks(false);
      },
      (err) => {
        console.error("Firestore links subscription error:", err);
        setIsLoadingLinks(false);
      }
    );

    return () => {
      unsubscribe();
    };
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

  // 링크 추가 (Firestore users/anonymous/links에 저장)
  const handleAddLink = useCallback(
    async (data: {
      title: string;
      url: string;
      subtitle?: string;
      category?: "project" | "blog" | "social" | "contact";
      badge?: string;
      badgeColor?: string;
      iconType?: string;
    }) => {
      try {
        // Firestore의 users/anonymous/links 경로에 저장
        const newLink = await addLinkToFirestore(data);

        // 로컬 상태 즉시 반영 (실시간 리스너가 반영하기 전 빠른 UI 반응 - 최신순 정렬)
        setProfile((prev) => {
          const exists = prev.links.some((l) => l.id === newLink.id);
          if (exists) return prev;

          const updatedLinks = [newLink, ...prev.links].sort(sortByCreatedAtDesc);
          const updated = {
            ...prev,
            links: updatedLinks,
          };
          saveStoredProfile(updated);
          return updated;
        });

        showToast("새 링크가 추가되었어요");
        return newLink;
      } catch (error) {
        console.error("Firestore 링크 추가 실패:", error);
        showToast("링크 추가 중 오류가 발생했어요. 다시 시도해 주세요.");
        throw error;
      }
    },
    [showToast]
  );

  return {
    profile,
    isMounted,
    isLoadingLinks,
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
