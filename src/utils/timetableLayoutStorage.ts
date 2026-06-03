import {
  DEFAULT_TIMETABLE_PERIOD_COUNT,
  MAX_TIMETABLE_PERIOD_COUNT,
  MIN_TIMETABLE_PERIOD_COUNT,
} from "../data/timetable";
import type { UserMode } from "../types/task";

export interface PeriodTimeRange {
  startTime: string;
  endTime: string;
}

export interface TimetableLayoutPrefs {
  periodCount: number;
  showSaturday: boolean;
  showSunday: boolean;
  periodTimes: Record<number, PeriodTimeRange>;
}

const STORAGE_KEY = "today-planner-timetable-layout";

type LayoutMap = Partial<Record<UserMode, TimetableLayoutPrefs>>;

const defaultPrefs = (): TimetableLayoutPrefs => ({
  periodCount: DEFAULT_TIMETABLE_PERIOD_COUNT,
  showSaturday: false,
  showSunday: false,
  periodTimes: {},
});

function readMap(): LayoutMap {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as LayoutMap;
  } catch {
    return {};
  }
}

function writeMap(map: LayoutMap): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}

function clampPeriodCount(count: number): number {
  return Math.min(
    MAX_TIMETABLE_PERIOD_COUNT,
    Math.max(MIN_TIMETABLE_PERIOD_COUNT, count),
  );
}

export function getTimetableLayoutPrefs(mode: UserMode): TimetableLayoutPrefs {
  const stored = readMap()[mode];
  if (!stored) return defaultPrefs();

  return {
    periodCount: clampPeriodCount(stored.periodCount ?? DEFAULT_TIMETABLE_PERIOD_COUNT),
    showSaturday: Boolean(stored.showSaturday),
    showSunday: Boolean(stored.showSunday),
    periodTimes: stored.periodTimes ?? {},
  };
}

export function saveTimetableLayoutPrefs(
  mode: UserMode,
  prefs: TimetableLayoutPrefs,
): void {
  const map = readMap();
  map[mode] = {
    ...prefs,
    periodCount: clampPeriodCount(prefs.periodCount),
  };
  writeMap(map);
}

/** @deprecated use getTimetableLayoutPrefs */
export function getStoredTimetablePeriodCount(mode: UserMode): number {
  return getTimetableLayoutPrefs(mode).periodCount;
}

/** @deprecated use saveTimetableLayoutPrefs */
export function setStoredTimetablePeriodCount(mode: UserMode, count: number): void {
  const prefs = getTimetableLayoutPrefs(mode);
  saveTimetableLayoutPrefs(mode, { ...prefs, periodCount: count });
}
