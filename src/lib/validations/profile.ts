import { z } from "zod";

export const USERNAME_REGEX = /^[a-zA-Z0-9_.-]+$/;

export const profileFormSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "사용자 아이디(username)를 입력해 주세요.")
    .min(2, "아이디는 2자 이상 입력해 주세요.")
    .max(30, "아이디는 최대 30자까지 가능합니다.")
    .regex(
      USERNAME_REGEX,
      "영문, 숫자, 밑줄(_), 하이픈(-), 마침표(.)만 사용할 수 있어요."
    )
    .refine((val) => !/\s/.test(val), "아이디에는 공백이 들어갈 수 없어요."),
  displayName: z
    .string()
    .trim()
    .min(1, "표시 이름을 입력해 주세요.")
    .max(30, "표시 이름은 최대 30자까지 가능합니다."),
  bio: z
    .string()
    .trim()
    .max(200, "소개글은 최대 200자까지 작성할 수 있어요."),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
