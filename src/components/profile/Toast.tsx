"use client";

import React from "react";

interface ToastProps {
  message: string | null;
}

export function Toast({ message }: ToastProps) {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2.5 rounded-[14px] bg-[#191F28] px-5 py-3.5 text-[14px] font-medium text-white shadow-[0_8px_24px_rgba(25,31,40,0.25)] animate-in fade-in slide-in-from-bottom-2 duration-200 pointer-events-none"
    >
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#00B460] text-white">
        <svg
          className="w-3 h-3"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 13l4 4L19 7"
          />
        </svg>
      </span>
      <span>{message}</span>
    </div>
  );
}
