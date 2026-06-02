import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { apiFetch, clearToken, getToken, isApiConfigured, setToken } from "../lib/api";
import { useTaskStore } from "../store/useTaskStore";
import {
  clearGuestSession,
  isGuestSessionFlag,
  setGuestSessionFlag,
} from "../utils/guestSession";

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isGuest: boolean;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  enterGuestMode: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isGuest, setIsGuest] = useState(() => isGuestSessionFlag());
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    if (isGuestSessionFlag()) {
      setIsGuest(true);
      setLoading(false);
      return;
    }

    if (!isApiConfigured()) {
      setLoading(false);
      return;
    }

    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }

    void apiFetch<{ user: AuthUser }>("/api/auth/me")
      .then((res) => setUser(res.user))
      .catch(() => {
        clearToken();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const enterGuestMode = useCallback(() => {
    setAuthError(null);
    clearToken();
    clearGuestSession();
    setGuestSessionFlag();
    setIsGuest(true);
    setUser(null);
    useTaskStore.getState().setGuestMode(true);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    clearGuestSession();
    setIsGuest(false);
    useTaskStore.getState().setGuestMode(false);
    const res = await apiFetch<{ token: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    clearGuestSession();
    setIsGuest(false);
    useTaskStore.getState().setGuestMode(false);
    const res = await apiFetch<{ token: string; user: AuthUser }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    setUser(res.user);
  }, []);

  const signOut = useCallback(() => {
    setAuthError(null);
    clearToken();
    clearGuestSession();
    setIsGuest(false);
    setUser(null);
    useTaskStore.getState().setGuestMode(false);
    useTaskStore.getState().resetStore();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isGuest,
      loading,
      authError,
      clearAuthError: () => setAuthError(null),
      enterGuestMode,
      login: async (email: string, password: string) => {
        try {
          await login(email, password);
        } catch (err) {
          setAuthError(err instanceof Error ? err.message : "로그인에 실패했습니다.");
          throw err;
        }
      },
      register: async (email: string, password: string) => {
        try {
          await register(email, password);
        } catch (err) {
          setAuthError(err instanceof Error ? err.message : "회원가입에 실패했습니다.");
          throw err;
        }
      },
      signOut,
    }),
    [user, isGuest, loading, authError, enterGuestMode, login, register, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
