import { HabitTileGrid } from "./HabitTileGrid";
import { useTaskStore } from "../store/useTaskStore";
import type { Habit } from "../types/habit";
import { toDateString } from "../utils/date";
import { getStreak, isCompletedOn } from "../utils/habit";

interface HabitCardProps {
  habit: Habit;
  onEdit?: (habit: Habit) => void;
  isExample?: boolean;
  exampleCompletedDates?: string[];
  exampleStreak?: number;
}

export function HabitCard({
  habit,
  onEdit,
  isExample = false,
  exampleCompletedDates,
  exampleStreak = 0,
}: HabitCardProps) {
  const habitCompletions = useTaskStore((s) => s.habitCompletions);
  const toggleHabitCompletion = useTaskStore((s) => s.toggleHabitCompletion);
  const deleteHabit = useTaskStore((s) => s.deleteHabit);

  const today = toDateString();
  const completedToday = isExample
    ? false
    : isCompletedOn(habitCompletions, habit.id, today);
  const streak = isExample
    ? exampleStreak
    : getStreak(habit.id, habitCompletions, habit.frequency);

  return (
    <article
      className={`rounded-2xl border bg-white px-4 py-4 shadow-sm space-y-3 ${
        isExample
          ? "border-dashed border-primary/25 opacity-90"
          : "border-primary/10"
      }`}
    >
      <div className="flex items-center gap-2">
        <span
          className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0"
          style={{ backgroundColor: `${habit.color}22` }}
        >
          {habit.icon}
        </span>
        <div className="flex-1 min-w-0 flex items-center gap-2">
          <h3 className="text-sm font-semibold text-gray-800 truncate">{habit.name}</h3>
          {isExample && (
            <span className="shrink-0 text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
              예시
            </span>
          )}
        </div>
        {streak > 0 && (
          <span className="shrink-0 text-xs font-semibold text-amber-700 bg-amber-50 px-2 py-1 rounded-full">
            🔥 {streak}
          </span>
        )}
      </div>

      <HabitTileGrid
        habit={habit}
        completedDates={isExample ? exampleCompletedDates : undefined}
        completionsMap={isExample ? undefined : habitCompletions}
      />

      {!isExample && (
        <>
          <button
            type="button"
            onClick={() => toggleHabitCompletion(habit.id)}
            className={`w-full rounded-xl py-2.5 text-sm font-semibold transition-colors ${
              completedToday
                ? "bg-primary/15 text-primary border-2 border-primary"
                : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {completedToday ? "오늘 완료 ✓" : "오늘 완료하기"}
          </button>

          <div className="flex justify-end gap-1">
            {onEdit && (
              <button
                type="button"
                onClick={() => onEdit(habit)}
                className="text-xs text-primary/80 hover:text-primary px-2 py-1"
              >
                수정
              </button>
            )}
            <button
              type="button"
              onClick={() => deleteHabit(habit.id)}
              className="text-xs text-danger/80 hover:text-danger px-2 py-1"
            >
              삭제
            </button>
          </div>
        </>
      )}
    </article>
  );
}
