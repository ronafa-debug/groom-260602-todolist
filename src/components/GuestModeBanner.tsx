import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function GuestModeBanner() {
  const { isGuest, signOut } = useAuth();

  if (!isGuest) return null;

  return (
    <div className="bg-amber-50 border-b border-amber-200/80 px-4 py-2 text-center text-xs text-amber-900">
      체험 모드입니다. 회원가입 후 저장·다른 기기에서 이어하기가 가능해요.{" "}
      <Link
        to="/login"
        onClick={signOut}
        className="font-semibold underline underline-offset-2"
      >
        로그인하기
      </Link>
    </div>
  );
}
