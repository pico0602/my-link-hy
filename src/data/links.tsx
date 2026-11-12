import React from "react";
import {
  BookOpen,
  FileText,
  Sparkles,
  Coffee,
  Mail,
  FolderGit2,
} from "lucide-react";
import { LinkItem, CategoryItem } from "@/types/link";

export interface LinkItemWithIcon extends Omit<LinkItem, "icon"> {
  icon: React.ReactNode;
}

export const CATEGORIES: CategoryItem[] = [
  { id: "all", name: "전체" },
  { id: "project", name: "프로젝트" },
  { id: "blog", name: "블로그·글" },
  { id: "social", name: "SNS" },
  { id: "contact", name: "연락처" },
];

export const DUMMY_LINKS: LinkItemWithIcon[] = [
  {
    id: "github",
    title: "GitHub 저장소",
    subtitle: "진행 중인 오픈소스 및 개인 프로젝트 소스코드",
    url: "https://github.com",
    category: "project",
    badge: "코드",
    badgeColor: "#333D4B",
    isPinned: true,
    isActive: true,
    order: 1,
    clickCount: 1420,
    createdAt: "2026-01-10T09:00:00Z",
    icon: (
      <svg className="w-5 h-5 text-[#333D4B]" fill="currentColor" viewBox="0 0 24 24">
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
      </svg>
    ),
  },
  {
    id: "portfolio-notion",
    title: "노션 포트폴리오",
    subtitle: "자기소개, 경력 기술서 및 프로젝트 상세 회고",
    url: "https://notion.so",
    category: "project",
    badge: "대표",
    badgeColor: "#3182F6",
    isPinned: true,
    isActive: true,
    order: 2,
    clickCount: 980,
    createdAt: "2026-02-01T10:30:00Z",
    icon: <FileText className="w-5 h-5 text-[#333D4B]" />,
  },
  {
    id: "project-vibe",
    title: "사이드 프로젝트: AI 바이브 노트",
    subtitle: "AI와 함께 생각을 정리하고 기록하는 스마트 메모앱",
    url: "https://github.com",
    category: "project",
    badge: "신규",
    badgeColor: "#00B460",
    isPinned: false,
    isActive: true,
    order: 3,
    clickCount: 432,
    createdAt: "2026-03-15T14:20:00Z",
    icon: <Sparkles className="w-5 h-5 text-[#3182F6]" />,
  },
  {
    id: "tech-blog",
    title: "기술 블로그 (Velog)",
    subtitle: "Next.js, React, 프론트엔드 아키텍처 학습 일지",
    url: "https://velog.io",
    category: "blog",
    badge: "글",
    badgeColor: "#333D4B",
    isPinned: false,
    isActive: true,
    order: 4,
    clickCount: 756,
    createdAt: "2026-01-20T11:00:00Z",
    icon: <BookOpen className="w-5 h-5 text-[#333D4B]" />,
  },
  {
    id: "project-design-system",
    title: "TDS 스타일 컴포넌트 라이브러리",
    subtitle: "토스 디자인 시스템을 모티브로 한 UI 키트 Figma & 데모",
    url: "https://figma.com",
    category: "project",
    badge: "디자인",
    badgeColor: "#8B95A1",
    isPinned: false,
    isActive: true,
    order: 5,
    clickCount: 310,
    createdAt: "2026-02-18T16:45:00Z",
    icon: <FolderGit2 className="w-5 h-5 text-[#333D4B]" />,
  },
  {
    id: "linkedin",
    title: "LinkedIn 프로필",
    subtitle: "이력 사항 확인 및 커리어 네트워킹",
    url: "https://linkedin.com",
    category: "social",
    badge: "커리어",
    badgeColor: "#0A66C2",
    isPinned: false,
    isActive: true,
    order: 6,
    clickCount: 520,
    createdAt: "2026-01-15T08:15:00Z",
    icon: (
      <svg className="w-5 h-5 text-[#0A66C2]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
      </svg>
    ),
  },
  {
    id: "instagram",
    title: "인스타그램",
    subtitle: "메이커의 일상과 개발 비하인드 스토리",
    url: "https://instagram.com",
    category: "social",
    badge: "SNS",
    badgeColor: "#E4405F",
    isPinned: false,
    isActive: true,
    order: 7,
    clickCount: 689,
    createdAt: "2026-01-12T13:00:00Z",
    icon: (
      <svg className="w-5 h-5 text-[#E4405F]" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689-.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    id: "coffee-chat",
    title: "커피챗 신청하기",
    subtitle: "가벼운 티타임, 개발 이야기, 프로젝트 협업 제안 환영해요",
    url: "https://open.kakao.com",
    category: "contact",
    badge: "환영",
    badgeColor: "#F59E0B",
    isPinned: false,
    isActive: true,
    order: 8,
    clickCount: 245,
    createdAt: "2026-02-25T15:30:00Z",
    icon: <Coffee className="w-5 h-5 text-[#F59E0B]" />,
  },
  {
    id: "contact-mail",
    title: "공식 업무 및 협업 이메일",
    subtitle: "chaeyun.yim@example.com (클릭 시 메일 작성창 연결)",
    url: "mailto:chaeyun.yim@example.com",
    category: "contact",
    badge: "문의",
    badgeColor: "#333D4B",
    isPinned: false,
    isActive: true,
    order: 9,
    clickCount: 178,
    createdAt: "2026-01-05T09:00:00Z",
    icon: <Mail className="w-5 h-5 text-[#333D4B]" />,
  },
];
