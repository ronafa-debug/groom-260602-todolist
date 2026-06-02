import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getApiSetupMessage, isApiConfigured } from "../lib/api";

type Tab = "login" | "register";

export function Login() {
  const { user, loading, authError, clearAuthError, login, register } = useAuth();
  const [tab, setTab] = useState<Tab>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (tab === "register" && password !== passwordConfirm) {
      return;
    }
    setSubmitting(true);
    clearAuthError();
    try {
      if (tab === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch {
      /* authError set in context */
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl bg-white/90 border border-primary/10 shadow-sm p-6 space-y-5">
        <div className="text-center">
          <p className="text-2xl mb-1">📚</p>
          <h1 className="text-xl font-bold text-primary">오늘도 수고했어요!</h1>
          <p className="text-xs text-gray-500 mt-1">교사와 부모를 위한 힐링 Today Planner</p>
          <p className="text-[11px] text-gray-400 mt-0.5">이메일로 회원가입 후 이용할 수 있어요</p>
        </div>

        {!isApiConfigured() && (
          <p className="text-sm text-danger bg-red-50 border border-danger/20 rounded-lg px-3 py-2 leading-relaxed">
            {getApiSetupMessage()}
          </p>
        )}

        <div className="flex rounded-lg border border-primary/15 overflow-hidden text-sm">
          <button
            type="button"
            onClick={() => {
              setTab("login");
              clearAuthError();
            }}
            className={`flex-1 py-2 font-medium ${
              tab === "login" ? "bg-primary text-white" : "text-primary/70 bg-cream/30"
            }`}
          >
            로그인
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("register");
              clearAuthError();
            }}
            className={`flex-1 py-2 font-medium ${
              tab === "register" ? "bg-primary text-white" : "text-primary/70 bg-cream/30"
            }`}
          >
            회원가입
          </button>
        </div>

        {authError && (
          <p className="text-sm text-danger bg-red-50 border border-danger/20 rounded-lg px-3 py-2">
            {authError}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          <label className="flex flex-col gap-1 text-xs text-gray-600">
            이메일
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="rounded-xl border border-primary/20 bg-background px-4 py-2.5 text-sm"
              required
              autoComplete="email"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs text-gray-600">
            비밀번호
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={tab === "register" ? "6자 이상" : "비밀번호"}
              className="rounded-xl border border-primary/20 bg-background px-4 py-2.5 text-sm"
              required
              minLength={tab === "register" ? 6 : undefined}
              autoComplete={tab === "login" ? "current-password" : "new-password"}
            />
          </label>
          {tab === "register" && (
            <label className="flex flex-col gap-1 text-xs text-gray-600">
              비밀번호 확인
              <input
                type="password"
                value={passwordConfirm}
                onChange={(e) => setPasswordConfirm(e.target.value)}
                className="rounded-xl border border-primary/20 bg-background px-4 py-2.5 text-sm"
                required
                minLength={6}
                autoComplete="new-password"
              />
              {passwordConfirm && password !== passwordConfirm && (
                <span className="text-danger text-[11px]">비밀번호가 일치하지 않습니다.</span>
              )}
            </label>
          )}
          <button
            type="submit"
            disabled={
              submitting ||
              !isApiConfigured() ||
              (tab === "register" && password !== passwordConfirm)
            }
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {submitting
              ? "처리 중…"
              : tab === "login"
                ? "로그인"
                : "회원가입"}
          </button>
        </form>
      </div>
    </div>
  );
}
