import { getExampleHabits } from "../data/habits";
import type { UserMode } from "../types/task";
import type { Habit } from "../types/habit";
import { HabitCard } from "./HabitCard";

interface HabitListProps {
  habits: Habit[];
  userMode: UserMode;
  onEdit: (habit: Habit) => void;
}

export function HabitList({ habits, userMode, onEdit }: HabitListProps) {
  if (habits.length === 0) {
    const examples = getExampleHabits(userMode);
    return (
      <div className="space-y-4">
        <p className="text-xs text-center text-gray-500">
          아래는 예시입니다. 우측 <span className="font-medium">+</span>로 나만의 습관을
          추가해 보세요.
        </p>
        {examples.map(({ habit, completedDates, demoStreak }) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            isExample
            exampleCompletedDates={completedDates}
            exampleStreak={demoStreak}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => (
        <HabitCard key={habit.id} habit={habit} onEdit={onEdit} />
      ))}
    </div>
  );
}
