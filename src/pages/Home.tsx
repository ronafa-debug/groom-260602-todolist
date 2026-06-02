import { EncouragementCard } from "../components/EncouragementCard";
import { ProgressDashboard } from "../components/ProgressDashboard";
import { TaskForm } from "../components/TaskForm";
import { TaskList } from "../components/TaskList";
import { useTaskFilters } from "../hooks/useTaskFilters";
import { toDateString } from "../utils/date";
import { sortByPriority } from "../utils/priority";

export function Home() {
  const { todayFocus, all } = useTaskFilters();
  const today = toDateString();
  const sortedTodayFocus = sortByPriority(todayFocus);

  const todayScope = all.filter(
    (t) => t.dueDate === today || (!t.dueDate && !t.completed),
  );
  const completedToday = todayScope.filter((t) => t.completed).length;

  return (
    <div className="space-y-6">
      <EncouragementCard />
      <TaskForm />
      <section>
        <h2 className="text-sm font-bold text-primary mb-3 flex items-center gap-2">
          <span>✏️</span> 오늘 할 일
        </h2>
        <TaskList
          tasks={sortedTodayFocus}
          emptyMessage="오늘 할 일이 없어요. 새 할 일을 추가해 보세요."
        />
      </section>
      <ProgressDashboard total={todayScope.length} completed={completedToday} />
    </div>
  );
}
