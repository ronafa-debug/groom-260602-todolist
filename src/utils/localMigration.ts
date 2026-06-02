import { DEFAULT_CATEGORIES } from "../data/categories";
import type { CategoryMap } from "../store/useTaskStore";
import type { Task, UserMode } from "../types/task";

const LEGACY_STORAGE_KEY = "today-planner-storage";

interface LegacyPersisted {
  state?: {
    tasks?: Task[];
    userMode?: UserMode;
    categories?: CategoryMap;
    todayOrder?: string[];
    upcomingOrder?: string[];
  };
}

export function readLegacyLocalSnapshot(): {
  tasks: Task[];
  userMode: UserMode;
  categories: CategoryMap;
  todayOrder: string[];
  upcomingOrder: string[];
} | null {
  try {
    const raw = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as LegacyPersisted;
    const state = parsed.state;
    if (!state) return null;

    return {
      tasks: state.tasks ?? [],
      userMode: state.userMode ?? "teacher",
      categories: state.categories ?? {
        teacher: [...DEFAULT_CATEGORIES.teacher],
        parent: [...DEFAULT_CATEGORIES.parent],
      },
      todayOrder: state.todayOrder ?? [],
      upcomingOrder: state.upcomingOrder ?? [],
    };
  } catch {
    return null;
  }
}

export function clearLegacyLocalStorage(): void {
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

export function hasLegacyLocalData(): boolean {
  const snapshot = readLegacyLocalSnapshot();
  return Boolean(snapshot && (snapshot.tasks.length > 0 || snapshot.todayOrder.length > 0));
}
