import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 토스 디자인 시스템(TDS) Chip 스펙 (design.md 기반)
 * - 높이: 34px (h-[34px])
 * - 곡률: 999px full pill (rounded-full)
 * - 텍스트: 13px Medium/Semibold (text-[13px])
 * - 패딩: 14px (px-3.5)
 * - variants: default(outline white), active(grey-900), brand(blue-50/blue-500)
 */
const chipVariants = cva(
  "inline-flex items-center justify-center h-[34px] px-3.5 rounded-full text-[13px] font-medium transition-all select-none whitespace-nowrap cursor-pointer active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "border border-[#E5E8EB] bg-white text-[#333D4B] hover:border-[#D1D6DB] hover:bg-[#F9FAFB]",
        active:
          "bg-[#191F28] text-white shadow-xs font-semibold hover:bg-[#333D4B]",
        brand:
          "bg-[#E8F3FF] text-[#3182F6] font-semibold hover:bg-[#D5E8FD]",
        muted:
          "bg-[#F2F4F6] text-[#4E5968] hover:bg-[#E5E8EB]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface ChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  active?: boolean;
}

export const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, variant, active, ...props }, ref) => {
    const computedVariant = active ? "active" : variant;
    return (
      <button
        ref={ref}
        type="button"
        className={cn(chipVariants({ variant: computedVariant }), className)}
        {...props}
      />
    );
  }
);

Chip.displayName = "Chip";
export { chipVariants };
