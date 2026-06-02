import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";

interface CategoryManagerPanelProps {
  onClose?: () => void;
}

export function CategoryManagerPanel({ onClose }: CategoryManagerPanelProps) {
  const userMode = useTaskStore((s) => s.userMode);
  const categories = useTaskStore((s) => s.categories[s.userMode]);
  const addCategory = useTaskStore((s) => s.addCategory);
  const updateCategory = useTaskStore((s) => s.updateCategory);
  const deleteCategory = useTaskStore((s) => s.deleteCategory);

  const [newName, setNewName] = useState("");
  const [editingName, setEditingName] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const handleAdd = () => {
    if (!newName.trim()) return;
    addCategory(newName);
    setNewName("");
  };

  const startEdit = (name: string) => {
    setEditingName(name);
    setEditValue(name);
  };

  const saveEdit = () => {
    if (editingName && editValue.trim()) {
      updateCategory(editingName, editValue);
    }
    setEditingName(null);
    setEditValue("");
  };

  const cancelEdit = () => {
    setEditingName(null);
    setEditValue("");
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-primary">카테고리 관리</h3>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="text-xs text-gray-400 hover:text-gray-600"
          >
            닫기
          </button>
        )}
      </div>
      <p className="text-[11px] text-gray-500">
        {userMode === "teacher" ? "교사" : "부모"} 모드 · 마지막 1개는 삭제할 수 없어요
      </p>

      <ul className="space-y-2 max-h-48 overflow-y-auto">
        {categories.map((name) => (
          <li
            key={name}
            className="flex items-center gap-2 rounded-lg border border-primary/10 bg-background px-3 py-2"
          >
            {editingName === name ? (
              <>
                <input
                  type="text"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  className="flex-1 rounded-md border border-primary/20 px-2 py-1 text-sm"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={saveEdit}
                  className="text-xs text-primary font-semibold shrink-0"
                >
                  저장
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-xs text-gray-400 shrink-0"
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <span className="flex-1 text-sm text-gray-800">{name}</span>
                <button
                  type="button"
                  onClick={() => startEdit(name)}
                  className="text-xs text-primary/80 hover:text-primary shrink-0"
                >
                  수정
                </button>
                <button
                  type="button"
                  onClick={() => deleteCategory(name)}
                  disabled={categories.length <= 1}
                  className="text-xs text-danger/80 hover:text-danger shrink-0 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  삭제
                </button>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="새 카테고리 이름"
          className="flex-1 rounded-lg border border-primary/20 bg-background px-3 py-2 text-sm"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-white hover:bg-primary-dark shrink-0"
        >
          추가
        </button>
      </div>
    </div>
  );
}

interface CategoryManagerModalProps {
  open: boolean;
  onClose: () => void;
}

export function CategoryManagerModal({ open, onClose }: CategoryManagerModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="category-manager-title"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl bg-background border border-primary/15 shadow-xl p-5"
      >
        <CategoryManagerPanel onClose={onClose} />
      </div>
    </div>
  );
}
