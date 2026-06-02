import { useEffect } from "react";
import { useTaskStore } from "../store/useTaskStore";

export function CompletionToast() {
  const message = useTaskStore((s) => s.lastEncouragement);
  const clear = useTaskStore((s) => s.clearEncouragement);

  useEffect(() => {
    if (!message) return;
    const id = window.setTimeout(clear, 4000);
    return () => window.clearTimeout(id);
  }, [message, clear]);

  if (!message) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)] rounded-xl bg-primary text-white px-5 py-4 shadow-lg"
      role="status"
    >
      <p className="text-sm font-medium text-center">🍎 {message}</p>
      <button
        type="button"
        onClick={clear}
        className="mt-2 w-full text-xs text-white/80 hover:text-white"
      >
        닫기
      </button>
    </div>
  );
}
