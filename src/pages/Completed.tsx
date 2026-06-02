import { TaskList } from "../components/TaskList";
import { useTaskFilters } from "../hooks/useTaskFilters";

export function Completed() {
  const { completed } = useTaskFilters();

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-primary flex items-center gap-2">
        <span>🍎</span> 완료한 일정
      </h2>
      <TaskList
        tasks={completed}
        emptyMessage="아직 완료한 일정이 없습니다."
      />
    </div>
  );
}
