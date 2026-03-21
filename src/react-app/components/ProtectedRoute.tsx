import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/react-app/context/AuthContext";

export default function ProtectedRoute() {
  const { session, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-poppins">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-lummy-blue border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-400">Carregando…</span>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <Navigate to="/login" replace state={{ from: location.pathname }} />
    );
  }

  return <Outlet />;
}
