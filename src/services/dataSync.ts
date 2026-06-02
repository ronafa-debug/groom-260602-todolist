import { DEFAULT_CATEGORIES } from "../data/categories";
import { apiFetch } from "../lib/api";
import type { CategoryMap, OrderListKey } from "../store/useTaskStore";
import type { Habit, HabitCompletions } from "../types/habit";
import { getHabitWeekCount } from "../utils/habit";
import type { TimetableEntry } from "../types/timetable";
import type { Priority, Task, UserMode } from "../types/task";

interface DataResponse {
  profile: {
    user_mode: UserMode;
    categories: CategoryMap;
    today_order: string[];
    upcoming_order: string[];
    teacher_timetable: TimetableEntry[];
    parent_timetable: TimetableEntry[];
    teacher_habits: Habit[];
    parent_habits: Habit[];
    habit_completions: HabitCompletions;
  };
  tasks: Array<{
    id: string;
    title: string;
    completed: boolean;
    priority: Priority;
    category: string;
    due_date: string | null;
    created_at: string;
  }>;
}

function rowToTask(row: DataResponse["tasks"][number]): Task {
  return {
    id: row.id,
    title: row.title,
    completed: row.completed,
    priority: row.priority,
    category: row.category,
    dueDate: row.due_date ?? undefined,
    createdAt: row.created_at,
  };
}

function normalizeHabit(habit: Habit): Habit {
  return { ...habit, weekCount: getHabitWeekCount(habit) };
}

function taskPayload(task: Task) {
  return {
    id: task.id,
    title: task.title,
    completed: task.completed,
    priority: task.priority,
    category: task.category,
    due_date: task.dueDate ?? null,
    created_at: task.createdAt,
  };
}

export async function loadUserData(_userId: string): Promise<{
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
}> {
  const data = await apiFetch<DataResponse>("/api/data");

  return {
    tasks: data.tasks.map(rowToTask),
    userMode: data.profile.user_mode ?? "teacher",
    categories: data.profile.categories ?? {
      teacher: [...DEFAULT_CATEGORIES.teacher],
      parent: [...DEFAULT_CATEGORIES.parent],
    },
    todayOrder: data.profile.today_order ?? [],
    upcomingOrder: data.profile.upcoming_order ?? [],
    teacherTimetable: data.profile.teacher_timetable ?? [],
    parentTimetable: data.profile.parent_timetable ?? [],
    teacherHabits: (data.profile.teacher_habits ?? []).map(normalizeHabit),
    parentHabits: (data.profile.parent_habits ?? []).map(normalizeHabit),
    habitCompletions: data.profile.habit_completions ?? {},
  };
}

export async function saveProfile(
  _userId: string,
  snapshot: {
    userMode: UserMode;
    categories: CategoryMap;
    todayOrder: string[];
    upcomingOrder: string[];
    teacherTimetable: TimetableEntry[];
    parentTimetable: TimetableEntry[];
    teacherHabits: Habit[];
    parentHabits: Habit[];
    habitCompletions: HabitCompletions;
  },
): Promise<void> {
  await apiFetch("/api/data/profile", {
    method: "PUT",
    body: JSON.stringify({
      user_mode: snapshot.userMode,
      categories: snapshot.categories,
      today_order: snapshot.todayOrder,
      upcoming_order: snapshot.upcomingOrder,
      teacher_timetable: snapshot.teacherTimetable,
      parent_timetable: snapshot.parentTimetable,
      teacher_habits: snapshot.teacherHabits,
      parent_habits: snapshot.parentHabits,
      habit_completions: snapshot.habitCompletions,
    }),
  });
}

export async function insertTask(_userId: string, task: Task): Promise<void> {
  await apiFetch("/api/data/tasks", {
    method: "POST",
    body: JSON.stringify(taskPayload(task)),
  });
}

export async function updateTaskRow(_userId: string, task: Task): Promise<void> {
  await apiFetch(`/api/data/tasks/${task.id}`, {
    method: "PUT",
    body: JSON.stringify(taskPayload(task)),
  });
}

export async function deleteTaskRow(_userId: string, taskId: string): Promise<void> {
  await apiFetch(`/api/data/tasks/${taskId}`, { method: "DELETE" });
}

export async function uploadLocalSnapshot(
  _userId: string,
  snapshot: {
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
  },
): Promise<void> {
  await apiFetch("/api/data/import", {
    method: "POST",
    body: JSON.stringify({
      profile: {
        user_mode: snapshot.userMode,
        categories: snapshot.categories,
        today_order: snapshot.todayOrder,
        upcoming_order: snapshot.upcomingOrder,
        teacher_timetable: snapshot.teacherTimetable,
        parent_timetable: snapshot.parentTimetable,
        teacher_habits: snapshot.teacherHabits,
        parent_habits: snapshot.parentHabits,
        habit_completions: snapshot.habitCompletions,
      },
      tasks: snapshot.tasks.map(taskPayload),
    }),
  });
}

export type { OrderListKey };
