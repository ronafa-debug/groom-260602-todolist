import { useTaskStore } from "../store/useTaskStore";

export function SyncStatusBanner() {
  const syncError = useTaskStore((s) => s.syncError);
  const isSyncing = useTaskStore((s) => s.isSyncing);
  const isHydrated = useTaskStore((s) => s.isHydrated);
  const isGuestMode = useTaskStore((s) => s.isGuestMode);

  if (isGuestMode) return null;

  if (!isHydrated && !isSyncing) {
    return (
      <div className="bg-cream border-b border-primary/10 px-4 py-2 text-center text-xs text-primary">
        데이터를 불러오는 중…
      </div>
    );
  }

  if (isSyncing) {
    return (
      <div className="bg-cream border-b border-primary/10 px-4 py-1.5 text-center text-[10px] text-primary/70">
        저장 중…
      </div>
    );
  }

  if (syncError) {
    return (
      <div className="bg-red-50 border-b border-danger/20 px-4 py-2 text-center text-xs text-danger">
        {syncError}
      </div>
    );
  }

  return null;
}
