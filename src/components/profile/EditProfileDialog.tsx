"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User,
  AtSign,
  FileText,
  AlertCircle,
  CheckCircle2,
  Loader2,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  profileFormSchema,
  ProfileFormValues,
} from "@/lib/validations/profile";
import { checkUsernameAvailable } from "@/lib/firestore";

interface EditProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  initialData: {
    username: string;
    displayName: string;
    bio: string;
  };
  onSave: (data: {
    username: string;
    displayName: string;
    bio: string;
  }) => Promise<any>;
}

export function EditProfileDialog({
  open,
  onOpenChange,
  userId,
  initialData,
  onSave,
}: EditProfileDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "duplicate" | "invalid"
  >("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      username: initialData.username || "",
      displayName: initialData.displayName || "",
      bio: initialData.bio || "",
    },
  });

  const watchedUsername = watch("username");
  const watchedBio = watch("bio") || "";

  // 다이얼로그 열릴 때 initialData로 폼 초기화
  useEffect(() => {
    if (open) {
      reset({
        username: initialData.username || "",
        displayName: initialData.displayName || "",
        bio: initialData.bio || "",
      });
      setUsernameStatus("idle");
      setServerError(null);
    }
  }, [
    open,
    initialData.username,
    initialData.displayName,
    initialData.bio,
    reset,
  ]);

  // username 디바운스 중복 검사 (사용자가 입력하는 동안 비동기 사전 체크)
  useEffect(() => {
    if (!open) return;

    const trimmed = (watchedUsername || "").trim();

    // 기존 본인 username과 같다면 중복 체크 생략 및 사용 가능 처리
    if (trimmed.toLowerCase() === (initialData.username || "").toLowerCase()) {
      setUsernameStatus("idle");
      clearErrors("username");
      return;
    }

    // 기본 정규식 및 길이 미달 시
    if (trimmed.length < 2) {
      setUsernameStatus("idle");
      return;
    }

    setUsernameStatus("checking");
    const timer = setTimeout(async () => {
      try {
        const isAvail = await checkUsernameAvailable(trimmed, userId);
        if (isAvail) {
          setUsernameStatus("available");
          clearErrors("username");
        } else {
          setUsernameStatus("duplicate");
          setError("username", {
            type: "manual",
            message: "이미 사용 중인 사용자 아이디(username)입니다.",
          });
        }
      } catch (err) {
        console.error("중복 확인 오류:", err);
        setUsernameStatus("idle");
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [watchedUsername, userId, initialData.username, open, setError, clearErrors]);

  const onSubmit = async (values: ProfileFormValues) => {
    try {
      setIsSubmitting(true);
      setServerError(null);

      const trimmedUsername = values.username.trim();

      // 1. 저장 직전 username 중복 최종 확인
      if (
        trimmedUsername.toLowerCase() !==
        (initialData.username || "").toLowerCase()
      ) {
        const isAvail = await checkUsernameAvailable(trimmedUsername, userId);
        if (!isAvail) {
          setUsernameStatus("duplicate");
          setError("username", {
            type: "manual",
            message: "이미 다른 사용자가 사용 중인 아이디입니다. 다른 아이디를 입력해 주세요.",
          });
          setIsSubmitting(false);
          return;
        }
      }

      // 2. 프로필 저장 실행
      await onSave({
        username: trimmedUsername,
        displayName: values.displayName.trim(),
        bio: values.bio ? values.bio.trim() : "",
      });

      // 3. 닫기
      onOpenChange(false);
    } catch (error: any) {
      console.error("프로필 수정 오류:", error);
      const msg = error?.message || "프로필 저장 중 오류가 발생했습니다. 다시 시도해 주세요.";
      setServerError(msg);
      if (msg.includes("중복") || msg.includes("이미 사용")) {
        setError("username", {
          type: "manual",
          message: msg,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[460px] p-6 rounded-[28px] bg-white border border-[#E5E8EB] shadow-xl">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-[20px] font-bold text-[#191F28] tracking-tight">
              프로필 수정
            </DialogTitle>
          </div>
          <DialogDescription className="text-[13px] text-[#8B95A1]">
            공유 URL 주소와 프로필 정보를 자유롭게 설정하세요.
          </DialogDescription>
        </DialogHeader>

        {serverError && (
          <div className="mt-2 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-[13px] text-red-600 border border-red-100">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
            <p className="flex-1 font-medium">{serverError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="mt-4 space-y-4.5">
          {/* 1. username (공유 URL용 아이디) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="username"
                className="text-[13px] font-semibold text-[#333D4B] flex items-center gap-1"
              >
                <AtSign className="w-3.5 h-3.5 text-[#3182F6]" />
                사용자 아이디 (username)
                <span className="text-[#3182F6] font-bold">*</span>
              </label>
              <span className="text-[11px] text-[#8B95A1]">공유 URL용</span>
            </div>

            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-[#8B95A1] text-[14px] font-medium">
                @
              </div>
              <Input
                id="username"
                type="text"
                disabled={isSubmitting}
                placeholder="chaeyun"
                className={`pl-8 pr-10 text-[14px] h-11 rounded-xl bg-[#F9FAFB] border transition-colors ${
                  errors.username || usernameStatus === "duplicate"
                    ? "border-red-400 focus:border-red-500 bg-red-50/20"
                    : usernameStatus === "available"
                    ? "border-[#00B460] focus:border-[#00B460]"
                    : "border-[#E5E8EB] focus:border-[#3182F6]"
                }`}
                {...register("username")}
              />

              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                {usernameStatus === "checking" && (
                  <Loader2 className="w-4 h-4 animate-spin text-[#8B95A1]" />
                )}
                {usernameStatus === "available" && !errors.username && (
                  <CheckCircle2 className="w-4 h-4 text-[#00B460]" />
                )}
                {(usernameStatus === "duplicate" || errors.username) && (
                  <AlertCircle className="w-4 h-4 text-red-500" />
                )}
              </div>
            </div>

            {/* 안내 및 에러 메시지 */}
            {errors.username ? (
              <p className="text-[12px] text-red-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.username.message}
              </p>
            ) : usernameStatus === "available" ? (
              <p className="text-[12px] text-[#00B460] font-medium flex items-center gap-1 mt-1">
                <CheckCircle2 className="w-3 h-3 shrink-0" />
                사용 가능한 멋진 아이디예요!
              </p>
            ) : (
              <p className="text-[11px] text-[#8B95A1] mt-1">
                영문, 숫자, 밑줄(_), 하이픈(-), 마침표(.)만 사용 가능해요.
              </p>
            )}
          </div>

          {/* 2. displayName (표시 이름) */}
          <div className="space-y-1.5">
            <label
              htmlFor="displayName"
              className="text-[13px] font-semibold text-[#333D4B] flex items-center gap-1"
            >
              <User className="w-3.5 h-3.5 text-[#3182F6]" />
              표시 이름 (displayName)
              <span className="text-[#3182F6] font-bold">*</span>
            </label>
            <Input
              id="displayName"
              type="text"
              disabled={isSubmitting}
              placeholder="표시할 이름을 입력하세요 (예: 홍길동)"
              className={`text-[14px] h-11 rounded-xl bg-[#F9FAFB] border transition-colors ${
                errors.displayName
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#E5E8EB] focus:border-[#3182F6]"
              }`}
              {...register("displayName")}
            />
            {errors.displayName && (
              <p className="text-[12px] text-red-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.displayName.message}
              </p>
            )}
          </div>

          {/* 3. bio (소개글) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="bio"
                className="text-[13px] font-semibold text-[#333D4B] flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5 text-[#3182F6]" />
                소개글 (bio)
              </label>
              <span className="text-[11px] text-[#8B95A1]">
                {watchedBio.length}/200자
              </span>
            </div>
            <textarea
              id="bio"
              rows={3}
              disabled={isSubmitting}
              placeholder="자신을 표현하는 한 줄 소개글을 작성해 보세요."
              className={`w-full resize-none rounded-xl bg-[#F9FAFB] p-3 text-[14px] text-[#191F28] placeholder-[#8B95A1] border transition-colors focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#3182F6]/20 ${
                errors.bio
                  ? "border-red-400 focus:border-red-500"
                  : "border-[#E5E8EB] focus:border-[#3182F6]"
              }`}
              {...register("bio")}
            />
            {errors.bio && (
              <p className="text-[12px] text-red-500 font-medium flex items-center gap-1 mt-1">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {errors.bio.message}
              </p>
            )}
          </div>

          {/* 저장 경로 안내 */}
          <div className="rounded-xl bg-[#F2F4F6] p-2.5 text-[11px] text-[#6B7684]">
            저장 시 Firestore의 <span className="font-mono text-[#3182F6]">users/{userId}/profile</span> 경로에 안전하게 저장됩니다.
          </div>

          <DialogFooter className="mt-6 flex flex-row items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="secondary"
              disabled={isSubmitting}
              onClick={() => onOpenChange(false)}
              className="h-11 rounded-xl px-4 text-[14px] font-medium text-[#4E5968] bg-[#F2F4F6] hover:bg-[#E5E8EB]"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={
                isSubmitting ||
                usernameStatus === "checking" ||
                usernameStatus === "duplicate"
              }
              className="h-11 rounded-xl px-5 text-[14px] font-semibold text-white bg-[#3182F6] hover:bg-[#1B64DA] active:scale-[0.98] transition-all shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-1.5" />
                  저장 중...
                </>
              ) : (
                "저장하기"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
