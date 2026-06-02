import { WEEKDAYS, sortTimetableEntries } from "../data/timetable";
import { useTaskStore } from "../store/useTaskStore";
import type { TimetableEntry } from "../types/timetable";

interface TimetableListProps {
  entries: TimetableEntry[];
  emptyMessage: string;
  onEdit: (entry: TimetableEntry) => void;
}

export function TimetableList({ entries, emptyMessage, onEdit }: TimetableListProps) {
  const deleteTimetableEntry = useTaskStore((s) => s.deleteTimetableEntry);
  const sorted = sortTimetableEntries(entries);

  if (sorted.length === 0) {
    return (
      <p className="text-center text-sm text-gray-500 py-8 rounded-xl bg-cream/50 border border-dashed border-primary/15">
        {emptyMessage}
      </p>
    );
  }

  const byDay = WEEKDAYS.map((_, dayIndex) =>
    sorted.filter((e) => e.dayOfWeek === dayIndex),
  );

  return (
    <div className="space-y-4">
      {WEEKDAYS.map((day, dayIndex) => {
        const dayEntries = byDay[dayIndex];
        if (dayEntries.length === 0) return null;

        return (
          <section key={day}>
            <h3 className="text-sm font-semibold text-primary mb-2 flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-primary/10 flex items-center justify-center text-xs">
                {day}
              </span>
              {day}요일
            </h3>
            <ul className="space-y-2">
              {dayEntries.map((entry) => (
                <li
                  key={entry.id}
                  className="rounded-xl border border-primary/10 bg-white px-4 py-3 flex items-start gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{entry.title}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {entry.startTime} – {entry.endTime}
                      {entry.note ? ` · ${entry.note}` : ""}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      type="button"
                      onClick={() => onEdit(entry)}
                      className="text-xs text-primary/80 hover:text-primary px-2 py-1"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteTimetableEntry(entry.id)}
                      className="text-xs text-danger/80 hover:text-danger px-2 py-1"
                    >
                      삭제
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
