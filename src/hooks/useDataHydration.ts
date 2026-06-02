import { useEffect, useRef } from "react";
import { getGuestDemoSnapshot } from "../data/guestDemo";
import { useAuth } from "../contexts/AuthContext";
import { useTaskStore } from "../store/useTaskStore";
import { loadGuestSnapshot } from "../utils/guestSession";

export function useDataHydration() {
  const { user, isGuest } = useAuth();
  const hydrateFromServer = useTaskStore((s) => s.hydrateFromServer);
  const loadGuestSession = useTaskStore((s) => s.loadGuestSession);
  const setGuestMode = useTaskStore((s) => s.setGuestMode);
  const resetStore = useTaskStore((s) => s.resetStore);
  const isHydrated = useTaskStore((s) => s.isHydrated);
  const ranRef = useRef(false);
  const lastKeyRef = useRef<string | null>(null);

  useEffect(() => {
    const key = isGuest ? "guest" : user?.id ?? "none";
    if (lastKeyRef.current !== key) {
      ranRef.current = false;
      lastKeyRef.current = key;
    }

    if (isGuest) {
      if (ranRef.current) return;
      ranRef.current = true;
      setGuestMode(true);
      const saved = loadGuestSnapshot();
      if (saved) {
        loadGuestSession(saved);
      } else {
        loadGuestSession(getGuestDemoSnapshot());
      }
      return;
    }

    if (!user?.id) {
      setGuestMode(false);
      resetStore();
      ranRef.current = false;
      return;
    }

    if (ranRef.current) return;

    const run = async () => {
      ranRef.current = true;
      setGuestMode(false);
      await hydrateFromServer(user.id);
    };

    void run();
  }, [user?.id, isGuest, hydrateFromServer, loadGuestSession, setGuestMode, resetStore]);

  return { isHydrated };
}
