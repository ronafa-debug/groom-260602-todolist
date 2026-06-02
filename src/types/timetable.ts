export interface TimetableEntry {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  title: string;
  note?: string;
}
