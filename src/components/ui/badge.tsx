import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 토스 디자인 시스템(TDS) Badge 스펙 (design.md 기반)
 * - 높이: 22px
 * - 곡률: 6px (rounded-[6px])
 * - 텍스트: 10px-11px Semibold
 * - 워시드 시맨틱 배경 + 텍스트 컬러
 */
const badgeVariants = cva(
  "inline-flex items-center justify-center h-[22px] px-2 rounded-[6px] text-[11px] font-semibold tracking-tight transition-colors whitespace-nowrap",
  {
    variants: {
      variant: {
        default: "bg-[#F2F4F6] text-[#4E5968]",
        brand: "bg-[#E8F3FF] text-[#3182F6]",
        success: "bg-[#E6F8F0] text-[#00B460]",
        danger: "bg-[#FEECEE] text-[#F04452]",
        warning: "bg-[#FFF8E6] text-[#F59E0B]",
        dark: "bg-[#333D4B] text-white",
        outline: "border border-[#E5E8EB] bg-white text-[#4E5968]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { badgeVariants };
