import { useMemo } from "react";
import {
  getCompletedTasks,
  getDueTodayTasks,
  getTodayTasks,
  getUpcomingTasks,
  useTaskStore,
} from "../store/useTaskStore";

export function useTaskFilters() {
  const tasks = useTaskStore((s) => s.tasks);

  return useMemo(
    () => ({
      todayFocus: getTodayTasks(tasks),
      dueToday: getDueTodayTasks(tasks),
      upcoming: getUpcomingTasks(tasks),
      completed: getCompletedTasks(tasks),
      all: tasks,
    }),
    [tasks],
  );
}
