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

export interface AuthUser {
  id: string;
  email: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  authError: string | null;
  clearAuthError: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
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

  const login = useCallback(async (email: string, password: string) => {
    setAuthError(null);
    const res = await apiFetch<{ token: string; user: AuthUser }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setToken(res.token);
    setUser(res.user);
  }, []);

  const register = useCallback(async (email: string, password: string) => {
    setAuthError(null);
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
    setUser(null);
    useTaskStore.getState().resetStore();
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      authError,
      clearAuthError: () => setAuthError(null),
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
    [user, loading, authError, login, register, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
