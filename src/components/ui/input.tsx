import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * 토스 디자인 시스템(TDS) Input 스펙 (design.md 기반)
 * - 높이: 48px (h-12)
 * - 라운딩: rounded-xl (12px)
 * - 테두리: 1px border-[#E5E8EB] (기본)
 * - 포커스: 1.5px border-[#3182F6] + 부드러운 ring
 * - 배경: 흰색 (bg-white)
 * - 텍스트: 15px font-medium text-[#191F28]
 */
export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-12 w-full rounded-xl border border-[#E5E8EB] bg-white px-4 py-2 text-[15px] font-medium text-[#191F28] placeholder:text-[#B0B8C1] transition-all outline-none",
          "focus:border-[#3182F6] focus:ring-2 focus:ring-[#3182F6]/15",
          error && "border-[#F04452] focus:border-[#F04452] focus:ring-[#F04452]/15",
          "disabled:cursor-not-allowed disabled:bg-[#F2F4F6] disabled:text-[#8B95A1]",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";
