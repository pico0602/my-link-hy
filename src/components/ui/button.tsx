import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 토스 디자인 시스템(TDS) Button 스펙 (design.md 기반)
 * - XL(56px / radius 16px / 17px Bold)
 * - L(48px / radius 14px / 17px Bold)
 * - M(40px / radius 12px / 15px Semibold)
 * - S(32px / radius 10px / 13px Semibold)
 * - variants: primary(blue-500), secondary(grey-100), weak(blue-50), danger(red-500), ghost, outline
 * - haptic feedback: active:scale-[0.98]
 */
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center font-medium whitespace-nowrap transition-all duration-100 select-none cursor-pointer outline-none active:scale-[0.98] disabled:pointer-events-none disabled:opacity-30 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary:
          "bg-[#3182F6] text-white hover:bg-[#2870D4] active:bg-[#205DB2] shadow-[0_4px_12px_rgba(49,130,246,0.25)]",
        secondary:
          "bg-[#F2F4F6] text-[#191F28] hover:bg-[#E5E8EB] active:bg-[#D1D6DB]",
        weak:
          "bg-[#E8F3FF] text-[#3182F6] hover:bg-[#D5E8FD] active:bg-[#C2DEFC] font-semibold",
        danger:
          "bg-[#F04452] text-white hover:bg-[#D83845] active:bg-[#C02F3A]",
        ghost:
          "bg-transparent text-[#4E5968] hover:bg-[#F2F4F6] hover:text-[#191F28]",
        outline:
          "border border-[#E5E8EB] bg-white text-[#333D4B] hover:bg-[#F9FAFB] active:bg-[#F2F4F6]",
      },
      size: {
        xl: "h-14 rounded-2xl px-6 text-[17px] font-bold gap-2",
        lg: "h-12 rounded-[14px] px-5 text-[17px] font-bold gap-2",
        md: "h-10 rounded-[12px] px-4 text-[15px] font-semibold gap-1.5",
        sm: "h-8 rounded-[10px] px-3 text-[13px] font-semibold gap-1",
        icon: "h-10 w-10 rounded-[12px] p-0",
        "icon-sm": "h-8 w-8 rounded-[10px] p-0",
      },
    },
    defaultVariants: {
      variant: "secondary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { buttonVariants };
