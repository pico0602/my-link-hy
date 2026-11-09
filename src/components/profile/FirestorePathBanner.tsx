"use client";

import React, { useState } from "react";
import { Database, Check, Copy } from "lucide-react";

interface FirestorePathBannerProps {
  uid: string;
  onCopy?: (pathName: string) => void;
}

export function FirestorePathBanner({ uid, onCopy }: FirestorePathBannerProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const paths = [
    { key: "profile", label: "프로필", path: `users/${uid}/profile` },
    { key: "links", label: "링크", path: `users/${uid}/links` },
  ];

  const handleCopy = (key: string, path: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(path);
      setCopiedKey(key);
      if (onCopy) onCopy(path);
      setTimeout(() => setCopiedKey(null), 2000);
    }
  };

  return (
    <div className="rounded-2xl bg-white border border-[#E5E8EB] p-3.5 shadow-2xs space-y-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-[#E8F3FF] text-[#3182F6]">
            <Database className="w-3.5 h-3.5" />
          </div>
          <span className="text-[12px] font-bold text-[#191F28] tracking-tight">
            Firestore 데이터 동기화 경로
          </span>
        </div>
        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#00B460] bg-[#E8F8F0] px-2 py-0.5 rounded-full">
          <span className="h-1.5 w-1.5 rounded-full bg-[#00B460] animate-pulse" />
          실시간 연동
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {paths.map((item) => (
          <div
            key={item.key}
            className="flex items-center justify-between gap-1.5 rounded-xl bg-[#F9FAFB] p-2 border border-[#F2F4F6]"
          >
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-semibold text-[#8B95A1] uppercase tracking-wider block">
                {item.label} 경로
              </span>
              <p className="font-mono text-[11px] font-medium text-[#191F28] truncate">
                {item.path}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleCopy(item.key, item.path)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#8B95A1] hover:text-[#3182F6] hover:bg-white transition-colors cursor-pointer border border-transparent hover:border-[#E5E8EB]"
              title={`${item.label} 경로 복사`}
              aria-label={`${item.label} 경로 복사`}
            >
              {copiedKey === item.key ? (
                <Check className="w-3.5 h-3.5 text-[#00B460]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
