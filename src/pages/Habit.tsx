import { useState } from "react";
import { HabitEditorModal } from "../components/HabitEditorModal";
import { HabitList } from "../components/HabitList";
import { getHabitMeta } from "../data/habits";
import { useTaskStore } from "../store/useTaskStore";
import type { Habit as HabitType } from "../types/habit";

export function Habit() {
  const userMode = useTaskStore((s) => s.userMode);
  const habits = useTaskStore((s) =>
    s.userMode === "teacher" ? s.teacherHabits : s.parentHabits,
  );
  const [editingHabit, setEditingHabit] = useState<HabitType | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const meta = getHabitMeta(userMode);

  const openAddModal = () => {
    setEditingHabit(null);
    setModalOpen(true);
  };

  const openEditModal = (habit: HabitType) => {
    setEditingHabit(habit);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingHabit(null);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <span>{meta.pageIcon}</span>
            {meta.pageTitle}
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            {userMode === "teacher"
              ? "교사 모드 · 업무·자기계발 습관을 기록합니다"
              : "부모 모드 · 가족·육아 습관을 기록합니다"}
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="shrink-0 w-10 h-10 rounded-xl bg-primary flex items-center justify-center hover:bg-primary-dark shadow-sm"
          aria-label="습관 추가"
        >
          <span className="text-white text-2xl font-semibold leading-none">+</span>
        </button>
      </div>

      <HabitList habits={habits} userMode={userMode} onEdit={openEditModal} />

      <HabitEditorModal
        open={modalOpen}
        onClose={closeModal}
        editingHabit={editingHabit}
        namePlaceholder={meta.namePlaceholder}
        descriptionPlaceholder={meta.descriptionPlaceholder}
      />
    </div>
  );
}
