import type { HabitCompletions, HabitFrequency } from "../types/habit";
import { toDateString } from "./date";

export const DEFAULT_HABIT_WEEKS = 4;
export const MIN_HABIT_WEEKS = 1;
export const MAX_HABIT_WEEKS = 10;

export function getHabitWeekCount(habit: { weekCount?: number }): number {
  const n = habit.weekCount;
  if (typeof n === "number" && n >= MIN_HABIT_WEEKS && n <= MAX_HABIT_WEEKS) {
    return n;
  }
  return DEFAULT_HABIT_WEEKS;
}

export function getHabitGridDayCount(weekCount?: number): number {
  return getHabitWeekCount({ weekCount }) * 7;
}

export function getLastNDays(n = 28): string[] {
  const days: string[] = [];
  const today = new Date();
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(toDateString(d));
  }
  return days;
}

/** 그리드 표시용: 오늘=좌상단, 과거로 갈수록 우·하단 */
export function getHabitGridDates(weekCount?: number): string[] {
  const n = getHabitGridDayCount(weekCount);
  const days: string[] = [];
  const today = new Date();
  for (let i = 0; i < n; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    days.push(toDateString(d));
  }
  return days;
}

export function parseDateString(dateStr: string): Date {
  const [y, m, d] = dateStr.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function isScheduledDay(dateStr: string, frequency: HabitFrequency): boolean {
  if (frequency === "daily") return true;
  const day = parseDateString(dateStr).getDay();
  return day >= 1 && day <= 5;
}

export function isCompletedOn(
  completions: HabitCompletions,
  habitId: string,
  dateStr: string,
): boolean {
  return (completions[habitId] ?? []).includes(dateStr);
}

export function getStreak(
  habitId: string,
  completions: HabitCompletions,
  frequency: HabitFrequency,
): number {
  const dates = new Set(completions[habitId] ?? []);
  const today = toDateString();
  let cursor = parseDateString(today);

  if (isScheduledDay(today, frequency) && !dates.has(today)) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  for (let i = 0; i < 400; i++) {
    const ds = toDateString(cursor);
    if (isScheduledDay(ds, frequency)) {
      if (dates.has(ds)) {
        streak++;
      } else {
        break;
      }
    }
    cursor.setDate(cursor.getDate() - 1);
  }

  return streak;
}
