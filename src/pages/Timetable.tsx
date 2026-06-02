import { useState } from "react";
import { TimetableEditor } from "../components/TimetableEditor";
import { TimetableList } from "../components/TimetableList";
import { getTimetableMeta } from "../data/timetable";
import { useTaskStore } from "../store/useTaskStore";
import type { TimetableEntry } from "../types/timetable";

export function Timetable() {
  const userMode = useTaskStore((s) => s.userMode);
  const entries = useTaskStore((s) =>
    s.userMode === "teacher" ? s.teacherTimetable : s.parentTimetable,
  );
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  const meta = getTimetableMeta(userMode);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <span>{meta.pageIcon}</span>
          {meta.pageTitle}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {userMode === "teacher"
            ? "교사 모드 · 학교 수업 일정을 관리합니다"
            : "부모 모드 · 자녀의 학교·학원 일정을 관리합니다"}
        </p>
      </div>

      <TimetableEditor
        titleLabel={meta.titleLabel}
        titlePlaceholder={meta.titlePlaceholder}
        noteLabel={meta.noteLabel}
        notePlaceholder={meta.notePlaceholder}
        editingEntry={editingEntry}
        onClearEdit={() => setEditingEntry(null)}
      />

      <TimetableList
        entries={entries}
        emptyMessage={meta.emptyMessage}
        onEdit={setEditingEntry}
      />
    </div>
  );
}
