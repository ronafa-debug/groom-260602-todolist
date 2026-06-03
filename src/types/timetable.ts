export interface TimetableEntry {
  id: string;
  /** 0=일 … 6=토 (캘린더와 동일) */
  dayOfWeek: number;
  /** 1교시부터 */
  period: number;
  title: string;
  note?: string;
  /** 이전 목록 형식 호환 */
  startTime?: string;
  endTime?: string;
}
