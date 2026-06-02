import type { UserMode } from "../types/task";

export const teacherCategories = [
  "수업 준비",
  "평가 계획",
  "생활기록부",
  "학부모 상담",
  "업무 처리",
];

export const parentCategories = [
  "아이와 독서",
  "숙제 확인",
  "놀이 활동",
  "가족 일정",
  "건강 관리",
];

export const DEFAULT_CATEGORIES: Record<UserMode, string[]> = {
  teacher: [...teacherCategories],
  parent: [...parentCategories],
};

export function getDefaultCategories(mode: UserMode): string[] {
  return [...DEFAULT_CATEGORIES[mode]];
}
