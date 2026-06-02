import type { Task } from "../types/task";
import { TaskItem } from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  emptyMessage: string;
}

export function TaskList({ tasks, emptyMessage }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500 py-8 rounded-xl bg-cream/50 border border-dashed border-primary/15">
        {emptyMessage}
      </p>
    );
  }

  return (
    <ul className="space-y-2" role="list">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
