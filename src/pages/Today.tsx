import { SortableTaskList } from "../components/SortableTaskList";
import { useOrderedTasks } from "../hooks/useOrderedTasks";
import { useTaskFilters } from "../hooks/useTaskFilters";

export function Today() {
  const { dueToday } = useTaskFilters();
  const orderedTasks = useOrderedTasks("today", dueToday);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-primary flex items-center gap-2">
        <span>✏️</span> 오늘 마감 일정
      </h2>
      <p className="text-xs text-gray-500">중요도 순: 빨리 → 천천히 → 나중에</p>
      <SortableTaskList
        tasks={orderedTasks}
        listKey="today"
        editable
        emptyMessage="오늘 마감인 일정이 없습니다."
      />
    </div>
  );
}
