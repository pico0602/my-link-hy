import { UserLinkPage } from "@/types/link";

export const STORAGE_KEY = "my-link-hy-store";
export const HAS_LIKED_KEY = "my-link-hy-has-liked";

export const DEFAULT_PROFILE: UserLinkPage = {
  username: "chaeyoon",
  displayName: "임채윤",
  bio: "안녕하세요, 바이브 코딩을 통해 유용한 프로덕트를 만들어가고 있어요. 새로운 기술과 일상의 문제를 잇는 것에 관심이 많아요.",
  badge: "대학생 메이커",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  email: "chaeyoon.lim@example.com",
  status: "활발히 코딩 중",
  focusArea: "Next.js 16 & AI",
  likes: 128,
  views: 1420,
  tags: [
    "Vibe Coding",
    "Next.js 16",
    "React 19",
    "TypeScript",
    "Tailwind CSS",
    "AI Agents",
  ],
  socials: {
    github: "https://github.com",
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    email: "mailto:chaeyoon.lim@example.com",
  },
  theme: {
    presetId: "toss",
    buttonStyle: "rounded",
    primaryColor: "#3182F6",
  },
  links: [
    {
      id: "github",
      title: "GitHub 저장소",
      subtitle: "진행 중인 오픈소스 및 개인 프로젝트 소스코드",
      url: "https://github.com",
      category: "project",
      badge: "코드",
      badgeColor: "#333D4B",
      iconType: "github",
      isPinned: true,
      isActive: true,
      order: 1,
      clicks: 1420,
      clickCount: 1420,
      createdAt: "2026-01-10T09:00:00Z",
    },
    {
      id: "portfolio-notion",
      title: "노션 포트폴리오",
      subtitle: "자기소개, 경력 기술서 및 프로젝트 상세 회고",
      url: "https://notion.so",
      category: "project",
      badge: "대표",
      badgeColor: "#3182F6",
      iconType: "notion",
      isPinned: true,
      isActive: true,
      order: 2,
      clicks: 980,
      clickCount: 980,
      createdAt: "2026-02-01T10:30:00Z",
    },
    {
      id: "project-ai-note",
      title: "사이드 프로젝트: AI 바이브 노트",
      subtitle: "AI와 함께 생각을 정리하고 기록하는 스마트 메모앱",
      url: "https://github.com",
      category: "project",
      badge: "신규",
      badgeColor: "#00B460",
      iconType: "custom",
      isPinned: false,
      isActive: true,
      order: 3,
      clicks: 432,
      clickCount: 432,
      createdAt: "2026-03-15T14:20:00Z",
    },
    {
      id: "tech-blog",
      title: "기술 블로그 (Velog)",
      subtitle: "Next.js, React, 프론트엔드 아키텍처 학습 일지",
      url: "https://velog.io",
      category: "blog",
      badge: "글",
      badgeColor: "#333D4B",
      iconType: "blog",
      isPinned: false,
      isActive: true,
      order: 4,
      clicks: 756,
      clickCount: 756,
      createdAt: "2026-01-20T11:00:00Z",
    },
    {
      id: "design-system",
      title: "TDS 스타일 컴포넌트 라이브러리",
      subtitle: "토스 디자인 시스템을 모티브로 한 UI 키트 Figma & 데모",
      url: "https://figma.com",
      category: "project",
      badge: "디자인",
      badgeColor: "#8B95A1",
      iconType: "custom",
      isPinned: false,
      isActive: true,
      order: 5,
      clicks: 310,
      clickCount: 310,
      createdAt: "2026-02-18T16:45:00Z",
    },
    {
      id: "linkedin",
      title: "LinkedIn 프로필",
      subtitle: "이력 사항 확인 및 커리어 네트워킹",
      url: "https://linkedin.com",
      category: "social",
      badge: "커리어",
      badgeColor: "#0A66C2",
      iconType: "custom",
      isPinned: false,
      isActive: true,
      order: 6,
      clicks: 520,
      clickCount: 520,
      createdAt: "2026-01-15T08:15:00Z",
    },
    {
      id: "instagram",
      title: "인스타그램",
      subtitle: "메이커의 일상과 개발 비하인드 스토리",
      url: "https://instagram.com",
      category: "social",
      badge: "SNS",
      badgeColor: "#E4405F",
      iconType: "instagram",
      isPinned: false,
      isActive: true,
      order: 7,
      clicks: 689,
      clickCount: 689,
      createdAt: "2026-01-12T13:00:00Z",
    },
    {
      id: "coffee-chat",
      title: "커피챗 신청하기",
      subtitle: "가벼운 티타임, 개발 이야기, 프로젝트 협업 제안 환영해요",
      url: "https://open.kakao.com",
      category: "contact",
      badge: "환영",
      badgeColor: "#F59E0B",
      iconType: "custom",
      isPinned: false,
      isActive: true,
      order: 8,
      clicks: 245,
      clickCount: 245,
      createdAt: "2026-02-25T15:30:00Z",
    },
    {
      id: "contact-mail",
      title: "공식 업무 및 협업 이메일",
      subtitle: "chaeyoon.lim@example.com (클릭 시 메일 작성창 연결)",
      url: "mailto:chaeyoon.lim@example.com",
      category: "contact",
      badge: "문의",
      badgeColor: "#333D4B",
      iconType: "custom",
      isPinned: false,
      isActive: true,
      order: 9,
      clicks: 178,
      clickCount: 178,
      createdAt: "2026-01-05T09:00:00Z",
    },
  ],
};

/**
 * 로컬스토리지에서 프로필 데이터를 가져옵니다. 없을 시 DEFAULT_PROFILE 반환.
 */
export function getStoredProfile(): UserLinkPage {
  if (typeof window === "undefined") {
    return DEFAULT_PROFILE;
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_PROFILE;
    }
    const parsed = JSON.parse(raw);
    return {
      ...DEFAULT_PROFILE,
      ...parsed,
      links: parsed.links || DEFAULT_PROFILE.links,
    };
  } catch (e) {
    console.error("Failed to load profile from localStorage:", e);
    return DEFAULT_PROFILE;
  }
}

/**
 * 프로필 데이터를 로컬스토리지에 저장합니다.
 */
export function saveStoredProfile(profile: UserLinkPage): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error("Failed to save profile to localStorage:", e);
  }
}

/**
 * 현재 기기의 응원 여부를 가져옵니다.
 */
export function getStoredHasLiked(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return localStorage.getItem(HAS_LIKED_KEY) === "true";
  } catch {
    return false;
  }
}

/**
 * 응원 여부 저장
 */
export function setStoredHasLiked(hasLiked: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(HAS_LIKED_KEY, String(hasLiked));
  } catch (e) {
    console.error("Failed to save hasLiked to localStorage:", e);
  }
}
