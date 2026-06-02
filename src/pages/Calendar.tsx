import { CalendarGrid } from "../components/CalendarGrid";

export function Calendar() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-primary flex items-center gap-2">
        <span>📅</span> 캘린더
      </h2>
      <p className="text-xs text-gray-500">
        마감일이 있는 일정이 날짜별로 표시됩니다 (최대 3개, 더 있으면 +숫자)
      </p>
      <CalendarGrid />
    </div>
  );
}
