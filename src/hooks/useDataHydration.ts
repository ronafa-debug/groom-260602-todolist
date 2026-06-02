import { useEffect, useRef } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTaskStore } from "../store/useTaskStore";

export function useDataHydration() {
  const { user } = useAuth();
  const hydrateFromServer = useTaskStore((s) => s.hydrateFromServer);
  const resetStore = useTaskStore((s) => s.resetStore);
  const isHydrated = useTaskStore((s) => s.isHydrated);
  const ranRef = useRef(false);

  useEffect(() => {
    if (!user?.id) {
      resetStore();
      ranRef.current = false;
      return;
    }

    if (ranRef.current) return;

    const run = async () => {
      ranRef.current = true;
      await hydrateFromServer(user.id);
    };

    void run();
  }, [user?.id, hydrateFromServer, resetStore]);

  return { isHydrated };
}
