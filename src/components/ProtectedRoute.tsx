import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-sm text-primary">불러오는 중…</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
