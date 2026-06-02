import type { UserMode } from "../types/task";

export const WEEKDAYS = ["월", "화", "수", "목", "금"] as const;

export function getTimetableMeta(mode: UserMode) {
  if (mode === "teacher") {
    return {
      pageTitle: "수업 시간표",
      pageIcon: "🏫",
      titleLabel: "과목/수업",
      titlePlaceholder: "예: 국어, 창체",
      noteLabel: "학급",
      notePlaceholder: "예: 3학년 2반",
      emptyMessage: "수업 시간표가 비어 있어요. 아래에서 추가해 보세요.",
    };
  }
  return {
    pageTitle: "자녀 시간표",
    pageIcon: "👨‍👩‍👧",
    titleLabel: "활동/과목",
    titlePlaceholder: "예: 피아노, 영어",
    noteLabel: "장소",
    notePlaceholder: "예: 학교, 학원",
    emptyMessage: "자녀 시간표가 비어 있어요. 아래에서 추가해 보세요.",
  };
}

export function sortTimetableEntries<T extends { dayOfWeek: number; startTime: string }>(
  entries: T[],
): T[] {
  return [...entries].sort((a, b) => {
    if (a.dayOfWeek !== b.dayOfWeek) return a.dayOfWeek - b.dayOfWeek;
    return a.startTime.localeCompare(b.startTime);
  });
}
