import type { Habit, HabitFrequency } from "../types/habit";
import type { UserMode } from "../types/task";
import {
  DEFAULT_HABIT_WEEKS,
  getHabitGridDates,
  isScheduledDay,
} from "../utils/habit";

export const HABIT_WEEK_OPTIONS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] as const;

export const HABIT_COLORS = [
  "#4D796B",
  "#5B8A7E",
  "#7BA393",
  "#C4A574",
  "#D4847A",
  "#8B7EC8",
  "#6B9BD1",
  "#E8A87C",
] as const;

export function getHabitMeta(mode: UserMode) {
  if (mode === "teacher") {
    return {
      pageTitle: "교사 습관",
      pageIcon: "📚",
      emptyMessage: "습관이 비어 있어요. 아래에서 첫 습관을 추가해 보세요.",
      namePlaceholder: "예: 아침 독서, 수업 준비",
      descriptionPlaceholder: "예: 매일 15분",
    };
  }
  return {
    pageTitle: "가족 습관",
    pageIcon: "🏡",
    emptyMessage: "습관이 비어 있어요. 아래에서 첫 습관을 추가해 보세요.",
    namePlaceholder: "예: 아이와 독서, 산책",
    descriptionPlaceholder: "예: 저녁 30분",
  };
}

export interface ExampleHabitDisplay {
  habit: Habit;
  completedDates: string[];
  demoStreak: number;
}

function buildDemoCompletedDates(
  frequency: HabitFrequency,
  fillRecentDays: number,
  weekCount = DEFAULT_HABIT_WEEKS,
): string[] {
  const days = getHabitGridDates(weekCount);
  const completed: string[] = [];
  let filled = 0;

  for (let i = 0; i < days.length && filled < fillRecentDays; i++) {
    const dateStr = days[i];
    if (!isScheduledDay(dateStr, frequency)) continue;
    if (i % 5 !== 0 || filled < fillRecentDays - 2) {
      completed.push(dateStr);
      filled++;
    }
  }

  for (let i = fillRecentDays; i < days.length; i++) {
    const dateStr = days[i];
    if (!isScheduledDay(dateStr, frequency)) continue;
    if (i % 3 === 0) completed.push(dateStr);
  }

  return [...new Set(completed)];
}

export function getExampleHabits(mode: UserMode): ExampleHabitDisplay[] {
  if (mode === "teacher") {
    return [
      {
        habit: {
          id: "example-teacher-reading",
          name: "아침 독서",
          description: "매일 15분",
          icon: "📖",
          color: HABIT_COLORS[0],
          frequency: "daily",
          weekCount: DEFAULT_HABIT_WEEKS,
          createdAt: "",
        },
        completedDates: buildDemoCompletedDates("daily", 12, DEFAULT_HABIT_WEEKS),
        demoStreak: 5,
      },
      {
        habit: {
          id: "example-teacher-prep",
          name: "수업 준비",
          icon: "✏️",
          color: HABIT_COLORS[3],
          frequency: "weekdays",
          weekCount: DEFAULT_HABIT_WEEKS,
          createdAt: "",
        },
        completedDates: buildDemoCompletedDates("weekdays", 8, DEFAULT_HABIT_WEEKS),
        demoStreak: 3,
      },
    ];
  }

  return [
    {
      habit: {
        id: "example-parent-reading",
        name: "아이와 독서",
        description: "저녁 20분",
        icon: "📚",
        color: HABIT_COLORS[5],
        frequency: "daily",
        weekCount: DEFAULT_HABIT_WEEKS,
        createdAt: "",
      },
      completedDates: buildDemoCompletedDates("daily", 10, DEFAULT_HABIT_WEEKS),
      demoStreak: 4,
    },
    {
      habit: {
        id: "example-parent-walk",
        name: "가족 산책",
        icon: "🚶",
        color: HABIT_COLORS[6],
        frequency: "weekdays",
        weekCount: DEFAULT_HABIT_WEEKS,
        createdAt: "",
      },
      completedDates: buildDemoCompletedDates("weekdays", 7, DEFAULT_HABIT_WEEKS),
      demoStreak: 2,
    },
  ];
}
