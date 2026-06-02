import type { CategoryMap } from "../store/useTaskStore";
import type { Habit, HabitCompletions } from "../types/habit";
import type { TimetableEntry } from "../types/timetable";
import type { Task, UserMode } from "../types/task";

export const GUEST_SESSION_FLAG = "today-planner-guest";
export const GUEST_DATA_KEY = "today-planner-guest-data";

export interface GuestSnapshot {
  tasks: Task[];
  userMode: UserMode;
  categories: CategoryMap;
  todayOrder: string[];
  upcomingOrder: string[];
  teacherTimetable: TimetableEntry[];
  parentTimetable: TimetableEntry[];
  teacherHabits: Habit[];
  parentHabits: Habit[];
  habitCompletions: HabitCompletions;
}

export function isGuestSessionFlag(): boolean {
  try {
    return sessionStorage.getItem(GUEST_SESSION_FLAG) === "1";
  } catch {
    return false;
  }
}

export function setGuestSessionFlag(): void {
  try {
    sessionStorage.setItem(GUEST_SESSION_FLAG, "1");
  } catch {
    /* ignore */
  }
}

export function clearGuestSession(): void {
  try {
    sessionStorage.removeItem(GUEST_SESSION_FLAG);
    sessionStorage.removeItem(GUEST_DATA_KEY);
  } catch {
    /* ignore */
  }
}

export function saveGuestSnapshot(snapshot: GuestSnapshot): void {
  try {
    sessionStorage.setItem(GUEST_DATA_KEY, JSON.stringify(snapshot));
  } catch {
    /* ignore */
  }
}

export function loadGuestSnapshot(): GuestSnapshot | null {
  try {
    const raw = sessionStorage.getItem(GUEST_DATA_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GuestSnapshot;
  } catch {
    return null;
  }
}
