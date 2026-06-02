import { useState } from "react";
import { useTaskStore } from "../store/useTaskStore";
import { hasLegacyLocalData } from "../utils/localMigration";

const DISMISS_KEY = "today-planner-migration-dismissed";

export function LocalMigrationPrompt() {
  const isHydrated = useTaskStore((s) => s.isHydrated);
  const tasks = useTaskStore((s) => s.tasks);
  const todayOrder = useTaskStore((s) => s.todayOrder);
  const upcomingOrder = useTaskStore((s) => s.upcomingOrder);
  const userId = useTaskStore((s) => s.userId);
  const isGuestMode = useTaskStore((s) => s.isGuestMode);
  const importLegacySnapshot = useTaskStore((s) => s.importLegacySnapshot);
  const isSyncing = useTaskStore((s) => s.isSyncing);

  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem(DISMISS_KEY) === "1");
  const [importing, setImporting] = useState(false);

  const serverEmpty =
    tasks.length === 0 && todayOrder.length === 0 && upcomingOrder.length === 0;

  if (
    isGuestMode ||
    !isHydrated ||
    dismissed ||
    !serverEmpty ||
    !hasLegacyLocalData() ||
    !userId
  ) {
    return null;
  }

  const handleImport = async () => {
    setImporting(true);
    try {
      await importLegacySnapshot(userId);
      sessionStorage.setItem(DISMISS_KEY, "1");
      setDismissed(true);
    } finally {
      setImporting(false);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div
      className="fixed inset-0 z-[55] flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm rounded-2xl bg-background border border-primary/15 shadow-xl p-5 space-y-4">
        <h2 className="text-base font-bold text-primary">이 기기의 할 일 가져오기</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          이 브라우저에 저장된 할 일이 있습니다. 로그인한 계정으로 옮길까요?
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleDismiss}
            disabled={importing || isSyncing}
            className="flex-1 rounded-xl border border-primary/20 py-2.5 text-sm text-gray-600"
          >
            나중에
          </button>
          <button
            type="button"
            onClick={() => void handleImport()}
            disabled={importing || isSyncing}
            className="flex-1 rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {importing ? "옮기는 중…" : "가져오기"}
          </button>
        </div>
      </div>
    </div>
  );
}
