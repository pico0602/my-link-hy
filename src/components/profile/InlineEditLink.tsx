"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Check, X, AlertCircle, Sparkles, Info, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Chip } from "@/components/ui/chip";
import { LinkItem } from "@/types/link";
import {
  linkFormSchema,
  LinkFormValues,
  CATEGORY_OPTIONS,
  PRESET_BADGES,
  URL_PATTERN,
  detectSmartMetadata,
} from "@/lib/validations/link";

interface InlineEditLinkProps {
  link: LinkItem;
  onSave: (id: string, data: LinkFormValues) => Promise<void> | void;
  onCancel: () => void;
}

export function InlineEditLink({ link, onSave, onCancel }: InlineEditLinkProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isDirty },
  } = useForm<LinkFormValues>({
    resolver: zodResolver(linkFormSchema),
    mode: "onChange",
    defaultValues: {
      title: link.title || "",
      url: link.url || "",
      subtitle: link.subtitle || "",
      category: (link.category as any) || "project",
      badge: link.badge || "",
      iconType: link.iconType || "custom",
    },
  });

  const currentTitle = watch("title") || "";
  const currentUrl = watch("url") || "";
  const currentSubtitle = watch("subtitle") || "";
  const currentCategory = watch("category");
  const currentBadge = watch("badge") || "";

  // URL 변경 시 스마트 감지
  const handleUrlInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("url", value, { shouldValidate: true, shouldDirty: true });

    const detected = detectSmartMetadata(value, currentBadge);
    if (detected.iconType) setValue("iconType", detected.iconType);
    if (detected.category) setValue("category", detected.category);
    if (detected.badge && !currentBadge) setValue("badge", detected.badge, { shouldValidate: true });
  };

  const onSubmit = async (data: LinkFormValues) => {
    try {
      setIsSubmitting(true);
      await onSave(link.id, data);
    } catch (err) {
      console.error("인라인 링크 수정 오류:", err);
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
    <div className="bg-[#F8FAFC] border-2 border-[#3182F6]/40 rounded-[18px] p-4.5 my-2 shadow-xs transition-all animate-in fade-in zoom-in-95 duration-150">
      <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-[#E5E8EB]">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#E8F3FF] text-[#3182F6]">
            <Edit3 className="h-4 w-4" />
          </div>
          <span className="text-[14px] font-bold text-[#191F28]">
            링크 정보 수정
          </span>
        </div>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="text-[#8B95A1] hover:text-[#191F28] p-1 rounded-md hover:bg-[#E5E8EB] transition-colors"
          title="수정 취소"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
        {/* 링크 제목 (필수) */}
        <div className="space-y-1 text-left">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold text-[#333D4B]">
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
            placeholder="링크 제목을 입력해 주세요"
            {...register("title")}
            error={!!errors.title}
            className="bg-white h-9.5 text-[14px]"
            autoFocus
          />
          {errors.title && (
            <p className="flex items-center gap-1 text-[11px] text-[#F04452]">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.title.message}</span>
            </p>
          )}
        </div>

        {/* 링크 URL (필수) */}
        <div className="space-y-1 text-left">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold text-[#333D4B]">
              웹 주소 (URL) <span className="text-[#F04452]">*</span>
            </label>
          </div>
          <Input
            placeholder="https://example.com"
            value={currentUrl}
            onChange={handleUrlInputChange}
            error={!!errors.url}
            className="bg-white h-9.5 text-[14px]"
          />
          {errors.url && (
            <p className="flex items-center gap-1 text-[11px] text-[#F04452]">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.url.message}</span>
            </p>
          )}
          {!errors.url && isUrlWithoutProtocol && (
            <p className="flex items-center gap-1 text-[11px] text-[#3182F6] bg-[#E8F3FF]/70 px-2 py-0.5 rounded-md">
              <Info className="w-3 h-3 shrink-0" />
              <span>저장 시 https:// 가 자동으로 추가돼요</span>
            </p>
          )}
        </div>

        {/* 설명 (부제목) */}
        <div className="space-y-1 text-left">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold text-[#333D4B]">
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
            placeholder="간단한 설명을 입력해 주세요 (선택)"
            {...register("subtitle")}
            error={!!errors.subtitle}
            className="bg-white h-9.5 text-[14px]"
          />
          {errors.subtitle && (
            <p className="flex items-center gap-1 text-[11px] text-[#F04452]">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.subtitle.message}</span>
            </p>
          )}
        </div>

        {/* 카테고리 선택 */}
        <div className="space-y-1 text-left">
          <label className="text-[12px] font-semibold text-[#333D4B]">
            카테고리
          </label>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {CATEGORY_OPTIONS.map((cat) => (
              <Chip
                key={cat.id}
                active={currentCategory === cat.id}
                onClick={() => setValue("category", cat.id, { shouldValidate: true, shouldDirty: true })}
                className="h-7 text-[11px] px-2.5 cursor-pointer bg-white"
              >
                {cat.name}
              </Chip>
            ))}
          </div>
        </div>

        {/* 강조 뱃지 */}
        <div className="space-y-1 text-left">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-semibold text-[#333D4B]">
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
            placeholder="예: 신규, 대표, 추천"
            {...register("badge")}
            error={!!errors.badge}
            className="bg-white h-9.5 text-[14px]"
          />
          {errors.badge && (
            <p className="flex items-center gap-1 text-[11px] text-[#F04452]">
              <AlertCircle className="w-3 h-3 shrink-0" />
              <span>{errors.badge.message}</span>
            </p>
          )}
          <div className="flex flex-wrap items-center gap-1 pt-0.5">
            <span className="text-[11px] text-[#8B95A1] mr-1 flex items-center gap-0.5">
              <Sparkles className="w-3 h-3 text-[#3182F6]" /> 추천:
            </span>
            {PRESET_BADGES.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() =>
                  setValue("badge", preset, { shouldValidate: true, shouldDirty: true })
                }
                className={`text-[11px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                  currentBadge === preset
                    ? "bg-[#3182F6] text-white border-[#3182F6]"
                    : "bg-white text-[#4E5968] border-[#E5E8EB] hover:bg-[#F2F4F6]"
                }`}
              >
                {preset}
              </button>
            ))}
            {currentBadge && (
              <button
                type="button"
                onClick={() => setValue("badge", "", { shouldValidate: true, shouldDirty: true })}
                className="text-[11px] text-[#8B95A1] hover:text-[#F04452] underline ml-1 cursor-pointer"
              >
                지우기
              </button>
            )}
          </div>
        </div>

        {/* 액션 버튼 */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E8EB]">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isSubmitting}
            onClick={onCancel}
            className="h-8.5 px-3.5 text-[13px]"
          >
            취소
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={isSubmitting}
            className="h-8.5 px-4 text-[13px] flex items-center gap-1 font-semibold"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isSubmitting ? "저장 중..." : "수정 완료"}</span>
          </Button>
        </div>
      </form>
    </div>
  );
}
