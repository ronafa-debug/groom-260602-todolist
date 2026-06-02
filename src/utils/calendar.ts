import { toDateString } from "./date";

export interface CalendarCell {
  date: Date;
  dateStr: string;
  isCurrentMonth: boolean;
}

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function getWeekdayLabels(): string[] {
  return WEEKDAYS;
}

export function getMonthLabel(year: number, month: number): string {
  return `${year}년 ${month + 1}월`;
}

export function getCalendarCells(year: number, month: number): CalendarCell[] {
  const firstOfMonth = new Date(year, month, 1);
  const lastOfMonth = new Date(year, month + 1, 0);
  const startPad = firstOfMonth.getDay();
  const cells: CalendarCell[] = [];

  for (let i = 0; i < startPad; i++) {
    const date = new Date(year, month, -startPad + i + 1);
    cells.push({
      date,
      dateStr: toDateString(date),
      isCurrentMonth: false,
    });
  }

  for (let day = 1; day <= lastOfMonth.getDate(); day++) {
    const date = new Date(year, month, day);
    cells.push({
      date,
      dateStr: toDateString(date),
      isCurrentMonth: true,
    });
  }

  const remainder = cells.length % 7;
  if (remainder > 0) {
    const trailing = 7 - remainder;
    const lastDate = cells[cells.length - 1].date;
    for (let i = 1; i <= trailing; i++) {
      const date = new Date(
        lastDate.getFullYear(),
        lastDate.getMonth(),
        lastDate.getDate() + i,
      );
      cells.push({
        date,
        dateStr: toDateString(date),
        isCurrentMonth: false,
      });
    }
  }

  return cells;
}

export const CALENDAR_TASK_PREVIEW_LIMIT = 3;
