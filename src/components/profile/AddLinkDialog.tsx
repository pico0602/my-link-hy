"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Plus, Link2, Sparkles, AlertCircle, Info } from "lucide-react";
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

// URL 정규식 패턴 (http, https, mailto, tel 지원 및 프로토콜 생략 도메인 지원)
const URL_PATTERN =
  /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/i;
const SPECIAL_PROTOCOLS =
  /^(mailto:[^\s@]+@[^\s@]+\.[^\s@]+|tel:[0-9\-+]+)$/i;

// Zod 유효성 검증 스키마 정의
export const addLinkSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "링크 제목을 입력해 주세요.")
    .min(2, "제목은 2자 이상 입력해 주세요.")
    .max(30, "제목은 30자 이내로 입력해 주세요."),
  url: z
    .string()
    .trim()
    .min(1, "웹 주소(URL)를 입력해 주세요.")
    .refine((val) => !/\s/.test(val), "URL에는 공백이 포함될 수 없어요.")
    .refine(
      (val) => URL_PATTERN.test(val) || SPECIAL_PROTOCOLS.test(val),
      "올바른 웹 주소 형식을 입력해 주세요. (예: https://github.com/my-link)"
    ),
  subtitle: z
    .string()
    .trim()
    .max(60, "설명은 60자 이내로 입력해 주세요.")
    .optional(),
  category: z.enum(["project", "blog", "social", "contact"]),
  badge: z
    .string()
    .trim()
    .max(8, "뱃지는 8자 이내로 입력해 주세요.")
    .optional(),
  iconType: z.string(),
});

export type AddLinkFormValues = z.infer<typeof addLinkSchema>;

interface AddLinkDialogProps {
  onAddLink: (data: {
    title: string;
    url: string;
    subtitle?: string;
    category?: "project" | "blog" | "social" | "contact";
    badge?: string;
    badgeColor?: string;
    iconType?: string;
  }) => void | Promise<any>;
  trigger?: React.ReactNode;
}

const CATEGORY_OPTIONS: {
  id: "project" | "blog" | "social" | "contact";
  name: string;
}[] = [
  { id: "project", name: "프로젝트" },
  { id: "blog", name: "블로그·글" },
  { id: "social", name: "SNS" },
  { id: "contact", name: "연락처" },
];

const PRESET_BADGES = ["신규", "대표", "인기", "추천", "코드", "글"];

export function AddLinkDialog({ onAddLink, trigger }: AddLinkDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // React Hook Form 초기화 (Zod Resolver 연결 및 실시간 유효성 검증 mode: "onChange")
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<AddLinkFormValues>({
    resolver: zodResolver(addLinkSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      url: "",
      subtitle: "",
      category: "project",
      badge: "",
      iconType: "custom",
    },
  });

  // 실시간 값 구독 (글자 수 카운터 및 스마트 감지용)
  const currentTitle = watch("title") || "";
  const currentUrl = watch("url") || "";
  const currentSubtitle = watch("subtitle") || "";
  const currentCategory = watch("category");
  const currentBadge = watch("badge") || "";

  // URL 입력 시 도메인 스마트 자동 감지 로직
  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("url", value, { shouldValidate: true });

    const lower = value.toLowerCase();
    if (lower.includes("github.com")) {
      setValue("iconType", "github");
      setValue("category", "project");
      if (!currentBadge) setValue("badge", "코드");
    } else if (
      lower.includes("velog.io") ||
      lower.includes("tistory.com") ||
      lower.includes("medium.com") ||
      lower.includes("blog")
    ) {
      setValue("iconType", "blog");
      setValue("category", "blog");
      if (!currentBadge) setValue("badge", "글");
    } else if (lower.includes("notion.so") || lower.includes("notion.site")) {
      setValue("iconType", "notion");
      setValue("category", "project");
      if (!currentBadge) setValue("badge", "대표");
    } else if (lower.includes("instagram.com")) {
      setValue("iconType", "instagram");
      setValue("category", "social");
      if (!currentBadge) setValue("badge", "SNS");
    } else if (lower.includes("linkedin.com")) {
      setValue("iconType", "custom");
      setValue("category", "social");
      if (!currentBadge) setValue("badge", "커리어");
    } else if (lower.includes("open.kakao.com") || lower.startsWith("mailto:")) {
      setValue("iconType", "custom");
      setValue("category", "contact");
      if (!currentBadge) setValue("badge", "연락");
    }
  };

  // 폼 제출 처리 (Firestore 비동기 저장 처리)
  const onSubmit = async (data: AddLinkFormValues) => {
    try {
      setIsSubmitting(true);
      await onAddLink({
        title: data.title.trim(),
        url: data.url.trim(),
        subtitle: data.subtitle?.trim() || undefined,
        category: data.category,
        badge: data.badge?.trim() || undefined,
        iconType: data.iconType || "custom",
      });

      reset();
      setOpen(false);
    } catch (err) {
      console.error("링크 추가 오류:", err);
      // 실패 시 모달을 닫지 않고 유지
    } finally {
      setIsSubmitting(false);
    }
  };


  const isUrlWithoutProtocol =
    currentUrl.trim() &&
    !currentUrl.startsWith("http://") &&
    !currentUrl.startsWith("https://") &&
    !currentUrl.startsWith("mailto:") &&
    !currentUrl.startsWith("tel:") &&
    URL_PATTERN.test(currentUrl.trim());

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setOpen(val);
        if (!val) reset();
      }}
    >
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
            프로필에 노출할 새로운 바로가기 링크 정보를 입력해 주세요. (Zod + React Hook Form 검증 적용)
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* 링크 제목 (필수) */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#333D4B]">
                링크 제목 <span className="text-[#F04452]">*</span>
              </label>
              <span
                className={`text-[11px] ${
                  currentTitle.length > 30
                    ? "text-[#F04452] font-semibold"
                    : "text-[#8B95A1]"
                }`}
              >
                {currentTitle.length}/30자
              </span>
            </div>
            <Input
              placeholder="예: 내 포트폴리오, 새 사이드 프로젝트"
              {...register("title")}
              error={!!errors.title}
              autoFocus
            />
            {errors.title && (
              <p className="flex items-center gap-1 text-[12px] text-[#F04452] animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.title.message}</span>
              </p>
            )}
          </div>

          {/* 링크 URL (필수) */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#333D4B]">
                웹 주소 (URL) <span className="text-[#F04452]">*</span>
              </label>
            </div>
            <Input
              placeholder="https://github.com/username"
              value={currentUrl}
              onChange={handleUrlInputChange}
              error={!!errors.url}
            />

            {/* 에러 메시지 */}
            {errors.url && (
              <p className="flex items-center gap-1 text-[12px] text-[#F04452] animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.url.message}</span>
              </p>
            )}

            {/* 프로토콜 자동 보정 안내 (에러가 없고 https://가 생략되었을 때) */}
            {!errors.url && isUrlWithoutProtocol && (
              <p className="flex items-center gap-1 text-[11px] text-[#3182F6] bg-[#E8F3FF]/60 px-2.5 py-1 rounded-lg">
                <Info className="w-3 h-3 shrink-0" />
                <span>등록 시 https:// 가 자동으로 추가돼요</span>
              </p>
            )}
          </div>

          {/* 한 줄 설명 (부제목) */}
          <div className="space-y-1.5 text-left">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-semibold text-[#333D4B]">
                설명 (부제목)
              </label>
              <span
                className={`text-[11px] ${
                  currentSubtitle.length > 60
                    ? "text-[#F04452] font-semibold"
                    : "text-[#8B95A1]"
                }`}
              >
                {currentSubtitle.length}/60자
              </span>
            </div>
            <Input
              placeholder="링크에 대한 간단한 설명을 적어주세요"
              {...register("subtitle")}
              error={!!errors.subtitle}
            />
            {errors.subtitle && (
              <p className="flex items-center gap-1 text-[12px] text-[#F04452] animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.subtitle.message}</span>
              </p>
            )}
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
                  active={currentCategory === cat.id}
                  onClick={() => setValue("category", cat.id, { shouldValidate: true })}
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
              <span
                className={`text-[11px] ${
                  currentBadge.length > 8
                    ? "text-[#F04452] font-semibold"
                    : "text-[#8B95A1]"
                }`}
              >
                {currentBadge.length}/8자
              </span>
            </div>
            <Input
              placeholder="직접 입력하거나 아래 추천을 누르세요"
              {...register("badge")}
              error={!!errors.badge}
            />
            {errors.badge && (
              <p className="flex items-center gap-1 text-[12px] text-[#F04452] animate-in fade-in duration-150">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>{errors.badge.message}</span>
              </p>
            )}

            {/* 추천 뱃지 칩 */}
            <div className="flex flex-wrap items-center gap-1 pt-1">
              <span className="text-[11px] text-[#8B95A1] mr-1 flex items-center gap-0.5">
                <Sparkles className="w-3 h-3 text-[#3182F6]" /> 추천:
              </span>
              {PRESET_BADGES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() =>
                    setValue("badge", preset, { shouldValidate: true })
                  }
                  className={`text-[11px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                    currentBadge === preset
                      ? "bg-[#3182F6] text-white border-[#3182F6]"
                      : "bg-[#F2F4F6] text-[#4E5968] border-[#E5E8EB] hover:bg-[#E5E8EB]"
                  }`}
                >
                  {preset}
                </button>
              ))}
              {currentBadge && (
                <button
                  type="button"
                  onClick={() => setValue("badge", "", { shouldValidate: true })}
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
              disabled={isSubmitting}
              onClick={() => {
                reset();
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
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              {isSubmitting ? "저장 중..." : "추가하기"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
}
