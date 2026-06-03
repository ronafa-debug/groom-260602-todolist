import type { TimetableEntry } from "../types/timetable";
import type { UserMode } from "../types/task";

export const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"] as const;

/** 월~금 (0=일, 6=토) */
export const WEEKDAY_INDICES = [1, 2, 3, 4, 5] as const;
export const SATURDAY_INDEX = 6;
export const SUNDAY_INDEX = 0;

export const DEFAULT_TIMETABLE_PERIOD_COUNT = 6;
export const MIN_TIMETABLE_PERIOD_COUNT = 6;
export const MAX_TIMETABLE_PERIOD_COUNT = 12;
export const LUNCH_AFTER_PERIOD = 4;
export const LUNCH_ROW_LABEL = "점심시간";

export function getTimetableMeta(mode: UserMode) {
  if (mode === "teacher") {
    return {
      pageTitle: "수업 시간표",
      pageIcon: "🏫",
      titleLabel: "과목/수업",
      titlePlaceholder: "예: 국어, 창체",
      noteLabel: "학급/장소",
      notePlaceholder: "예: 3학년 2반",
    };
  }
  return {
    pageTitle: "자녀 시간표",
    pageIcon: "👨‍👩‍👧",
    titleLabel: "활동/과목",
    titlePlaceholder: "예: 피아노, 영어",
    noteLabel: "학급/장소",
    notePlaceholder: "예: 학교, 학원",
  };
}

export function getPeriodLabel(period: number): string {
  return `${period}교시`;
}

export function getWeekdayLabel(dayOfWeek: number): string {
  return WEEKDAYS[dayOfWeek] ?? "";
}

export function formatTimetableTimeCompact(time: string): string {
  const [h = "0", m = "0"] = time.split(":");
  return `${h.padStart(2, "0")}${m.padStart(2, "0")}`;
}

export function formatPeriodTimeRange(startTime?: string, endTime?: string): string {
  if (!startTime || !endTime) return "";
  return `${formatTimetableTimeCompact(startTime)}-${formatTimetableTimeCompact(endTime)}`;
}

export type TimetableGridRow =
  | { type: "period"; period: number }
  | { type: "lunch" };

/** 1~N교시 사이 4교시 다음 점심 행 포함 */
export function buildTimetableGridRows(periodCount: number): TimetableGridRow[] {
  const rows: TimetableGridRow[] = [];
  for (let period = 1; period <= periodCount; period++) {
    rows.push({ type: "period", period });
    if (period === LUNCH_AFTER_PERIOD && periodCount > LUNCH_AFTER_PERIOD) {
      rows.push({ type: "lunch" });
    }
  }
  return rows;
}

export function getVisibleWeekdayIndices(
  showSaturday: boolean,
  showSunday: boolean,
): number[] {
  const days: number[] = [...WEEKDAY_INDICES];
  if (showSaturday) days.push(SATURDAY_INDEX);
  if (showSunday) days.push(SUNDAY_INDEX);
  return days;
}

/** 예전 월~금(0~4) 데이터를 일~토 기준으로 변환 */
export function normalizeTimetableDayOfWeek(entry: TimetableEntry): number {
  if (entry.period != null && entry.dayOfWeek <= 6) {
    return entry.dayOfWeek;
  }
  if (entry.dayOfWeek >= 0 && entry.dayOfWeek <= 4) {
    return entry.dayOfWeek + 1;
  }
  return entry.dayOfWeek;
}

export function getTimetablePeriod(entry: TimetableEntry): number {
  return entry.period ?? 1;
}

export function matchesTimetableSlot(
  entry: TimetableEntry,
  dayOfWeek: number,
  period: number,
): boolean {
  return (
    normalizeTimetableDayOfWeek(entry) === dayOfWeek &&
    getTimetablePeriod(entry) === period
  );
}

export function buildTimetableSlotMap(entries: TimetableEntry[]): Map<string, TimetableEntry> {
  const map = new Map<string, TimetableEntry>();
  for (const entry of entries) {
    const day = normalizeTimetableDayOfWeek(entry);
    const period = getTimetablePeriod(entry);
    map.set(`${day}-${period}`, entry);
  }
  return map;
}

export function sortTimetableEntries(entries: TimetableEntry[]): TimetableEntry[] {
  return [...entries].sort((a, b) => {
    const dayA = normalizeTimetableDayOfWeek(a);
    const dayB = normalizeTimetableDayOfWeek(b);
    if (dayA !== dayB) return dayA - dayB;
    return getTimetablePeriod(a) - getTimetablePeriod(b);
  });
}
