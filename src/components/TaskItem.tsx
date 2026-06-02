import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import type { Task } from "../types/task";
import { formatDueDate } from "../utils/date";
import { PRIORITY_LABELS } from "../utils/priority";
import { TaskEditModal } from "./TaskEditModal";

const priorityBadge: Record<Task["priority"], string> = {
  high: "bg-red-50 text-danger border-danger/30",
  medium: "bg-amber-50 text-amber-800 border-secondary/50",
  low: "bg-primary/5 text-primary/80 border-primary/20",
};

interface TaskItemProps {
  task: Task;
  editable?: boolean;
  draggable?: boolean;
  isDragging?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
}

export function TaskItem({
  task,
  editable = false,
  draggable = false,
  isDragging = false,
  onDragStart,
  onDragEnd,
}: TaskItemProps) {
  const toggleTask = useTaskStore((s) => s.toggleTask);
  const deleteTask = useTaskStore((s) => s.deleteTask);
  const [editing, setEditing] = useState(false);

  return (
    <>
      <li
        draggable={draggable}
        onDragStart={(e) => {
          if (!draggable) return;
          e.dataTransfer.effectAllowed = "move";
          onDragStart?.();
        }}
        onDragEnd={onDragEnd}
        className={`group flex items-start gap-3 rounded-xl border px-4 py-3 transition-colors ${
          isDragging ? "opacity-50 border-primary/40" : ""
        } ${
          task.completed
            ? "border-gray-200 bg-gray-50/80"
            : "border-primary/10 bg-white hover:border-primary/25"
        }`}
      >
        {draggable && (
          <span
            className="mt-1 shrink-0 cursor-grab active:cursor-grabbing text-gray-400 select-none text-sm"
            aria-hidden
            title="드래그하여 순서 변경"
          >
            ⠿
          </span>
        )}
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
          className="mt-1 h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary/40 cursor-pointer"
          aria-label={`${task.title} 완료`}
        />
        <div className="flex-1 min-w-0">
          <p
            className={`text-sm font-medium ${
              task.completed ? "line-through text-gray-400" : "text-gray-800"
            }`}
          >
            {task.title}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-xs">
            <span
              className={`rounded-md border px-2 py-0.5 font-semibold ${priorityBadge[task.priority]}`}
            >
              {PRIORITY_LABELS[task.priority]}
            </span>
            <span className="text-primary/70 bg-cream/80 px-2 py-0.5 rounded-md">
              {task.category}
            </span>
            {task.dueDate && (
              <span className="text-gray-500">{formatDueDate(task.dueDate)}</span>
            )}
          </div>
        </div>
        <div className="flex shrink-0 flex-col gap-0.5">
          {editable && (
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="p-1.5 text-gray-400 hover:text-primary transition-colors opacity-70 group-hover:opacity-100"
              aria-label={`${task.title} 수정`}
              title="수정"
            >
              ✏️
            </button>
          )}
          <button
            type="button"
            onClick={() => deleteTask(task.id)}
            className="p-1.5 text-gray-400 hover:text-danger transition-colors opacity-70 group-hover:opacity-100"
            aria-label={`${task.title} 삭제`}
            title="삭제"
          >
            🗑️
          </button>
        </div>
      </li>
      {editing && <TaskEditModal task={task} onClose={() => setEditing(false)} />}
    </>
  );
}
