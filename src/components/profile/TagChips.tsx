"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Chip } from "@/components/ui/chip";

interface TagChipsProps {
  tags: string[];
}

export function TagChips({ tags }: TagChipsProps) {
  if (!tags || tags.length === 0) return null;

  return (
    <Card className="p-5">
      <h2 className="text-[15px] font-bold text-[#191F28] mb-3 tracking-tight">
        관심 키워드
      </h2>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <Chip key={tag} variant="default">
            {tag}
          </Chip>
        ))}
      </div>
    </Card>
  );
}
