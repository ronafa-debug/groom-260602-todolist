import { Fragment, useState } from "react";
import { useTaskStore, type OrderListKey } from "../store/useTaskStore";
import type { Task } from "../types/task";
import { formatDueDate } from "../utils/date";
import { TaskItem } from "./TaskItem";

interface SortableTaskListProps {
  tasks: Task[];
  listKey: OrderListKey;
  emptyMessage: string;
  editable?: boolean;
  groupByDate?: boolean;
}

export function SortableTaskList({
  tasks,
  listKey,
  emptyMessage,
  editable = false,
  groupByDate = false,
}: SortableTaskListProps) {
  const reorderList = useTaskStore((s) => s.reorderList);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [overIndex, setOverIndex] = useState<number | null>(null);

  if (tasks.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500 py-8 rounded-xl bg-cream/50 border border-dashed border-primary/15">
        {emptyMessage}
      </p>
    );
  }

  const moveItem = (from: number, to: number) => {
    if (from === to) return;
    const next = [...tasks];
    const [removed] = next.splice(from, 1);
    next.splice(to, 0, removed);
    reorderList(listKey, next.map((t) => t.id));
  };

  const handleDrop = (index: number) => {
    if (dragIndex === null) return;
    moveItem(dragIndex, index);
    setDragIndex(null);
    setOverIndex(null);
  };

  const showDateHeader = (task: Task, index: number) => {
    if (!groupByDate || !task.dueDate) return false;
    const prev = tasks[index - 1];
    return !prev || prev.dueDate !== task.dueDate;
  };

  return (
    <div>
      <p className="text-[11px] text-gray-400 mb-2">
        ⠿ 핸들을 드래그해 순서를 바꿀 수 있어요
        {editable && " · ✏️ 로 일정을 수정할 수 있어요"}
      </p>
      <ul className="space-y-2" role="list" aria-label="일정 목록">
        {tasks.map((task, index) => (
          <Fragment key={task.id}>
            {showDateHeader(task, index) && (
              <li className="list-none pt-2 first:pt-0" aria-hidden>
                {index > 0 && <hr className="border-primary/20 my-4" />}
                <p className="text-sm font-semibold text-primary pb-2">
                  {formatDueDate(task.dueDate)}
                </p>
              </li>
            )}
            <li className="list-none">
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setOverIndex(index);
                }}
                onDragLeave={() => setOverIndex(null)}
                onDrop={(e) => {
                  e.preventDefault();
                  handleDrop(index);
                }}
                className={
                  overIndex === index && dragIndex !== null
                    ? "ring-2 ring-primary/30 rounded-xl"
                    : ""
                }
              >
                <TaskItem
                  task={task}
                  editable={editable}
                  draggable
                  isDragging={dragIndex === index}
                  onDragStart={() => setDragIndex(index)}
                  onDragEnd={() => {
                    setDragIndex(null);
                    setOverIndex(null);
                  }}
                />
              </div>
            </li>
          </Fragment>
        ))}
      </ul>
    </div>
  );
}
