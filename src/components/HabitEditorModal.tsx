import { HabitEditor } from "./HabitEditor";
import type { Habit } from "../types/habit";

interface HabitEditorModalProps {
  open: boolean;
  onClose: () => void;
  editingHabit: Habit | null;
  namePlaceholder: string;
  descriptionPlaceholder: string;
}

export function HabitEditorModal({
  open,
  onClose,
  editingHabit,
  namePlaceholder,
  descriptionPlaceholder,
}: HabitEditorModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="habit-editor-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-2xl bg-background border border-primary/15 shadow-xl p-5"
      >
        <h2 id="habit-editor-title" className="text-base font-bold text-primary mb-4">
          {editingHabit ? "습관 수정" : "습관 추가"}
        </h2>
        <HabitEditor
          namePlaceholder={namePlaceholder}
          descriptionPlaceholder={descriptionPlaceholder}
          editingHabit={editingHabit}
          onClearEdit={onClose}
          onSuccess={onClose}
          embedded
        />
      </div>
    </div>
  );
}
