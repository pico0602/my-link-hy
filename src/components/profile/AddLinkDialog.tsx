"use client";

import React, { useState } from "react";
import { Plus, Link2, Sparkles, AlertCircle } from "lucide-react";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";
import { LinkCategoryType } from "@/types/link";

interface AddLinkDialogProps {
  onAddLink: (data: {
    title: string;
    url: string;
    subtitle?: string;
    category?: "project" | "blog" | "social" | "contact";
    badge?: string;
    badgeColor?: string;
    iconType?: string;
  }) => void;
  trigger?: React.ReactNode;
}

const CATEGORY_OPTIONS: { id: "project" | "blog" | "social" | "contact"; name: string }[] = [
  { id: "project", name: "프로젝트" },
  { id: "blog", name: "블로그·글" },
  { id: "social", name: "SNS" },
  { id: "contact", name: "연락처" },
];

const PRESET_BADGES = ["신규", "대표", "인기", "추천", "코드", "글"];

export function AddLinkDialog({ onAddLink, trigger }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [category, setCategory] = useState<"project" | "blog" | "social" | "contact">("project");
  const [badge, setBadge] = useState("");
  const [iconType, setIconType] = useState<string>("custom");

  const [errors, setErrors] = useState<{ title?: string; url?: string }>({});

  // URL 변경 시 도메인 기반 스마트 자동 분류
  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (errors.url) {
      setErrors((prev) => ({ ...prev, url: undefined }));
    }

    const lower = value.toLowerCase();
    if (lower.includes("github.com")) {
      setIconType("github");
      setCategory("project");
      if (!badge) setBadge("코드");
    } else if (lower.includes("velog.io") || lower.includes("tistory.com") || lower.includes("medium.com") || lower.includes("blog")) {
      setIconType("blog");
      setCategory("blog");
      if (!badge) setBadge("글");
    } else if (lower.includes("notion.so") || lower.includes("notion.site")) {
      setIconType("notion");
      setCategory("project");
      if (!badge) setBadge("대표");
    } else if (lower.includes("instagram.com")) {
      setIconType("instagram");
      setCategory("social");
      if (!badge) setBadge("SNS");
    } else if (lower.includes("linkedin.com")) {
      setIconType("custom");
      setCategory("social");
      if (!badge) setBadge("커리어");
    } else if (lower.includes("open.kakao.com") || lower.startsWith("mailto:")) {
      setIconType("custom");
      setCategory("contact");
      if (!badge) setBadge("연락");
    }
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (errors.title) {
      setErrors((prev) => ({ ...prev, title: undefined }));
    }
  };

  const resetForm = () => {
    setTitle("");
    setUrl("");
    setSubtitle("");
    setCategory("project");
    setBadge("");
    setIconType("custom");
    setErrors({});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: { title?: string; url?: string } = {};
    if (!title.trim()) {
      newErrors.title = "링크 제목을 입력해 주세요.";
    }
    if (!url.trim()) {
      newErrors.url = "링크 URL을 입력해 주세요.";
    } else if (
      !url.includes(".") &&
      !url.startsWith("mailto:") &&
      !url.startsWith("tel:")
    ) {
      newErrors.url = "올바른 형식의 웹 링크 주소를 입력해 주세요.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onAddLink({
      title,
      url,
      subtitle: subtitle.trim() || undefined,
      category,
      badge: badge.trim() || undefined,
      iconType,
    });

    resetForm();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) resetForm();
    }}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button
            variant="weak"
            size="sm"
            className="flex items-center gap-1 font-semibold text-[13px] px-3.5 h-8.5 rounded-full"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>링크 추가</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-[440px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F3FF] text-[#3182F6]">
              <Link2 className="h-5 w-5" />
            </div>
            <DialogTitle>새 링크 추가</DialogTitle>
          </div>
          <DialogDescription>
            프로필에 노출할 새로운 바로가기 링크 정보를 입력해 주세요. 로컬 상태에 즉시 저장됩니다.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 링크 제목 (필수) */}
          <div className="space-y-1.5 text-left">
            <label className="text-[13px] font-semibold text-[#333D4B]">
              링크 제목 <span className="text-[#F04452]">*</span>
            </label>
            <Input
              placeholder="예: 내 포트폴리오, 새 프로젝트"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              error={!!errors.title}
              autoFocus
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-[12px] text-[#F04452]">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.title}
              </p>
            )}
          </div>

          {/* 링크 URL (필수) */}
          <div className="space-y-1.5 text-left">
            <label className="text-[13px] font-semibold text-[#333D4B]">
              웹 주소 (URL) <span className="text-[#F04452]">*</span>
            </label>
            <Input
              placeholder="https://github.com/..."
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              error={!!errors.url}
            />
            {errors.url && (
              <p className="flex items-center gap-1 text-[12px] text-[#F04452]">
                <AlertCircle className="w-3.5 h-3.5" />
                {errors.url}
              </p>
            )}
          </div>

          {/* 한 줄 설명 (부제목) */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#333D4B]">
                설명 (부제목)
              </label>
              <span className="text-[11px] text-[#8B95A1]">선택</span>
            </div>
            <Input
              placeholder="링크에 대한 간단한 설명을 적어주세요"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
            />
          </div>

          {/* 카테고리 선택 */}
          <div className="space-y-1.5 text-left">
            <label className="text-[13px] font-semibold text-[#333D4B]">
              카테고리
            </label>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {CATEGORY_OPTIONS.map((cat) => (
                <Chip
                  key={cat.id}
                  active={category === cat.id}
                  onClick={() => setCategory(cat.id)}
                  className="h-8 text-[12px] px-3 cursor-pointer"
                >
                  {cat.name}
                </Chip>
              ))}
            </div>
          </div>

          {/* 뱃지 입력 및 프리셋 */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#333D4B]">
                강조 뱃지
              </label>
              <span className="text-[11px] text-[#8B95A1]">선택</span>
            </div>
            <Input
              placeholder="직접 입력하거나 아래 추천을 누르세요"
              value={badge}
              onChange={(e) => setBadge(e.target.value)}
            />
            <div className="flex flex-wrap items-center gap-1 pt-1">
              <span className="text-[11px] text-[#8B95A1] mr-1 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-[#3182F6]" /> 추천:
              </span>
              {PRESET_BADGES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setBadge(preset)}
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                    badge === preset
                      ? "bg-[#3182F6] text-white border-[#3182F6]"
                      : "bg-[#F2F4F6] text-[#4E5968] border-[#E5E8EB] hover:bg-[#E5E8EB]"
                  }`}
                >
                  {preset}
                </button>
              ))}
              {badge && (
                <button
                  type="button"
                  onClick={() => setBadge("")}
                  className="text-[11px] text-[#8B95A1] hover:text-[#F04452] underline ml-1 cursor-pointer"
                >
                  지우기
                </button>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="secondary"
              size="md"
              onClick={() => {
                resetForm();
                setOpen(false);
              }}
              className="w-full sm:w-auto"
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
            >
              추가하기
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
