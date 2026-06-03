import { TimetableGrid } from "../components/TimetableGrid";
import { getTimetableMeta } from "../data/timetable";
import { useTaskStore } from "../store/useTaskStore";

export function Timetable() {
  const userMode = useTaskStore((s) => s.userMode);
  const entries = useTaskStore((s) =>
    s.userMode === "teacher" ? s.teacherTimetable : s.parentTimetable,
  );

  const meta = getTimetableMeta(userMode);

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-primary flex items-center gap-2">
          <span>{meta.pageIcon}</span>
          {meta.pageTitle}
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          {userMode === "teacher"
            ? "교사 모드 · 칸을 눌러 수업 시간표를 입력합니다"
            : "부모 모드 · 칸을 눌러 자녀 시간표를 입력합니다"}
        </p>
      </div>

      <TimetableGrid
        entries={entries}
        titleLabel={meta.titleLabel}
        titlePlaceholder={meta.titlePlaceholder}
        noteLabel={meta.noteLabel}
        notePlaceholder={meta.notePlaceholder}
      />
    </div>
  );
}
