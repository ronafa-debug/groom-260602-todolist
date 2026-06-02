import { useEffect, useState, type FormEvent } from "react";
import { CategorySelectField } from "./CategorySelectField";
import { useTaskStore } from "../store/useTaskStore";
import type { Priority } from "../types/task";
import { toDateString } from "../utils/date";
import { PRIORITY_OPTIONS } from "../utils/priority";

const priorityStyles: Record<Priority, string> = {
  high: "border-danger text-danger",
  medium: "border-secondary text-amber-700",
  low: "border-primary/30 text-primary/70",
};

export function TaskForm() {
  const userMode = useTaskStore((s) => s.userMode);
  const categories = useTaskStore((s) => s.categories[s.userMode]);
  const addTask = useTaskStore((s) => s.addTask);

  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [category, setCategory] = useState(categories[0] ?? "");
  const [dueDate, setDueDate] = useState(toDateString());

  useEffect(() => {
    if (!categories.includes(category) && categories.length > 0) {
      setCategory(categories[0]);
    }
  }, [userMode, categories, category]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !category) return;
    addTask({ title, priority, category, dueDate: dueDate || undefined });
    setTitle("");
    setPriority("medium");
    setCategory(categories[0] ?? "");
    setDueDate(toDateString());
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white/90 border border-primary/10 p-4 shadow-sm space-y-3"
    >
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="할 일을 입력하세요 ✏️"
          className="flex-1 rounded-xl border border-primary/20 bg-background px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          aria-label="할 일 제목"
        />
        <button
          type="submit"
          className="rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-dark transition-colors shrink-0"
        >
          추가
        </button>
      </div>

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
        />
        <label className="flex flex-col gap-1 text-xs text-gray-600">
          마감일
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
          />
        </label>
      </div>
    </form>
  );
}
