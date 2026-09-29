"use client";

import React, { useState } from "react";
import {
  BookOpen,
  FileText,
  Sparkles,
  Coffee,
  Mail,
  FolderGit2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from "lucide-react";
import { LinkItem, LinkCategoryType, CategoryItem } from "@/types/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Chip } from "@/components/ui/chip";

interface LinkListProps {
  links: LinkItem[];
  onLinkClick: (id: string, url: string) => void;
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
        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
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

export function LinkList({ links, onLinkClick }: LinkListProps) {
  const [activeCategory, setActiveCategory] = useState<LinkCategoryType>("all");

  const activeLinks = links
    .filter((link) => link.isActive)
    .sort((a, b) => a.order - b.order);

  const displayedLinks =
    activeCategory === "all"
      ? activeLinks
      : activeLinks.filter((link) => link.category === activeCategory);

  return (
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
          <span className="text-[12px] text-[#8B95A1]">순서대로 정렬됨</span>
        </div>

        {/* 카테고리 칩 필터 (TDS Chip 재사용) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-none -mx-1 px-1">
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              active={activeCategory === cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className="h-7 text-[12px] px-3"
            >
              {cat.name}
            </Chip>
          ))}
        </div>
      </div>

      {/* 링크 목록 리스트 */}
      <div className="divide-y divide-[#F2F4F6] border-t border-[#F2F4F6]">
        {displayedLinks.length === 0 ? (
          <div className="py-8 text-center text-[13px] text-[#8B95A1]">
            해당 카테고리의 링크가 없습니다.
          </div>
        ) : (
          displayedLinks.map((link) => {
            const clicks = link.clicks ?? link.clickCount ?? 0;

            return (
              <button
                key={link.id}
                type="button"
                onClick={() => onLinkClick(link.id, link.url)}
                className="group flex w-full items-center justify-between px-5 py-3.5 text-left transition-colors hover:bg-[#F9FAFB] active:bg-[#F2F4F6] cursor-pointer"
              >
                {/* 왼쪽: 아이콘 컨테이너 (44px) + 텍스트 */}
                <div className="flex items-center gap-3.5 min-w-0 pr-2">
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
                    {link.subtitle && (
                      <p className="text-[13px] text-[#8B95A1] truncate mt-0.5 max-w-[280px]">
                        {link.subtitle}
                      </p>
                    )}
                  </div>
                </div>

                {/* 오른쪽: 클릭수 및 Chevron */}
                <div className="flex items-center gap-2 shrink-0">
                  {clicks > 0 && (
                    <span className="hidden sm:inline-flex items-center gap-0.5 text-[11px] font-medium text-[#8B95A1]">
                      <TrendingUp className="w-3 h-3 text-[#B0B8C1]" />
                      {clicks.toLocaleString()}
                    </span>
                  )}
                  <div className="text-[#B0B8C1] group-hover:text-[#3182F6] group-hover:translate-x-0.5 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </Card>
  );
}
