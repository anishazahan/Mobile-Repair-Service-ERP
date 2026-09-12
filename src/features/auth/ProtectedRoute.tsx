import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "./store";

/** Gates the entire /app/* tree behind a mock session; unauthenticated visitors bounce to /login. */
export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
