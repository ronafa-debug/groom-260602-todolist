import { useMemo } from "react";
import { useTaskStore } from "../store/useTaskStore";
import type { Task } from "../types/task";
import { applyListOrder } from "../utils/priority";

export type OrderListKey = "today" | "upcoming";

function sortUpcomingByDateThenOrder(tasks: Task[], order: string[]): Task[] {
  const dates = [...new Set(tasks.map((t) => t.dueDate).filter(Boolean))].sort();
  return dates.flatMap((date) =>
    applyListOrder(
      tasks.filter((t) => t.dueDate === date),
      order,
    ),
  );
}

export function useOrderedTasks(listKey: OrderListKey, tasks: Task[]) {
  const todayOrder = useTaskStore((s) => s.todayOrder);
  const upcomingOrder = useTaskStore((s) => s.upcomingOrder);
  const order = listKey === "today" ? todayOrder : upcomingOrder;

  return useMemo(() => {
    if (listKey === "upcoming") {
      return sortUpcomingByDateThenOrder(tasks, order);
    }
    return applyListOrder(tasks, order);
  }, [tasks, order, listKey]);
}
