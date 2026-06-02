import { useEffect, useState, type FormEvent } from "react";
import { CategorySelectField } from "./CategorySelectField";
import { useTaskStore } from "../store/useTaskStore";
import type { Priority, Task } from "../types/task";
import { PRIORITY_OPTIONS } from "../utils/priority";

const priorityStyles: Record<Priority, string> = {
  high: "border-danger text-danger",
  medium: "border-secondary text-amber-700",
  low: "border-primary/30 text-primary/70",
};

interface TaskEditModalProps {
  task: Task;
  onClose: () => void;
}

export function TaskEditModal({ task, onClose }: TaskEditModalProps) {
  const categories = useTaskStore((s) => s.categories[s.userMode]);
  const updateTask = useTaskStore((s) => s.updateTask);

  const [title, setTitle] = useState(task.title);
  const [priority, setPriority] = useState<Priority>(task.priority);
  const [category, setCategory] = useState(task.category);
  const [dueDate, setDueDate] = useState(task.dueDate ?? "");

  useEffect(() => {
    if (!categories.includes(category) && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [categories, category]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    updateTask(task.id, {
      title,
      priority,
      category,
      dueDate: dueDate || undefined,
    });
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-edit-title"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-background border border-primary/15 shadow-xl p-5 space-y-4"
      >
        <h2 id="task-edit-title" className="text-base font-bold text-primary">
          일정 수정
        </h2>

        <label className="flex flex-col gap-1 text-xs text-gray-600">
          제목
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm"
            required
          />
        </label>

        <fieldset>
          <legend className="text-xs font-semibold text-gray-600 mb-1.5">중요도</legend>
          <div className="flex flex-wrap gap-2">
            {PRIORITY_OPTIONS.map((p) => (
              <button
                key={p.value}
                type="button"
                onClick={() => setPriority(p.value)}
                className={`rounded-lg border px-3 py-1 text-xs font-semibold transition-colors ${
                  priority === p.value
                    ? `${priorityStyles[p.value]} bg-white shadow-sm`
                    : "border-gray-200 text-gray-500"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <CategorySelectField
            value={category}
            onChange={setCategory}
            categories={categories}
            selectClassName="bg-white"
          />
          <label className="flex flex-col gap-1 text-xs text-gray-600">
            마감일
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="rounded-lg border border-primary/20 bg-white px-3 py-2 text-sm"
            />
          </label>
        </div>

        <div className="flex gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-primary/20 py-2.5 text-sm text-gray-600 hover:bg-cream/50"
          >
            취소
          </button>
          <button
            type="submit"
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );
}
