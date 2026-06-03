import { useEffect, useState, type FormEvent } from "react";
import { getPeriodLabel } from "../data/timetable";
import type { PeriodTimeRange } from "../utils/timetableLayoutStorage";

interface TimetablePeriodTimeModalProps {
  open: boolean;
  period: number;
  timeRange: PeriodTimeRange | null;
  onClose: () => void;
  onSave: (range: PeriodTimeRange) => void;
  onClear: () => void;
}

export function TimetablePeriodTimeModal({
  open,
  period,
  timeRange,
  onClose,
  onSave,
  onClear,
}: TimetablePeriodTimeModalProps) {
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("09:40");

  useEffect(() => {
    if (open) {
      setStartTime(timeRange?.startTime ?? "09:00");
      setEndTime(timeRange?.endTime ?? "09:40");
    }
  }, [open, timeRange]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (startTime >= endTime) return;
    onSave({ startTime, endTime });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="timetable-period-time-title"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-background border border-primary/15 shadow-xl p-5 space-y-4"
      >
        <h2 id="timetable-period-time-title" className="text-base font-bold text-primary">
          {getPeriodLabel(period)} · 수업 시간
        </h2>

        <div className="grid grid-cols-2 gap-2">
          <label className="flex flex-col gap-1 text-xs text-gray-600">
            시작
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-600">
            종료
            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
              required
            />
          </label>
        </div>

        <div className="flex gap-2">
          {timeRange && (
            <button
              type="button"
              onClick={onClear}
              className="rounded-xl border border-danger/30 px-4 py-2.5 text-sm text-danger hover:bg-danger/5"
            >
              시간 삭제
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
