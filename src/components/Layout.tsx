import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { GuestModeBanner } from "./GuestModeBanner";
import { useDataHydration } from "../hooks/useDataHydration";
import { CompletionToast } from "./CompletionToast";
import { LocalMigrationPrompt } from "./LocalMigrationPrompt";
import { ModeToggle } from "./ModeToggle";
import { Navbar } from "./Navbar";
import { SyncStatusBanner } from "./SyncStatusBanner";

export function Layout() {
  const { isGuest, signOut } = useAuth();
  useDataHydration();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-primary text-white shadow-sm">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
              <span>📚</span>
              오늘도 수고했어요!
            </h1>
            <p className="text-white/75 text-[11px] mt-0.5">
              교사와 부모를 위한 힐링 플래너
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <ModeToggle />
            {isGuest ? (
              <>
                <Link
                  to="/login"
                  onClick={signOut}
                  className="text-[10px] px-2 py-1 rounded-md border border-white/30 text-white/90 hover:bg-white/15"
                >
                  로그인하기
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="text-[10px] px-2 py-1 rounded-md border border-white/30 text-white/90 hover:bg-white/15"
                >
                  체험 종료
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={signOut}
                className="text-[10px] px-2 py-1 rounded-md border border-white/30 text-white/90 hover:bg-white/15"
              >
                로그아웃
              </button>
            )}
          </div>
        </div>
      </header>

      <GuestModeBanner />
      <SyncStatusBanner />
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      <footer className="text-center text-xs text-gray-400 py-4">
        힐링 Today Planner · 오뚝이아빠 김선생
      </footer>

      <CompletionToast />
      <LocalMigrationPrompt />
    </div>
  );
}
