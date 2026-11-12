"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
  updateLinkInFirestore,
  deleteLinkFromFirestore,
  subscribeFirestoreLinks,
  sortByCreatedAtDesc,
  saveUserProfileToFirestore,
  ensureUserProfileInitialized,
  checkUsernameAvailable,
  recordLinkClick,
  AddLinkInput,
  UpdateLinkInput,
  formatUrl,
} from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

export function useProfile() {
  const { user, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserLinkPage>(DEFAULT_PROFILE);
  const [isMounted, setIsMounted] = useState(false);
  const [isLoadingLinks, setIsLoadingLinks] = useState(true);
  const [hasLiked, setHasLiked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<LinkCategoryType>("all");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  const currentFirestorePath = useMemo(() => {
    return user ? `users/${user.uid}/links` : null;
  }, [user]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
    const timer = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  // SSR 하이드레이션 후 로컬스토리지 좋아요 상태 복원
  useEffect(() => {
    setIsMounted(true);
    const storedLike = getStoredHasLiked();
    setHasLiked(storedLike);
  }, []);

  // 사용자 로그인 상태에 따른 Firestore users/{user.uid}/profile 및 links 실시간 동기화
  useEffect(() => {
    if (!isMounted) return;

    if (user) {
      setIsLoadingLinks(true);

      // 1. users/{user.uid}/profile 조회 및 없으면 이메일/구글 이름 기반 초기 생성
      ensureUserProfileInitialized(user)
        .then((loadedProfile) => {
          setProfile((prev) => {
            const updated = {
              ...prev,
              username: loadedProfile.username || prev.username,
              displayName: loadedProfile.displayName || prev.displayName,
              bio: loadedProfile.bio !== undefined ? loadedProfile.bio : prev.bio,
              email: user.email || prev.email,
              avatarUrl: user.photoURL || prev.avatarUrl,
            };
            saveStoredProfile(updated);
            return updated;
          });
        })
        .catch((err) => {
          console.error("Firestore 프로필 동기화 실패:", err);
          // 실패 시에도 Firebase Auth 기본 정보로 fallback
          setProfile((prev) => ({
            ...prev,
            displayName: user.displayName || prev.displayName,
            email: user.email || prev.email,
            avatarUrl: user.photoURL || prev.avatarUrl,
          }));
        });

      // 2. Firestore의 `users/${user.uid}/links` 경로 실시간 동기화
      const unsubscribe = subscribeFirestoreLinks(
        user.uid,
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
    } else {
      // 비로그인 상태일 때 서버 API (/api/links)에서 기본 내 링크 목록 로드하여 서버와 연결
      setIsLoadingLinks(true);
      fetch("/api/links")
        .then((res) => res.json())
        .then((result) => {
          if (result.success && result.data?.links) {
            const serverLinks: LinkItem[] = result.data.links.map((item: any) => ({
              ...item,
              iconType: item.iconType || item.icon || "custom",
              clicks: item.clicks ?? item.clickCount ?? 0,
              clickCount: item.clickCount ?? item.clicks ?? 0,
            }));
            setProfile((prev) => ({
              ...prev,
              username: result.data.profile?.handle?.replace("@", "") || DEFAULT_PROFILE.username,
              displayName: result.data.profile?.name || DEFAULT_PROFILE.displayName,
              bio: result.data.profile?.bio || DEFAULT_PROFILE.bio,
              email: result.data.profile?.email || DEFAULT_PROFILE.email,
              avatarUrl: result.data.profile?.avatarUrl || DEFAULT_PROFILE.avatarUrl,
              links: serverLinks,
            }));
          } else {
            // 폴백: DEFAULT_PROFILE
            setProfile((prev) => ({
              ...prev,
              links: DEFAULT_PROFILE.links,
            }));
          }
        })
        .catch((err) => {
          console.error("서버 링크 불러오기 실패:", err);
          setProfile((prev) => ({
            ...prev,
            links: DEFAULT_PROFILE.links,
          }));
        })
        .finally(() => {
          setIsLoadingLinks(false);
        });
    }
  }, [isMounted, user]);

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
  const handleLinkClick = useCallback((linkId: string, url?: string) => {
    // 1. 비로그인 방문자 클릭 시 서버(/api/links)에 클릭수 전송
    if (!user) {
      try {
        fetch("/api/links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ linkId }),
        }).catch(() => {});
      } catch {
        // ignore
      }
    } else {
      // 프로필 관리 페이지(/)에서는 본인의 확인/편집 목적 클릭이므로 통계 객관성을 위해 조회수를 증가시키지 않습니다.
      console.info("[통계 제외] 프로필 소유자 확인용 클릭입니다. (조회수 미증가)", { linkId });
    }

    // 링크는 새 탭으로 열림 (target='_blank') fallback
    if (url && typeof window !== "undefined") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, [user]);

  // 기본 내 링크를 Firestore 서버에 연결(일괄 등록)
  const handleSyncDefaultLinksToServer = useCallback(async () => {
    if (!user) {
      showToast("서버에 링크를 연결하려면 먼저 로그인이 필요해요.");
      return;
    }

    try {
      setIsLoadingLinks(true);
      const linksToSync = DEFAULT_PROFILE.links;
      let count = 0;

      for (const link of linksToSync) {
        await addLinkToFirestore(user.uid, {
          title: link.title,
          url: link.url,
          subtitle: link.subtitle,
          category: (link.category as any) || "project",
          badge: link.badge,
          badgeColor: link.badgeColor,
          iconType: link.iconType,
        });
        count++;
      }

      showToast(`${count}개의 링크가 서버에 성공적으로 연결되었어요!`);
    } catch (error) {
      console.error("서버 링크 동기화 오류:", error);
      showToast("서버에 링크를 연결하는 중 문제가 발생했어요.");
    } finally {
      setIsLoadingLinks(false);
    }
  }, [user, showToast]);

  // 링크 추가 (Firestore users/{user.uid}/links에 저장)
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
      if (!user) {
        showToast("링크를 추가하려면 먼저 로그인해 주세요.");
        return;
      }

      try {
        // Firestore의 users/{user.uid}/links 경로에 저장
        const newLink = await addLinkToFirestore(user.uid, data);

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
    [user, showToast]
  );

  // 링크 수정 (Firestore users/{user.uid}/links/{id} 문서 업데이트)
  const handleUpdateLink = useCallback(
    async (id: string, data: UpdateLinkInput) => {
      if (!user) {
        showToast("링크를 수정하려면 먼저 로그인해 주세요.");
        return;
      }

      try {
        await updateLinkInFirestore(user.uid, id, data);

        // 로컬 상태 즉시 반영 (실시간 리스너 동기화 전 빠른 반응)
        setProfile((prev) => {
          const nextLinks = prev.links.map((link) => {
            if (link.id === id) {
              const formattedUrl = data.url ? formatUrl(data.url) : link.url;
              return {
                ...link,
                ...data,
                url: formattedUrl,
                subtitle: data.subtitle !== undefined ? data.subtitle : link.subtitle,
                badge: data.badge !== undefined ? data.badge : link.badge,
                category: data.category !== undefined ? data.category : link.category,
                iconType: data.iconType !== undefined ? data.iconType : link.iconType,
                updatedAt: new Date().toISOString(),
              };
            }
            return link;
          });

          const updated = { ...prev, links: nextLinks };
          saveStoredProfile(updated);
          return updated;
        });

        showToast("링크가 수정되었어요");
      } catch (error) {
        console.error("Firestore 링크 수정 실패:", error);
        showToast("링크 수정 중 오류가 발생했어요.");
        throw error;
      }
    },
    [user, showToast]
  );

  // 링크 삭제 (Firestore users/{user.uid}/links/{id} 문서 삭제)
  const handleDeleteLink = useCallback(
    async (id: string) => {
      if (!user) {
        showToast("링크를 삭제하려면 먼저 로그인해 주세요.");
        return;
      }

      try {
        await deleteLinkFromFirestore(user.uid, id);

        // 로컬 상태 즉시 반영
        setProfile((prev) => {
          const nextLinks = prev.links.filter((link) => link.id !== id);
          const updated = { ...prev, links: nextLinks };
          saveStoredProfile(updated);
          return updated;
        });

        showToast("링크가 삭제되었어요");
      } catch (error) {
        console.error("Firestore 링크 삭제 실패:", error);
        showToast("링크 삭제 중 오류가 발생했어요.");
        throw error;
      }
    },
    [user, showToast]
  );

  // 프로필 수정 (Firestore users/{user.uid}/profile 저장 및 중복 체크)
  const handleUpdateProfile = useCallback(
    async (data: { username: string; displayName: string; bio: string }) => {
      if (!user) {
        showToast("프로필을 수정하려면 먼저 로그인해 주세요.");
        throw new Error("프로필 저장을 위해 먼저 Google 로그인을 진행해 주세요.");
      }

      setIsUpdatingProfile(true);
      try {
        const oldUsername = profile.username;
        const updated = await saveUserProfileToFirestore(
          user.uid,
          {
            username: data.username,
            displayName: data.displayName,
            bio: data.bio,
            email: user.email || undefined,
            avatarUrl: user.photoURL || undefined,
          },
          oldUsername
        );

        // 로컬 상태 즉시 반영
        setProfile((prev) => {
          const next = {
            ...prev,
            username: updated.username,
            displayName: updated.displayName,
            bio: updated.bio,
          };
          saveStoredProfile(next);
          return next;
        });

        showToast("프로필이 성공적으로 저장되었어요");
        return updated;
      } catch (error: any) {
        console.error("Firestore 프로필 저장 실패:", error);
        const errMsg = error?.message || "프로필 저장 중 오류가 발생했어요.";
        showToast(errMsg);
        throw error;
      } finally {
        setIsUpdatingProfile(false);
      }
    },
    [user, profile.username, showToast]
  );

  // username 중복 확인 헬퍼
  const handleCheckUsername = useCallback(
    async (username: string) => {
      if (!user) return true;
      return await checkUsernameAvailable(username, user.uid);
    },
    [user]
  );

  return {
    user,
    authLoading,
    profile,
    isMounted,
    isLoadingLinks,
    isUpdatingProfile,
    hasLiked,
    toastMessage,
    selectedCategory,
    currentFirestorePath,
    setSelectedCategory,
    showToast,
    handleCopyEmail,
    handleShare,
    handleLike,
    handleLinkClick,
    handleAddLink,
    handleUpdateLink,
    handleDeleteLink,
    handleUpdateProfile,
    handleCheckUsername,
    handleSyncDefaultLinksToServer,
  };
}
