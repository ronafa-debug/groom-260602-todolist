import { useTaskStore } from "../store/useTaskStore";
import type { UserMode } from "../types/task";

const modes: { id: UserMode; label: string }[] = [
  { id: "teacher", label: "교사" },
  { id: "parent", label: "부모" },
];

export function ModeToggle() {
  const userMode = useTaskStore((s) => s.userMode);
  const setUserMode = useTaskStore((s) => s.setUserMode);

  return (
    <div
      className="inline-flex shrink-0 rounded-md border border-white/30 bg-white/15 text-[11px] font-medium overflow-hidden backdrop-blur-sm"
      role="group"
      aria-label="사용자 모드"
    >
      {modes.map((mode) => (
        <button
          key={mode.id}
          type="button"
          onClick={() => setUserMode(mode.id)}
          className={`px-2.5 py-1 transition-colors ${
            userMode === mode.id
              ? "bg-white text-primary font-semibold"
              : "text-white/90 hover:bg-white/20"
          }`}
        >
          {mode.label}
        </button>
      ))}
    </div>
  );
}
