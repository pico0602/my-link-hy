"use client";

import React, { useState } from "react";
import { Database, Check, Copy } from "lucide-react";

interface FirestorePathBannerProps {
  uid: string;
  onCopy?: () => void;
}

export function FirestorePathBanner({ uid, onCopy }: FirestorePathBannerProps) {
  const [copied, setCopied] = useState(false);
  const path = `users/${uid}/links`;

  const handleCopy = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(path);
      setCopied(true);
      if (onCopy) onCopy();
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl bg-white border border-[#E5E8EB] p-3 shadow-2xs">
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#E8F3FF] text-[#3182F6]">
          <Database className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] font-semibold text-[#8B95A1] uppercase tracking-wider">
              Firestore 데이터 경로
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#00B460] bg-[#E8F8F0] px-1.5 py-0.2 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-[#00B460] animate-pulse" />
              실시간 동기화
            </span>
          </div>
          <p className="font-mono text-[12px] sm:text-[13px] font-medium text-[#191F28] truncate">
            {path}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-[#8B95A1] hover:text-[#3182F6] hover:bg-[#F2F4F6] transition-colors cursor-pointer"
        title="Firestore 경로 복사"
        aria-label="Firestore 경로 복사"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-[#00B460]" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
      </button>
    </div>
  );
}
