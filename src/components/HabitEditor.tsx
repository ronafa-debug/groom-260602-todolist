import { useEffect, useState, type FormEvent } from "react";
import { HABIT_COLORS, HABIT_WEEK_OPTIONS } from "../data/habits";
import { useTaskStore } from "../store/useTaskStore";
import type { Habit, HabitFrequency } from "../types/habit";
import { DEFAULT_HABIT_WEEKS } from "../utils/habit";

interface HabitEditorProps {
  namePlaceholder: string;
  descriptionPlaceholder: string;
  editingHabit: Habit | null;
  onClearEdit: () => void;
  onSuccess?: () => void;
  embedded?: boolean;
}

const emptyForm: {
  name: string;
  description: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  weekCount: number;
} = {
  name: "",
  description: "",
  icon: "✅",
  color: HABIT_COLORS[0],
  frequency: "daily",
  weekCount: DEFAULT_HABIT_WEEKS,
};

export function HabitEditor({
  namePlaceholder,
  descriptionPlaceholder,
  editingHabit,
  onClearEdit,
  onSuccess,
  embedded = false,
}: HabitEditorProps) {
  const addHabit = useTaskStore((s) => s.addHabit);
  const updateHabit = useTaskStore((s) => s.updateHabit);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingHabit) {
      setForm({
        name: editingHabit.name,
        description: editingHabit.description ?? "",
        icon: editingHabit.icon,
        color: editingHabit.color,
        frequency: editingHabit.frequency,
        weekCount: editingHabit.weekCount ?? DEFAULT_HABIT_WEEKS,
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingHabit]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      description: form.description.trim() || undefined,
      icon: form.icon.trim() || "✅",
      color: form.color,
      frequency: form.frequency,
      weekCount: form.weekCount,
    };

    if (editingHabit) {
      updateHabit(editingHabit.id, payload);
      onSuccess?.();
      onClearEdit();
    } else {
      addHabit(payload);
      setForm(emptyForm);
      onSuccess?.();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={
        embedded
          ? "space-y-3"
          : "rounded-2xl bg-white/90 border border-primary/10 p-4 shadow-sm space-y-3"
      }
    >

      <div className="grid grid-cols-[4rem_1fr] gap-2">
        <label className="flex flex-col gap-1 text-xs text-gray-600">
          아이콘
          <input
            type="text"
            value={form.icon}
            onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))}
            className="rounded-lg border border-primary/20 bg-background px-2 py-2 text-center text-lg"
            maxLength={4}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-600">
          이름
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder={namePlaceholder}
            className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
            required
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs text-gray-600">
        설명 (선택)
        <input
          type="text"
          value={form.description}
          onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
          placeholder={descriptionPlaceholder}
          className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
        />
      </label>

      <div>
        <p className="text-xs text-gray-600 mb-2">색상</p>
        <div className="flex flex-wrap gap-2">
          {HABIT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setForm((f) => ({ ...f, color }))}
              className={`w-8 h-8 rounded-lg border-2 transition-transform ${
                form.color === color ? "border-gray-800 scale-110" : "border-transparent"
              }`}
              style={{ backgroundColor: color }}
              aria-label={`색상 ${color}`}
            />
          ))}
        </div>
      </div>

      <fieldset className="space-y-2">
        <legend className="text-xs text-gray-600">빈도</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="frequency"
            checked={form.frequency === "daily"}
            onChange={() => setForm((f) => ({ ...f, frequency: "daily" }))}
          />
          매일
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="radio"
            name="frequency"
            checked={form.frequency === "weekdays"}
            onChange={() => setForm((f) => ({ ...f, frequency: "weekdays" }))}
          />
          평일만 (월–금)
        </label>
      </fieldset>

      <label className="flex flex-col gap-1 text-xs text-gray-600">
        주수
        <select
          value={form.weekCount}
          onChange={(e) =>
            setForm((f) => ({ ...f, weekCount: Number(e.target.value) }))
          }
          className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
        >
          {HABIT_WEEK_OPTIONS.map((w) => (
            <option key={w} value={w}>
              {w}주
            </option>
          ))}
        </select>
      </label>

      <div className="flex gap-2">
        {editingHabit && (
          <button
            type="button"
            onClick={onClearEdit}
            className="flex-1 rounded-xl border border-primary/20 py-2.5 text-sm text-gray-600"
          >
            취소
          </button>
        )}
        <button
          type="submit"
          className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          {editingHabit ? "저장" : "추가"}
        </button>
      </div>
    </form>
  );
}
