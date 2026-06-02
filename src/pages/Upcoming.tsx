import { SortableTaskList } from "../components/SortableTaskList";
import { useOrderedTasks } from "../hooks/useOrderedTasks";
import { useTaskFilters } from "../hooks/useTaskFilters";

export function Upcoming() {
  const { upcoming } = useTaskFilters();
  const orderedTasks = useOrderedTasks("upcoming", upcoming);

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-primary flex items-center gap-2">
        <span>📝</span> 예정된 일정
      </h2>
      <p className="text-xs text-gray-500">중요도 순: 빨리 → 천천히 → 나중에</p>
      <SortableTaskList
        tasks={orderedTasks}
        listKey="upcoming"
        editable
        groupByDate
        emptyMessage="예정된 일정이 없습니다."
      />
    </div>
  );
}
