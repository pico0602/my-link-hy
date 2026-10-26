"use client";

import React, { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LinkItem } from "@/types/link";

interface DeleteLinkDialogProps {
  link: LinkItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmDelete: (id: string) => Promise<void> | void;
}

export function DeleteLinkDialog({
  link,
  open,
  onOpenChange,
  onConfirmDelete,
}: DeleteLinkDialogProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!link) return null;

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await onConfirmDelete(link.id);
      onOpenChange(false);
    } catch (error) {
      console.error("링크 삭제 실패:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FEECEE] text-[#F04452]">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <DialogTitle>정말 삭제하시겠습니까?</DialogTitle>
          </div>
          <DialogDescription>
            선택하신 링크가 프로필과 데이터베이스에서 완전히 삭제됩니다.
          </DialogDescription>
        </DialogHeader>

        <div className="my-2 rounded-[14px] bg-[#F9FAFB] border border-[#E5E8EB] p-3.5 space-y-2">
          {/* 링크 이름 표시 */}
          <div className="space-y-0.5">
            <span className="text-[11px] font-semibold text-[#8B95A1] uppercase tracking-wider">
              삭제할 링크
            </span>
            <p className="text-[15px] font-bold text-[#191F28] break-all leading-snug">
              {link.title}
            </p>
            {link.url && (
              <p className="text-[12px] text-[#8B95A1] truncate">
                {link.url}
              </p>
            )}
          </div>

          {/* 경고: 이 작업은 되돌릴 수 없습니다 (빨간색) */}
          <div className="flex items-center gap-1.5 pt-2 border-t border-[#F2F4F6] text-[#F04452]">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
            <p className="text-[12px] font-semibold">
              이 작업은 되돌릴 수 없습니다
            </p>
          </div>
        </div>

        <DialogFooter className="mt-5">
          <Button
            type="button"
            variant="secondary"
            size="md"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            className="w-full sm:w-auto"
          >
            취소
          </Button>
          <Button
            type="button"
            variant="danger"
            size="md"
            disabled={isDeleting}
            onClick={handleDelete}
            className="w-full sm:w-auto flex items-center justify-center gap-1.5"
          >
            <Trash2 className="w-4 h-4" />
            <span>{isDeleting ? "삭제 중..." : "삭제하기"}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
