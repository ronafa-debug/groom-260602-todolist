export type HabitFrequency = "daily" | "weekdays";

export interface Habit {
  id: string;
  name: string;
  description?: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  /** 표시할 주 수 (1–10), 기본 4주 */
  weekCount: number;
  createdAt: string;
}

export type HabitCompletions = Record<string, string[]>;
