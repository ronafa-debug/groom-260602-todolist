import { useEffect, useState, type FormEvent } from "react";
import { WEEKDAYS } from "../data/timetable";
import { useTaskStore } from "../store/useTaskStore";
import type { TimetableEntry } from "../types/timetable";

interface TimetableEditorProps {
  titleLabel: string;
  titlePlaceholder: string;
  noteLabel: string;
  notePlaceholder: string;
  editingEntry: TimetableEntry | null;
  onClearEdit: () => void;
}

const emptyForm = {
  dayOfWeek: 0,
  startTime: "09:00",
  endTime: "09:45",
  title: "",
  note: "",
};

export function TimetableEditor({
  titleLabel,
  titlePlaceholder,
  noteLabel,
  notePlaceholder,
  editingEntry,
  onClearEdit,
}: TimetableEditorProps) {
  const addTimetableEntry = useTaskStore((s) => s.addTimetableEntry);
  const updateTimetableEntry = useTaskStore((s) => s.updateTimetableEntry);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (editingEntry) {
      setForm({
        dayOfWeek: editingEntry.dayOfWeek,
        startTime: editingEntry.startTime,
        endTime: editingEntry.endTime,
        title: editingEntry.title,
        note: editingEntry.note ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editingEntry]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;

    const payload = {
      dayOfWeek: form.dayOfWeek,
      startTime: form.startTime,
      endTime: form.endTime,
      title: form.title.trim(),
      note: form.note.trim() || undefined,
    };

    if (editingEntry) {
      updateTimetableEntry(editingEntry.id, payload);
      onClearEdit();
    } else {
      addTimetableEntry(payload);
      setForm(emptyForm);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl bg-white/90 border border-primary/10 p-4 shadow-sm space-y-3"
    >
      <h3 className="text-sm font-bold text-primary">
        {editingEntry ? "시간표 수정" : "시간표 추가"}
      </h3>

      <label className="flex flex-col gap-1 text-xs text-gray-600">
        요일
        <select
          value={form.dayOfWeek}
          onChange={(e) => setForm((f) => ({ ...f, dayOfWeek: Number(e.target.value) }))}
          className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
        >
          {WEEKDAYS.map((day, index) => (
            <option key={day} value={index}>
              {day}요일
            </option>
          ))}
        </select>
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1 text-xs text-gray-600">
          시작
          <input
            type="time"
            value={form.startTime}
            onChange={(e) => setForm((f) => ({ ...f, startTime: e.target.value }))}
            className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-gray-600">
          종료
          <input
            type="time"
            value={form.endTime}
            onChange={(e) => setForm((f) => ({ ...f, endTime: e.target.value }))}
            className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
            required
          />
        </label>
      </div>

      <label className="flex flex-col gap-1 text-xs text-gray-600">
        {titleLabel}
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
          placeholder={titlePlaceholder}
          className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
          required
        />
      </label>

      <label className="flex flex-col gap-1 text-xs text-gray-600">
        {noteLabel}
        <input
          type="text"
          value={form.note}
          onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
          placeholder={notePlaceholder}
          className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
        />
      </label>

      <div className="flex gap-2">
        {editingEntry && (
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
          {editingEntry ? "저장" : "추가"}
        </button>
      </div>
    </form>
  );
}
