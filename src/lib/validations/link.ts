import { z } from "zod";

// URL 정규식 패턴 (http, https, mailto, tel 지원 및 프로토콜 생략 도메인 지원)
export const URL_PATTERN =
  /^(https?:\/\/)?([a-zA-Z0-9]([a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(:\d+)?(\/[^\s]*)?$/i;
export const SPECIAL_PROTOCOLS =
  /^(mailto:[^\s@]+@[^\s@]+\.[^\s@]+|tel:[0-9\-+]+)$/i;

// Zod 유효성 검증 스키마 정의 (추가 및 수정 공통 사용)
export const linkFormSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "링크 제목을 입력해 주세요.")
    .min(2, "제목은 2자 이상 입력해 주세요.")
    .max(30, "제목은 30자 이내로 입력해 주세요."),
  url: z
    .string()
    .trim()
    .min(1, "웹 주소(URL)를 입력해 주세요.")
    .refine((val) => !/\s/.test(val), "URL에는 공백이 포함될 수 없어요.")
    .refine(
      (val) => URL_PATTERN.test(val) || SPECIAL_PROTOCOLS.test(val),
      "올바른 웹 주소 형식을 입력해 주세요. (예: https://github.com/my-link)"
    ),
  subtitle: z
    .string()
    .trim()
    .max(60, "설명은 60자 이내로 입력해 주세요.")
    .optional(),
  category: z.enum(["project", "blog", "social", "contact"]),
  badge: z
    .string()
    .trim()
    .max(8, "뱃지는 8자 이내로 입력해 주세요.")
    .optional(),
  iconType: z.string(),
});

export type LinkFormValues = z.infer<typeof linkFormSchema>;

export const CATEGORY_OPTIONS: {
  id: "project" | "blog" | "social" | "contact";
  name: string;
}[] = [
  { id: "project", name: "프로젝트" },
  { id: "blog", name: "블로그·글" },
  { id: "social", name: "SNS" },
  { id: "contact", name: "연락처" },
];

export const PRESET_BADGES = ["신규", "대표", "인기", "추천", "코드", "글"];

/**
 * URL 입력 시 도메인 스마트 자동 감지 헬퍼
 */
export function detectSmartMetadata(url: string, currentBadge?: string) {
  const lower = url.toLowerCase();
  let iconType: string | undefined;
  let category: "project" | "blog" | "social" | "contact" | undefined;
  let badge: string | undefined;

  if (lower.includes("github.com")) {
    iconType = "github";
    category = "project";
    if (!currentBadge) badge = "코드";
  } else if (
    lower.includes("velog.io") ||
    lower.includes("tistory.com") ||
    lower.includes("medium.com") ||
    lower.includes("blog")
  ) {
    iconType = "blog";
    category = "blog";
    if (!currentBadge) badge = "글";
  } else if (lower.includes("notion.so") || lower.includes("notion.site")) {
    iconType = "notion";
    category = "project";
    if (!currentBadge) badge = "대표";
  } else if (lower.includes("instagram.com")) {
    iconType = "instagram";
    category = "social";
    if (!currentBadge) badge = "SNS";
  } else if (lower.includes("linkedin.com")) {
    iconType = "custom";
    category = "social";
    if (!currentBadge) badge = "커리어";
  } else if (lower.includes("open.kakao.com") || lower.startsWith("mailto:")) {
    iconType = "custom";
    category = "contact";
    if (!currentBadge) badge = "연락";
  }

  return { iconType, category, badge };
}
