export function toDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function isToday(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr === toDateString();
}

export function isUpcoming(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr > toDateString();
}

export function isPastDue(dateStr?: string): boolean {
  if (!dateStr) return false;
  return dateStr < toDateString();
}

export function formatDueDate(dateStr?: string): string {
  if (!dateStr) return "마감일 없음";
  const [y, m, d] = dateStr.split("-");
  return `${y}년 ${Number(m)}월 ${Number(d)}일`;
}
