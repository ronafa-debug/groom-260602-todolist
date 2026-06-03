import { useEffect, useState, type FormEvent } from "react";
import { getPeriodLabel, getWeekdayLabel } from "../data/timetable";
import type { TimetableEntry } from "../types/timetable";

interface TimetableCellModalProps {
  open: boolean;
  dayOfWeek: number;
  period: number;
  entry: TimetableEntry | null;
  titleLabel: string;
  titlePlaceholder: string;
  noteLabel: string;
  notePlaceholder: string;
  onClose: () => void;
  onSave: (data: { title: string; note?: string }) => void;
  onDelete: () => void;
}

export function TimetableCellModal({
  open,
  dayOfWeek,
  period,
  entry,
  titleLabel,
  titlePlaceholder,
  noteLabel,
  notePlaceholder,
  onClose,
  onSave,
  onDelete,
}: TimetableCellModalProps) {
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (open) {
      setTitle(entry?.title ?? "");
      setNote(entry?.note ?? "");
    }
  }, [open, entry]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({ title: title.trim(), note: note.trim() || undefined });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timetable-cell-title"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-background border border-primary/15 shadow-xl p-5 space-y-4"
      >
        <h2 id="timetable-cell-title" className="text-base font-bold text-primary">
          {getWeekdayLabel(dayOfWeek)}요일 · {getPeriodLabel(period)}
        </h2>

        <label className="flex flex-col gap-1 text-xs text-gray-600">
          {titleLabel}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={titlePlaceholder}
            className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
            autoFocus
            required
          />
        </label>

        <label className="flex flex-col gap-1 text-xs text-gray-600">
          {noteLabel}
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={notePlaceholder}
            className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
          />
        </label>

        <div className="flex gap-2">
          {entry && (
            <button
              type="button"
              onClick={onDelete}
              className="rounded-xl border border-danger/30 px-4 py-2.5 text-sm text-danger hover:bg-danger/5"
            >
              삭제
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-xl border border-primary/20 py-2.5 text-sm text-gray-600"
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
