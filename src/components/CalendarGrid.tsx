import { useMemo, useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import type { Task } from "../types/task";
import {
  CALENDAR_TASK_PREVIEW_LIMIT,
  getCalendarCells,
  getMonthLabel,
  getWeekdayLabels,
} from "../utils/calendar";
import { toDateString } from "../utils/date";

function groupTasksByDueDate(tasks: Task[]): Map<string, Task[]> {
  const map = new Map<string, Task[]>();
  for (const task of tasks) {
    if (!task.dueDate) continue;
    const list = map.get(task.dueDate) ?? [];
    list.push(task);
    map.set(task.dueDate, list);
  }
  return map;
}

export function CalendarGrid() {
  const tasks = useTaskStore((s) => s.tasks);
  const today = toDateString();
  const now = new Date();

  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());

  const cells = useMemo(
    () => getCalendarCells(viewYear, viewMonth),
    [viewYear, viewMonth],
  );
  const tasksByDate = useMemo(() => groupTasksByDueDate(tasks), [tasks]);

  const goPrevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const goNextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const goToday = () => {
    setViewYear(now.getFullYear());
    setViewMonth(now.getMonth());
  };

  return (
    <div className="rounded-2xl bg-white/90 border border-primary/10 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-primary/10 bg-cream/40">
        <button
          type="button"
          onClick={goPrevMonth}
          className="w-8 h-8 rounded-lg text-primary hover:bg-white/80 text-sm font-bold"
          aria-label="이전 달"
        >
          ‹
        </button>
        <div className="text-center">
          <h2 className="text-base font-bold text-primary">
            {getMonthLabel(viewYear, viewMonth)}
          </h2>
          <button
            type="button"
            onClick={goToday}
            className="text-[10px] text-primary/70 hover:text-primary mt-0.5"
          >
            오늘로 이동
          </button>
        </div>
        <button
          type="button"
          onClick={goNextMonth}
          className="w-8 h-8 rounded-lg text-primary hover:bg-white/80 text-sm font-bold"
          aria-label="다음 달"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 border-b border-primary/10 bg-primary/5">
        {getWeekdayLabels().map((label, i) => (
          <div
            key={label}
            className={`py-2 text-center text-[10px] font-semibold ${
              i === 0 ? "text-danger/80" : i === 6 ? "text-primary/70" : "text-gray-600"
            }`}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 divide-x divide-y divide-primary/10">
        {cells.map((cell) => {
          const dayTasks = tasksByDate.get(cell.dateStr) ?? [];
          const preview = dayTasks.slice(0, CALENDAR_TASK_PREVIEW_LIMIT);
          const extra = dayTasks.length - CALENDAR_TASK_PREVIEW_LIMIT;
          const isToday = cell.dateStr === today;

          return (
            <div
              key={cell.dateStr}
              className={`min-h-[6.25rem] p-1 flex flex-col ${
                cell.isCurrentMonth ? "bg-white" : "bg-gray-50/80"
              } ${isToday ? "ring-2 ring-inset ring-secondary/60 bg-secondary/5" : ""}`}
            >
              <span
                className={`text-[11px] font-semibold leading-none mb-0.5 ${
                  cell.isCurrentMonth
                    ? isToday
                      ? "text-primary"
                      : "text-gray-700"
                    : "text-gray-300"
                }`}
              >
                {cell.date.getDate()}
              </span>
              <div className="flex-1 space-y-0.5 overflow-hidden">
                {preview.map((task) => (
                  <p
                    key={task.id}
                    title={task.title}
                    className={`text-[9px] leading-tight px-0.5 py-0.5 rounded truncate ${
                      task.completed
                        ? "bg-gray-100 text-gray-400 line-through"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    {task.title}
                  </p>
                ))}
                {extra > 0 && (
                  <p className="text-[9px] text-gray-400 px-0.5 font-medium">+{extra}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
