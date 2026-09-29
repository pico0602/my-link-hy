import * as React from "react";
import Image from "next/image";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/**
 * 토스 디자인 시스템(TDS) Avatar 스펙 (design.md 기반)
 * - 원형 아바타 (rounded-full)
 * - sizes: xl(56px), lg(48px), md(44px), sm(36px)
 * - 온라인 상태 점(AvatarIndicator) 지원
 */
const avatarVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center rounded-full bg-[#E8F3FF] text-[#3182F6] font-bold select-none overflow-visible",
  {
    variants: {
      size: {
        xl: "h-14 w-14 text-xl",
        lg: "h-12 w-12 text-lg",
        md: "h-11 w-11 text-base",
        sm: "h-9 w-9 text-sm",
      },
    },
    defaultVariants: {
      size: "xl",
    },
  }
);

export interface AvatarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {}

export function Avatar({ className, size, children, ...props }: AvatarProps) {
  return (
    <div className={cn(avatarVariants({ size }), className)} {...props}>
      {children}
    </div>
  );
}

export function AvatarImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [error, setError] = React.useState(false);

  if (error || !src) return null;

  return (
    <Image
      src={src}
      alt={alt}
      fill
      className={cn("rounded-full object-cover", className)}
      onError={() => setError(true)}
      unoptimized
    />
  );
}

export function AvatarFallback({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span className={cn("flex items-center justify-center", className)}>
      {children}
    </span>
  );
}

export function AvatarIndicator({
  status = "online",
  className,
}: {
  status?: "online" | "offline" | "busy";
  className?: string;
}) {
  const colorMap = {
    online: "bg-[#00B460]",
    offline: "bg-[#B0B8C1]",
    busy: "bg-[#F04452]",
  };

  return (
    <span
      className={cn(
        "absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-2 border-white",
        colorMap[status],
        className
      )}
    />
  );
}
