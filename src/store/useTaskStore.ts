import { create } from "zustand";
import { DEFAULT_CATEGORIES } from "../data/categories";
import { completionMessages } from "../data/encouragement";
import {
  deleteTaskRow,
  insertTask,
  loadUserData,
  saveProfile,
  updateTaskRow,
  uploadLocalSnapshot,
} from "../services/dataSync";
import type { Habit, HabitCompletions } from "../types/habit";
import type { TimetableEntry } from "../types/timetable";
import type { Priority, Task, UserMode } from "../types/task";
import { toDateString } from "../utils/date";
import {
  clearLegacyLocalStorage,
  readLegacyLocalSnapshot,
} from "../utils/localMigration";
import {
  saveGuestSnapshot,
  type GuestSnapshot,
} from "../utils/guestSession";

export type CategoryMap = Record<UserMode, string[]>;
export type OrderListKey = "today" | "upcoming";

interface TaskStore {
  userId: string | null;
  isGuestMode: boolean;
  isHydrated: boolean;
  isSyncing: boolean;
  syncError: string | null;
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
  lastEncouragement: string | null;
  getTimetableForMode: (mode?: UserMode) => TimetableEntry[];
  addTimetableEntry: (input: Omit<TimetableEntry, "id">) => void;
  updateTimetableEntry: (id: string, input: Omit<TimetableEntry, "id">) => void;
  deleteTimetableEntry: (id: string) => void;
  getHabitsForMode: (mode?: UserMode) => Habit[];
  addHabit: (input: Omit<Habit, "id" | "createdAt">) => void;
  updateHabit: (id: string, input: Omit<Habit, "id" | "createdAt">) => void;
  deleteHabit: (id: string) => void;
  toggleHabitCompletion: (habitId: string, date?: string) => void;
  hydrateFromServer: (userId: string) => Promise<void>;
  importLegacySnapshot: (userId: string) => Promise<void>;
  loadGuestSession: (snapshot: GuestSnapshot) => void;
  setGuestMode: (active: boolean) => void;
  resetStore: () => void;
  setUserMode: (mode: UserMode) => void;
  getCategories: (mode?: UserMode) => string[];
  addCategory: (name: string) => void;
  updateCategory: (oldName: string, newName: string) => void;
  deleteCategory: (name: string) => void;
  addTask: (input: {
    title: string;
    priority: Priority;
    category: string;
    dueDate?: string;
  }) => void;
  updateTask: (
    id: string,
    input: {
      title: string;
      priority: Priority;
      category: string;
      dueDate?: string;
    },
  ) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  reorderList: (list: OrderListKey, orderedIds: string[]) => void;
  clearEncouragement: () => void;
}

const initialCategories: CategoryMap = {
  teacher: [...DEFAULT_CATEGORIES.teacher],
  parent: [...DEFAULT_CATEGORIES.parent],
};

function randomMessage(): string {
  return completionMessages[Math.floor(Math.random() * completionMessages.length)];
}

function removeIdFromOrders(id: string, todayOrder: string[], upcomingOrder: string[]) {
  return {
    todayOrder: todayOrder.filter((taskId) => taskId !== id),
    upcomingOrder: upcomingOrder.filter((taskId) => taskId !== id),
  };
}

function guestSnapshotFromStore(state: TaskStore): GuestSnapshot {
  return {
    tasks: state.tasks,
    userMode: state.userMode,
    categories: state.categories,
    todayOrder: state.todayOrder,
    upcomingOrder: state.upcomingOrder,
    teacherTimetable: state.teacherTimetable,
    parentTimetable: state.parentTimetable,
    teacherHabits: state.teacherHabits,
    parentHabits: state.parentHabits,
    habitCompletions: state.habitCompletions,
  };
}

function afterStoreMutation(get: () => TaskStore) {
  if (get().isGuestMode) {
    saveGuestSnapshot(guestSnapshotFromStore(get()));
    return;
  }
  void persistProfile(get).catch(console.error);
}

async function persistProfile(get: () => TaskStore) {
  const {
    userId,
    userMode,
    categories,
    todayOrder,
    upcomingOrder,
    teacherTimetable,
    parentTimetable,
    teacherHabits,
    parentHabits,
    habitCompletions,
  } = get();
  if (!userId) return;
  await saveProfile(userId, {
    userMode,
    categories,
    todayOrder,
    upcomingOrder,
    teacherTimetable,
    parentTimetable,
    teacherHabits,
    parentHabits,
    habitCompletions,
  });
}

function patchTimetable(
  mode: UserMode,
  entries: TimetableEntry[],
): Partial<Pick<TaskStore, "teacherTimetable" | "parentTimetable">> {
  return mode === "teacher"
    ? { teacherTimetable: entries }
    : { parentTimetable: entries };
}

function patchHabits(
  mode: UserMode,
  habits: Habit[],
): Partial<Pick<TaskStore, "teacherHabits" | "parentHabits">> {
  return mode === "teacher" ? { teacherHabits: habits } : { parentHabits: habits };
}

export const useTaskStore = create<TaskStore>()((set, get) => ({
  userId: null,
  isGuestMode: false,
  isHydrated: false,
  isSyncing: false,
  syncError: null,
  tasks: [],
  userMode: "teacher",
  categories: initialCategories,
  todayOrder: [],
  upcomingOrder: [],
  teacherTimetable: [],
  parentTimetable: [],
  teacherHabits: [],
  parentHabits: [],
  habitCompletions: {},
  lastEncouragement: null,

  hydrateFromServer: async (userId) => {
    set({ isSyncing: true, syncError: null, userId });
    try {
      const data = await loadUserData(userId);
      set({
        ...data,
        isHydrated: true,
        isSyncing: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "데이터를 불러오지 못했습니다.";
      set({ syncError: message, isSyncing: false, isHydrated: false });
      throw err;
    }
  },

  importLegacySnapshot: async (userId) => {
    const legacy = readLegacyLocalSnapshot();
    if (!legacy) return;

    set({ isSyncing: true, syncError: null, userId });
    try {
      await uploadLocalSnapshot(userId, {
        ...legacy,
        teacherTimetable: [],
        parentTimetable: [],
        teacherHabits: [],
        parentHabits: [],
        habitCompletions: {},
      });
      clearLegacyLocalStorage();
      const data = await loadUserData(userId);
      set({ ...data, isHydrated: true, isSyncing: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "가져오기에 실패했습니다.";
      set({ syncError: message, isSyncing: false });
      throw err;
    }
  },

  loadGuestSession: (snapshot) =>
    set({
      ...snapshot,
      userId: null,
      isGuestMode: true,
      isHydrated: true,
      isSyncing: false,
      syncError: null,
      lastEncouragement: null,
    }),

  setGuestMode: (active) => set({ isGuestMode: active }),

  resetStore: () =>
    set({
      userId: null,
      isGuestMode: false,
      isHydrated: false,
      isSyncing: false,
      syncError: null,
      tasks: [],
      userMode: "teacher",
      categories: initialCategories,
      todayOrder: [],
      upcomingOrder: [],
      teacherTimetable: [],
      parentTimetable: [],
      teacherHabits: [],
      parentHabits: [],
      habitCompletions: {},
      lastEncouragement: null,
    }),

  getTimetableForMode: (mode) => {
    const m = mode ?? get().userMode;
    return m === "teacher" ? get().teacherTimetable : get().parentTimetable;
  },

  addTimetableEntry: (input) => {
    const mode = get().userMode;
    const entry: TimetableEntry = { ...input, id: crypto.randomUUID() };
    const list = [...get().getTimetableForMode(mode), entry];
    set(patchTimetable(mode, list));
    afterStoreMutation(get);
  },

  updateTimetableEntry: (id, input) => {
    const mode = get().userMode;
    const list = get()
      .getTimetableForMode(mode)
      .map((e) => (e.id === id ? { ...input, id } : e));
    set(patchTimetable(mode, list));
    afterStoreMutation(get);
  },

  deleteTimetableEntry: (id) => {
    const mode = get().userMode;
    const list = get().getTimetableForMode(mode).filter((e) => e.id !== id);
    set(patchTimetable(mode, list));
    afterStoreMutation(get);
  },

  getHabitsForMode: (mode) => {
    const m = mode ?? get().userMode;
    return m === "teacher" ? get().teacherHabits : get().parentHabits;
  },

  addHabit: (input) => {
    const mode = get().userMode;
    const habit: Habit = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    const list = [...get().getHabitsForMode(mode), habit];
    set(patchHabits(mode, list));
    afterStoreMutation(get);
  },

  updateHabit: (id, input) => {
    const mode = get().userMode;
    const list = get()
      .getHabitsForMode(mode)
      .map((h) => (h.id === id ? { ...input, id, createdAt: h.createdAt } : h));
    set(patchHabits(mode, list));
    afterStoreMutation(get);
  },

  deleteHabit: (id) => {
    const mode = get().userMode;
    const list = get().getHabitsForMode(mode).filter((h) => h.id !== id);
    const { [id]: _, ...restCompletions } = get().habitCompletions;
    set({ ...patchHabits(mode, list), habitCompletions: restCompletions });
    afterStoreMutation(get);
  },

  toggleHabitCompletion: (habitId, date) => {
    const dateStr = date ?? toDateString();
    const current = get().habitCompletions[habitId] ?? [];
    const exists = current.includes(dateStr);
    const next = exists
      ? current.filter((d) => d !== dateStr)
      : [...current, dateStr];
    set({
      habitCompletions: {
        ...get().habitCompletions,
        [habitId]: next,
      },
    });
    afterStoreMutation(get);
  },

  setUserMode: (mode) => {
    set({ userMode: mode });
    if (get().isGuestMode) {
      afterStoreMutation(get);
      return;
    }
    void persistProfile(get).catch((err) => {
      console.error(err);
      set({
        syncError: err instanceof Error ? err.message : "저장에 실패했습니다.",
      });
    });
  },

  getCategories: (mode) => {
    const m = mode ?? get().userMode;
    return get().categories[m];
  },

  addCategory: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const mode = get().userMode;
    const list = get().categories[mode];
    if (list.includes(trimmed)) return;
    set({
      categories: {
        ...get().categories,
        [mode]: [...list, trimmed],
      },
    });
    afterStoreMutation(get);
  },

  updateCategory: (oldName, newName) => {
    const trimmed = newName.trim();
    if (!trimmed || oldName === trimmed) return;
    const mode = get().userMode;
    const list = get().categories[mode];
    if (!list.includes(oldName) || list.includes(trimmed)) return;
    const changedTasks = get()
      .tasks.filter((t) => t.category === oldName)
      .map((t) => ({ ...t, category: trimmed }));
    const updatedTasks = get().tasks.map((t) =>
      t.category === oldName ? { ...t, category: trimmed } : t,
    );
    set({
      categories: {
        ...get().categories,
        [mode]: list.map((c) => (c === oldName ? trimmed : c)),
      },
      tasks: updatedTasks,
    });
    afterStoreMutation(get);
    const userId = get().userId;
    if (userId) {
      changedTasks.forEach((t) => void updateTaskRow(userId, t).catch(console.error));
    }
  },

  deleteCategory: (name) => {
    const mode = get().userMode;
    const list = get().categories[mode];
    if (list.length <= 1 || !list.includes(name)) return;
    const fallback = list.find((c) => c !== name)!;
    const tasksToSync = get().tasks.filter((t) => t.category === name);
    const updatedTasks = get().tasks.map((t) =>
      t.category === name ? { ...t, category: fallback } : t,
    );
    set({
      categories: {
        ...get().categories,
        [mode]: list.filter((c) => c !== name),
      },
      tasks: updatedTasks,
    });
    afterStoreMutation(get);
    const userId = get().userId;
    if (userId) {
      tasksToSync
        .map((t) => ({ ...t, category: fallback }))
        .forEach((t) => void updateTaskRow(userId, t).catch(console.error));
    }
  },

  addTask: ({ title, priority, category, dueDate }) => {
    const userId = get().userId;
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      priority,
      category,
      dueDate: dueDate || undefined,
      createdAt: new Date().toISOString(),
    };
    set({ tasks: [...get().tasks, task] });
    if (get().isGuestMode) {
      afterStoreMutation(get);
    } else if (userId) {
      void insertTask(userId, task).catch((err) => {
        console.error(err);
        set({
          tasks: get().tasks.filter((t) => t.id !== task.id),
          syncError: err instanceof Error ? err.message : "저장에 실패했습니다.",
        });
      });
    }
  },

  updateTask: (id, { title, priority, category, dueDate }) => {
    const userId = get().userId;
    const updated = get().tasks.map((task) =>
      task.id === id
        ? {
            ...task,
            title: title.trim(),
            priority,
            category,
            dueDate: dueDate || undefined,
          }
        : task,
    );
    set({ tasks: updated });
    const task = updated.find((t) => t.id === id);
    if (get().isGuestMode) {
      afterStoreMutation(get);
    } else if (userId && task) {
      void updateTaskRow(userId, task).catch((err) => {
        console.error(err);
        set({ syncError: err instanceof Error ? err.message : "저장에 실패했습니다." });
      });
    }
  },

  toggleTask: (id) => {
    const userId = get().userId;
    const tasks = get().tasks.map((task) => {
      if (task.id !== id) return task;
      return { ...task, completed: !task.completed };
    });
    const toggled = tasks.find((t) => t.id === id);
    const wasIncomplete = get().tasks.find((t) => t.id === id)?.completed === false;
    set({
      tasks,
      lastEncouragement:
        toggled?.completed && wasIncomplete ? randomMessage() : get().lastEncouragement,
    });
    if (get().isGuestMode) {
      afterStoreMutation(get);
    } else if (userId && toggled) {
      void updateTaskRow(userId, toggled).catch(console.error);
    }
  },

  deleteTask: (id) => {
    const userId = get().userId;
    const { todayOrder, upcomingOrder } = get();
    const prevTasks = get().tasks;
    set({
      tasks: prevTasks.filter((task) => task.id !== id),
      ...removeIdFromOrders(id, todayOrder, upcomingOrder),
    });
    if (get().isGuestMode) {
      afterStoreMutation(get);
    } else if (userId) {
      void deleteTaskRow(userId, id).catch((err) => {
        console.error(err);
        set({ tasks: prevTasks, syncError: err instanceof Error ? err.message : "삭제에 실패했습니다." });
      });
      void persistProfile(get).catch(console.error);
    }
  },

  reorderList: (list, orderedIds) => {
    set(
      list === "today"
        ? { todayOrder: orderedIds }
        : { upcomingOrder: orderedIds },
    );
    afterStoreMutation(get);
  },

  clearEncouragement: () => set({ lastEncouragement: null }),
}));

export function getTodayTasks(tasks: Task[]): Task[] {
  const today = toDateString();
  return tasks.filter(
    (t) => !t.completed && (t.dueDate === today || !t.dueDate),
  );
}

export function getDueTodayTasks(tasks: Task[]): Task[] {
  const today = toDateString();
  return tasks.filter((t) => t.dueDate === today);
}

export function getUpcomingTasks(tasks: Task[]): Task[] {
  const today = toDateString();
  return tasks.filter((t) => !t.completed && t.dueDate && t.dueDate > today);
}

export function getCompletedTasks(tasks: Task[]): Task[] {
  return tasks.filter((t) => t.completed);
}
