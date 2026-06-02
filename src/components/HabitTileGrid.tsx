import type { Habit, HabitCompletions } from "../types/habit";
import { toDateString } from "../utils/date";
import {
  getHabitGridDates,
  getHabitWeekCount,
  isCompletedOn,
  isScheduledDay,
} from "../utils/habit";

interface HabitTileGridProps {
  habit: Pick<Habit, "id" | "color" | "frequency" | "weekCount">;
  completedDates?: string[];
  completionsMap?: HabitCompletions;
}

export function HabitTileGrid({
  habit,
  completedDates,
  completionsMap,
}: HabitTileGridProps) {
  const today = toDateString();
  const gridDays = getHabitGridDates(getHabitWeekCount(habit));
  const completedSet = completedDates
    ? new Set(completedDates)
    : null;

  const isDone = (dateStr: string) => {
    if (completedSet) return completedSet.has(dateStr);
    if (completionsMap) return isCompletedOn(completionsMap, habit.id, dateStr);
    return false;
  };

  return (
    <div className="grid grid-cols-7 gap-0.5">
      {gridDays.map((dateStr) => {
        const scheduled = isScheduledDay(dateStr, habit.frequency);
        const done = isDone(dateStr);
        const isToday = dateStr === today;

        return (
          <div
            key={dateStr}
            title={dateStr}
            className={`aspect-square rounded-sm ${
              isToday ? "ring-1 ring-primary/50" : ""
            }`}
            style={{
              backgroundColor: done
                ? habit.color
                : scheduled
                  ? "#e8ebe9"
                  : "#f3f4f3",
              opacity: scheduled || done ? 1 : 0.5,
            }}
          />
        );
      })}
    </div>
  );
}
