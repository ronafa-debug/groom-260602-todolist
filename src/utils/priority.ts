import type { Priority, Task } from "../types/task";

export const PRIORITY_LABELS: Record<Priority, string> = {
  high: "빨리",
  medium: "천천히",
  low: "나중에",
};

export const PRIORITY_OPTIONS: { value: Priority; label: string }[] = [
  { value: "high", label: "빨리" },
  { value: "medium", label: "천천히" },
  { value: "low", label: "나중에" },
];

const PRIORITY_RANK: Record<Priority, number> = {
  high: 0,
  medium: 1,
  low: 2,
};

export function sortByPriority(tasks: Task[]): Task[] {
  return [...tasks].sort(
    (a, b) => PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority],
  );
}

export function applyListOrder(tasks: Task[], order: string[]): Task[] {
  if (order.length === 0) return sortByPriority(tasks);

  const byId = new Map(tasks.map((t) => [t.id, t]));
  const ordered: Task[] = [];

  for (const id of order) {
    const task = byId.get(id);
    if (task) {
      ordered.push(task);
      byId.delete(id);
    }
  }

  return [...ordered, ...sortByPriority([...byId.values()])];
}
