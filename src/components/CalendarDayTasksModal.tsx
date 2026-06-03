import type { Task } from "../types/task";
import { formatDueDate } from "../utils/date";
import { PRIORITY_OPTIONS } from "../utils/priority";

interface CalendarDayTasksModalProps {
  open: boolean;
  dateStr: string;
  tasks: Task[];
  onClose: () => void;
}

const priorityLabel = Object.fromEntries(
  PRIORITY_OPTIONS.map((o) => [o.value, o.label]),
) as Record<Task["priority"], string>;

export function CalendarDayTasksModal({
  open,
  dateStr,
  tasks,
  onClose,
}: CalendarDayTasksModalProps) {
  if (!open) return null;

  const sorted = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    const order = { high: 0, medium: 1, low: 2 };
    return order[a.priority] - order[b.priority];
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="calendar-day-tasks-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[85vh] overflow-hidden flex flex-col rounded-2xl bg-background border border-primary/15 shadow-xl"
      >
        <div className="px-5 py-4 border-b border-primary/10 shrink-0">
          <h2 id="calendar-day-tasks-title" className="text-base font-bold text-primary">
            {formatDueDate(dateStr)}
          </h2>
          <p className="text-xs text-gray-500 mt-1">마감일 일정 {tasks.length}건</p>
        </div>

        <ul className="overflow-y-auto px-5 py-3 space-y-2 flex-1">
          {sorted.length === 0 ? (
            <li className="text-center text-sm text-gray-500 py-8">이 날짜에 등록된 일정이 없습니다.</li>
          ) : (
            sorted.map((task) => (
              <li
                key={task.id}
                className={`rounded-xl border px-4 py-3 ${
                  task.completed
                    ? "border-gray-200 bg-gray-50"
                    : "border-primary/15 bg-white"
                }`}
              >
                <p
                  className={`text-sm font-medium ${
                    task.completed ? "text-gray-400 line-through" : "text-gray-800"
                  }`}
                >
                  {task.title}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {task.category} · {priorityLabel[task.priority]}
                  {task.completed ? " · 완료" : ""}
                </p>
              </li>
            ))
          )}
        </ul>

        <div className="px-5 py-3 border-t border-primary/10 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
}
