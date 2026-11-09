"use client";

import React, { useState } from "react";
import { Lock, Sparkles, Database, ShieldCheck, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

interface LoginPromptCardProps {
  onLoginSuccess?: (name: string) => void;
}

export function LoginPromptCard({ onLoginSuccess }: LoginPromptCardProps) {
  const { signInWithGoogle } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    try {
      setIsSubmitting(true);
      const user = await signInWithGoogle();
      if (user && onLoginSuccess) {
        onLoginSuccess(user.displayName || user.email || "사용자");
      }
    } catch (error) {
      console.error("로그인 실패:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6 text-center overflow-hidden border border-[#E5E8EB] bg-white">
      {/* 상단 원형 아이콘 */}
      <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E8F3FF] text-[#3182F6]">
        <Lock className="w-7 h-7" />
      </div>

      {/* 메인 타이틀 및 설명 문구 */}
      <h2 className="text-[18px] sm:text-[19px] font-bold text-[#191F28] tracking-tight">
        로그인 후 바로가기 링크를 이용해 보세요
      </h2>
      <p className="mt-2 text-[13px] sm:text-[14px] leading-relaxed text-[#4E5968] break-keep max-w-[380px] mx-auto">
        Google 계정으로 로그인하시면 나만의 전용 Firestore 저장소에 링크가 안전하게 보관되고, 실시간으로 자유롭게 추가·수정·삭제할 수 있어요.
      </p>

      {/* 주요 기능 혜택 안내 목록 */}
      <div className="mt-5 rounded-2xl bg-[#F9FAFB] p-4 text-left border border-[#F2F4F6] space-y-3">
        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white border border-[#E5E8EB] text-[#3182F6] shadow-2xs">
            <Database className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#191F28]">
              개인화된 Firestore 저장 경로
            </p>
            <p className="text-[12px] text-[#8B95A1] mt-0.5">
              로그인 즉시 <span className="font-mono text-[#3182F6]">users/&#123;user.uid&#125;/links</span> 경로가 자동 생성되어 나만의 데이터가 분리됩니다.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white border border-[#E5E8EB] text-[#00B460] shadow-2xs">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#191F28]">
              실시간 동기화 & 간편 편집
            </p>
            <p className="text-[12px] text-[#8B95A1] mt-0.5">
              어느 기기에서 접속하든 실시간으로 링크 상태가 동기화되며 자유롭게 링크를 관리할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white border border-[#E5E8EB] text-[#F59E0B] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[13px] font-semibold text-[#191F28]">
              Google 보안 계정 인증
            </p>
            <p className="text-[12px] text-[#8B95A1] mt-0.5">
              별도의 회원가입 없이 Google 원클릭 인증으로 안전하고 빠르게 시작할 수 있어요.
            </p>
          </div>
        </div>
      </div>

      {/* Google 로그인 액션 CTA 버튼 */}
      <div className="mt-6">
        <Button
          size="lg"
          disabled={isSubmitting}
          onClick={handleLogin}
          className="w-full h-12 rounded-2xl bg-[#3182F6] text-white font-semibold text-[15px] hover:bg-[#1B64DA] active:scale-[0.98] transition-all shadow-xs flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            </div>
          )}
          <span>Google로 로그인하고 시작하기</span>
        </Button>
      </div>
    </Card>
  );
}
