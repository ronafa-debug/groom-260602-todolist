import { useEffect, useMemo, useState } from "react";
import {
  buildTimetableGridRows,
  buildTimetableSlotMap,
  formatPeriodTimeRange,
  getPeriodLabel,
  getTimetablePeriod,
  getVisibleWeekdayIndices,
  getWeekdayLabel,
  LUNCH_ROW_LABEL,
  MAX_TIMETABLE_PERIOD_COUNT,
  MIN_TIMETABLE_PERIOD_COUNT,
  SATURDAY_INDEX,
  SUNDAY_INDEX,
} from "../data/timetable";
import { useTaskStore } from "../store/useTaskStore";
import type { TimetableEntry } from "../types/timetable";
import {
  getTimetableLayoutPrefs,
  saveTimetableLayoutPrefs,
  type PeriodTimeRange,
  type TimetableLayoutPrefs,
} from "../utils/timetableLayoutStorage";
import { TimetableCellModal } from "./TimetableCellModal";
import { TimetablePeriodTimeModal } from "./TimetablePeriodTimeModal";

interface TimetableGridProps {
  entries: TimetableEntry[];
  titleLabel: string;
  titlePlaceholder: string;
  noteLabel: string;
  notePlaceholder: string;
}

interface CellSelection {
  dayOfWeek: number;
  period: number;
}

export function TimetableGrid({
  entries,
  titleLabel,
  titlePlaceholder,
  noteLabel,
  notePlaceholder,
}: TimetableGridProps) {
  const userMode = useTaskStore((s) => s.userMode);
  const upsertTimetableCell = useTaskStore((s) => s.upsertTimetableCell);
  const deleteTimetableEntry = useTaskStore((s) => s.deleteTimetableEntry);

  const [layout, setLayout] = useState<TimetableLayoutPrefs>(() =>
    getTimetableLayoutPrefs(userMode),
  );
  const [selection, setSelection] = useState<CellSelection | null>(null);
  const [periodTimeEdit, setPeriodTimeEdit] = useState<number | null>(null);

  useEffect(() => {
    setLayout(getTimetableLayoutPrefs(userMode));
  }, [userMode]);

  const persistLayout = (next: TimetableLayoutPrefs) => {
    setLayout(next);
    saveTimetableLayoutPrefs(userMode, next);
  };

  const { periodCount, showSaturday, showSunday, periodTimes } = layout;
  const visibleDays = useMemo(
    () => getVisibleWeekdayIndices(showSaturday, showSunday),
    [showSaturday, showSunday],
  );
  const gridRows = useMemo(() => buildTimetableGridRows(periodCount), [periodCount]);
  const slotMap = useMemo(() => buildTimetableSlotMap(entries), [entries]);

  const selectedEntry = useMemo(() => {
    if (!selection) return null;
    return slotMap.get(`${selection.dayOfWeek}-${selection.period}`) ?? null;
  }, [selection, slotMap]);

  const openCell = (dayOfWeek: number, period: number) => {
    setSelection({ dayOfWeek, period });
  };

  const closeModal = () => setSelection(null);

  const handleSave = (data: { title: string; note?: string }) => {
    if (!selection) return;
    upsertTimetableCell(selection.dayOfWeek, selection.period, data);
    closeModal();
  };

  const handleDelete = () => {
    if (!selectedEntry) return;
    deleteTimetableEntry(selectedEntry.id);
    closeModal();
  };

  const addPeriodRow = () => {
    if (periodCount >= MAX_TIMETABLE_PERIOD_COUNT) return;
    persistLayout({ ...layout, periodCount: periodCount + 1 });
  };

  const removePeriodRow = () => {
    if (periodCount <= MIN_TIMETABLE_PERIOD_COUNT) return;
    const hasDataInLastRow = entries.some((e) => getTimetablePeriod(e) === periodCount);
    if (hasDataInLastRow) {
      const ok = window.confirm(
        `${getPeriodLabel(periodCount)}에 입력된 내용이 있습니다. 교시를 줄이면 해당 행이 숨겨집니다. 계속할까요?`,
      );
      if (!ok) return;
    }
    const nextTimes = { ...periodTimes };
    delete nextTimes[periodCount];
    persistLayout({ ...layout, periodCount: periodCount - 1, periodTimes: nextTimes });
  };

  const addSaturday = () => {
    if (showSaturday) return;
    persistLayout({ ...layout, showSaturday: true });
  };

  const addSunday = () => {
    if (showSunday) return;
    persistLayout({ ...layout, showSunday: true });
  };

  const removeSaturday = () => {
    if (!showSaturday) return;
    const hasData = entries.some((e) => e.dayOfWeek === SATURDAY_INDEX);
    if (hasData && !window.confirm("토요일 칸에 입력된 내용이 있습니다. 숨길까요?")) return;
    persistLayout({ ...layout, showSaturday: false });
  };

  const removeSunday = () => {
    if (!showSunday) return;
    const hasData = entries.some((e) => e.dayOfWeek === SUNDAY_INDEX);
    if (hasData && !window.confirm("일요일 칸에 입력된 내용이 있습니다. 숨길까요?")) return;
    persistLayout({ ...layout, showSunday: false });
  };

  const savePeriodTime = (period: number, range: PeriodTimeRange) => {
    persistLayout({
      ...layout,
      periodTimes: { ...periodTimes, [period]: range },
    });
    setPeriodTimeEdit(null);
  };

  const clearPeriodTime = (period: number) => {
    const nextTimes = { ...periodTimes };
    delete nextTimes[period];
    persistLayout({ ...layout, periodTimes: nextTimes });
    setPeriodTimeEdit(null);
  };

  const gridStyle = {
    gridTemplateColumns: `4.25rem repeat(${visibleDays.length}, minmax(0, 1fr))`,
  };

  return (
    <>
      <div className="rounded-2xl bg-white/90 border border-primary/10 shadow-sm overflow-x-auto">
        <div
          className="grid border-b border-primary/10 bg-primary/5 min-w-[280px]"
          style={gridStyle}
        >
          <div className="py-2 px-1 text-center text-[10px] font-semibold text-gray-500 border-r border-primary/10">
            교시
          </div>
          {visibleDays.map((dayOfWeek) => (
            <div
              key={dayOfWeek}
              className={`py-2 text-center text-[10px] font-semibold border-r border-primary/10 last:border-r-0 ${
                dayOfWeek === SUNDAY_INDEX
                  ? "text-danger/80"
                  : dayOfWeek === SATURDAY_INDEX
                    ? "text-primary/70"
                    : "text-gray-600"
              }`}
            >
              {getWeekdayLabel(dayOfWeek)}
            </div>
          ))}
        </div>

        <div className="divide-y divide-primary/10 min-w-[280px]">
          {gridRows.map((row) => {
            if (row.type === "lunch") {
              return (
                <div key="lunch" className="grid" style={gridStyle}>
                  <div className="flex items-center justify-center px-1 py-2 text-[9px] font-semibold text-amber-700 bg-amber-50/80 border-r border-primary/10 text-center leading-tight">
                    {LUNCH_ROW_LABEL}
                  </div>
                  {visibleDays.map((dayOfWeek) => (
                    <div
                      key={`lunch-${dayOfWeek}`}
                      className="min-h-[2rem] bg-amber-50/40 border-r border-primary/10 last:border-r-0"
                      aria-hidden
                    />
                  ))}
                </div>
              );
            }

            const { period } = row;
            const timeLabel = formatPeriodTimeRange(
              periodTimes[period]?.startTime,
              periodTimes[period]?.endTime,
            );

            return (
              <div key={`period-${period}`} className="grid" style={gridStyle}>
                <button
                  type="button"
                  onClick={() => setPeriodTimeEdit(period)}
                  className="flex flex-col items-center justify-center gap-0.5 px-1 py-2 text-center bg-cream/30 border-r border-primary/10 hover:bg-cream/60 transition-colors"
                  aria-label={`${getPeriodLabel(period)} 수업 시간 설정`}
                >
                  <span className="text-[10px] font-semibold text-primary leading-none">
                    {getPeriodLabel(period)}
                  </span>
                  {timeLabel ? (
                    <span className="text-[8px] text-gray-500 leading-none">{timeLabel}</span>
                  ) : (
                    <span className="text-[8px] text-gray-300 leading-none">시간 설정</span>
                  )}
                </button>
                {visibleDays.map((dayOfWeek) => {
                  const entry = slotMap.get(`${dayOfWeek}-${period}`);
                  return (
                    <button
                      key={`${dayOfWeek}-${period}`}
                      type="button"
                      onClick={() => openCell(dayOfWeek, period)}
                      className={`min-h-[3.25rem] p-1 flex items-center justify-center border-r border-primary/10 last:border-r-0 hover:bg-secondary/10 transition-colors ${
                        entry ? "bg-primary/5" : "bg-white"
                      }`}
                    >
                      {entry ? (
                        <div className="w-full flex flex-col items-center justify-center text-center">
                          <p className="text-[10px] font-semibold text-primary leading-tight line-clamp-2 w-full">
                            {entry.title}
                          </p>
                          {entry.note && (
                            <p className="text-[9px] text-gray-500 mt-0.5 line-clamp-1 w-full">
                              {entry.note}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-[9px] text-gray-300">+</span>
                      )}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] text-gray-500">
          칸을 눌러 과목·활동을 입력하고, 교시 칸을 눌러 수업 시간을 설정하세요.
        </p>
        <div className="flex flex-wrap gap-2 justify-end shrink-0">
          {!showSaturday && (
            <button
              type="button"
              onClick={addSaturday}
              className="text-[10px] px-2.5 py-1.5 rounded-lg border border-primary/20 text-gray-600 hover:bg-cream/50"
            >
              + 토요일
            </button>
          )}
          {showSaturday && (
            <button
              type="button"
              onClick={removeSaturday}
              className="text-[10px] px-2.5 py-1.5 rounded-lg border border-primary/20 text-gray-500 hover:bg-cream/50"
            >
              토요일 숨기기
            </button>
          )}
          {!showSunday && (
            <button
              type="button"
              onClick={addSunday}
              className="text-[10px] px-2.5 py-1.5 rounded-lg border border-primary/20 text-gray-600 hover:bg-cream/50"
            >
              + 일요일
            </button>
          )}
          {showSunday && (
            <button
              type="button"
              onClick={removeSunday}
              className="text-[10px] px-2.5 py-1.5 rounded-lg border border-primary/20 text-gray-500 hover:bg-cream/50"
            >
              일요일 숨기기
            </button>
          )}
          {periodCount > MIN_TIMETABLE_PERIOD_COUNT && (
            <button
              type="button"
              onClick={removePeriodRow}
              className="text-[10px] px-2.5 py-1.5 rounded-lg border border-primary/20 text-gray-600 hover:bg-cream/50"
            >
              교시 줄이기
            </button>
          )}
          {periodCount < MAX_TIMETABLE_PERIOD_COUNT && (
            <button
              type="button"
              onClick={addPeriodRow}
              className="text-[10px] px-2.5 py-1.5 rounded-lg bg-primary/10 text-primary font-semibold hover:bg-primary/15"
            >
              + {getPeriodLabel(periodCount + 1)} 추가
            </button>
          )}
        </div>
      </div>

      {selection && (
        <TimetableCellModal
          open
          dayOfWeek={selection.dayOfWeek}
          period={selection.period}
          entry={selectedEntry}
          titleLabel={titleLabel}
          titlePlaceholder={titlePlaceholder}
          noteLabel={noteLabel}
          notePlaceholder={notePlaceholder}
          onClose={closeModal}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      {periodTimeEdit !== null && (
        <TimetablePeriodTimeModal
          open
          period={periodTimeEdit}
          timeRange={periodTimes[periodTimeEdit] ?? null}
          onClose={() => setPeriodTimeEdit(null)}
          onSave={(range) => savePeriodTime(periodTimeEdit, range)}
          onClear={() => clearPeriodTime(periodTimeEdit)}
        />
      )}
    </>
  );
}
